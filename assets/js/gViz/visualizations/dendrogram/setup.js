// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var       = null;
  var duration   = 150;
  var action     = 'init';
  var components = null;
  var parent     = null;
  var source     = null;

  // Validate attributes
  let validate = function(step) {
    switch (step) {
      case 'run': return true;
      default: return false;
    }
  };

  // Main function
  var main = function main(step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'run':

          switch (action) {

            // Initialize
            case 'init':

              // Hierarchy layout
              _var.root = d3.hierarchy(_var.data, function (d) { return d.children; });
              _var.root.x0 = _var.height / 2;
              _var.root.y0 = _var.margin.left;

              // Map graph
              _var.getMaxDepth(_var.root);

              // Get max depth
              _var.mapGraph(_var.root);

              // Reset sizes based on tree
              _var.resetSizes();

              break;

            // Update graph
            case 'update':

              // Reset diagonals
              _var.attrs.diagonals = {};

              // Assigns the x and y position for the nodes
              var treeData = _var.treemap(_var.root);

              // Compute the new tree layout.
              var nodes = treeData.descendants().filter(function(c) { return _var.sumLevel == null || c.depth <= _var.sumLevel; }),
                  links = treeData.descendants().slice(1).filter(function(c) { return _var.sumLevel == null || c.depth <= _var.sumLevel; });

              // Get offsets for widths
              nodes.forEach(function (d) {

                // Vertical
                d.x = _var.attrs.depths[`${d.depth}`].acc + (_var.height / _var.attrs.depths[`${d.depth}`].count)/2;
                _var.attrs.depths[`${d.depth}`].acc += (_var.height / _var.attrs.depths[`${d.depth}`].count);

                // Horizontal
                d.y = d.depth * (_var.width / _var.attrs.maxDepth) + (_var.width / _var.attrs.maxDepth)/2;

              });

              // Add _unique nodes
              if(_var.sumLevel != null) {

                Object.keys(_var.attrs._uniques).forEach(function(key) {

                  // Get object
                  var d = _var.attrs._uniques[key];

                  // Vertical
                  d.x = _var.attrs.depths[`${d.depth}`].acc + (_var.height / _var.attrs.depths[`${d.depth}`].count)/2;
                  _var.attrs.depths[`${d.depth}`].acc += (_var.height / _var.attrs.depths[`${d.depth}`].count);

                  // Horizontal
                  d.y = d.depth * (_var.width / _var.attrs.maxDepth) + (_var.width / _var.attrs.maxDepth)/2;

                });

                // Add unique nodes to nodes
                nodes = nodes.concat(Object.keys(_var.attrs._uniques).map(function(key) { return _var.attrs._uniques[key]; } ));
              }

              // Add _unique nodes on links
              if(_var.sumLevel != null) {

                // Filter only nodes on sum level
                nodes.filter(function(d) { return d.depth === _var.sumLevel; }).forEach(function(d) {

                  var uniqueLinks = nodes.filter(function(d) { return d.depth === _var.sumLevel+1; }).map(function(_n) {
                    var n = _n.copy();
                    n.parent = d;
                    n.x0 = _n.x0;
                    n.y0 = _n.y0;
                    n.x = _n.x;
                    n.y = _n.y;
                    return n;
                  });

                  // Add unique nodes to nodes
                  links = links.concat(uniqueLinks);

                });

              }

              // Insert / Update nodes
              var nodeSel = _var.g.selectAll(`g.node-group`).data(nodes, function (d) { return d.data.id; });
              nodeSel.exit().remove();
              nodeSel = nodeSel.enter().append('g').attr('class', 'node-group').merge(nodeSel);
              nodeSel.each(function(n) {

                // Draw node
                components.nodes()
                  ._var(_var)
                  .components(components)
                  //.bindClick(_var.sumLevel == null || n.depth < _var.sumLevel)
                  .parent(parent)
                  .action('draw')
                  .node(n)
                  .nodeObj(this)
                  .source(source)
                  .x(n.x)
                  .y(n.y)
                  .x0(n.x)
                  .y0(n.y)
                  .run();

              });

              // Draw links
              components.links()
                ._var(_var)
                .components(components)
                .action('draw')
                .nodes(nodes)
                .links(links)
                .source(source)
                .run();

              // Store the old positions for transition.
              nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
              });

              // Insert / Update Levels labels
              var levelLabels = Object.keys(_var.attrs.depths).sort(function(a,b) { return d3.ascending(+a,+b); }).map(function(k) { return +k; });
              var levelSel = _var.g.selectAll(`text.level-label`).data(levelLabels);
              levelSel.exit().remove();
              levelSel = levelSel.enter().append('text').attr('class', 'level-label').merge(levelSel);
              levelSel
                .attr('text-anchor', 'middle')
                .attr('x', function(d,i) { return i * (_var.width / _var.attrs.maxDepth) + (_var.width / _var.attrs.maxDepth)/2; } )
                .attr('y', -_var.margin.top/2)
                .style('display','block')
                .text(function(d) { return _var.dataAttrs.labels != null && _var.dataAttrs.labels[d] != null ? _var.dataAttrs.labels[d] : `Level ${d+1}`; })

              // Zoom to specific node passed as parameters
              if(_var.zoomNode != null) {

                // Set width and zoom width
                _var.width = _var._width = _var._width / _var.zWidthPercent;
                _var.zWidth = _var.width * _var.zWidthPercent;

                // Get children from all nodes
                var zRoot = d3.hierarchy(_var.data, function (d) {
                  var children = d.children != null && d.children.length > 0 ? d.children : [];
                  children = children.concat(d._children != null && d._children.length > 0 ? d._children : []);
                  children = children.concat(d._nodes != null && d._nodes.length > 0 ? d._nodes : []);
                  return children;
                });

                // Set all opacity to 0
                _var.g.selectAll(".node-group, .left-link, .link").style("opacity", 0);

                // Get zoom node
                _var.treemap(zRoot).descendants().filter(c => c.data.id === _var.zoomNode).forEach(function(d) {

                  // Zoom to specific node
                  components.zoom()
                    ._var(_var)
                    .components(components)
                    .parent(parent)
                    .action('toNode')
                    .node(d)
                    .nodeObj(null)
                    .x(_var.zHeight/2)
                    .y(_var.zWidth/2)
                    .run();

                });

              } else {

                // Clean breadcrumbs and prev/next arrows
                _var.container.d3.select('[data-id="gViz-wrapper-breadcrumbs"]').html('');
                _var.g.selectAll("g.prev-next-group, rect.bg-rect").remove();

              }

              break;
          }
          break;
      }
    }

    return _var;
  };

  // Expose global variables
  ['_id','_var','animation','action','components','parent','source'].forEach(function(key) {

    // Attach variables to validation function
    validate[key] = function(_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return validate;
    };

    // Attach variables to main function
    return main[key] = function(_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return main;
    };
  });

  // Execute the specific called function
  main.run = _ => main('run');

  return main;
};

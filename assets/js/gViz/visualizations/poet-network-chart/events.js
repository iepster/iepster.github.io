// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var       = null;
  var action     = 'mouseover';
  var components = null;
  var node       = null;
  var _node      = null;
  var nodeSel    = null;

  // Validate attributes
  var validate = function (step) {

    switch (step) {
      case 'run': return true;
      default: return false;
    }
  };

  // Main function
  var main = function (step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Run code
        case 'run':

          // Get hashed node
          if(node != null) { _node = _var._data.nodes[node.id]; }

          switch (action) {

            case 'mouseover':

              // Fade links
              _var.links.transition().style('opacity', function(g) {
                return g.source.id === node.id || (_var._clicked != null && (g.source.id === _var._clicked.id)) ? 1 : 0.1;
              });

              // Fade nodes and add drop shadow
              _var.nodes.transition()
                .style('opacity', function(g) {
                  return g.id === node.id || _node.outEdges[g.id] != null || (_var._clicked != null && (g.id === _var._clicked.id || _var._clicked.outEdges[g.id] != null)) ? 1 : 0.1;
                })
                .style("filter", function(g) { return g === node ? "url(#"+_var.shadowId+")" : ""; })

              // Get x and y values
              var x = (_var.zoomTransform.x) + node.x * _var.zoomTransform.k;
              var y = (_var.zoomTransform.y) + node.y * _var.zoomTransform.k - _var.getRadius(node) * _var.zoomTransform.k;

              // Initialize tooltip object
              var tooltipObj = {};

              // Set node attributes to tooltip obj
              Object.keys(node).forEach(function(k) { tooltipObj[k] = node[k]; });

              // Set values with format
              tooltipObj.value  = _var.nodeFormat(+node.value);
              tooltipObj._value = _var.nodeFormat(+node._value);

              // Set bars component
              shared.visualComponents.tooltip()
                ._var(_var)
                .body(_var.data.tooltip != null && _var.data.tooltip.body != null ? _var.data.tooltip.body : "")
                .borderColor(node.color)
                .hasImg(_var.data.tooltip != null && _var.data.tooltip.hasImg === true)
                .left(_var.wrap.node().getBoundingClientRect().left +_var.margin.left + x)
                .muted(_var.data.tooltip != null && _var.data.tooltip.muted != null && _var.data.tooltip.muted === true)
                .obj(tooltipObj)
                .top(_var.wrap.node().getBoundingClientRect().top + _var.margin.top + y)
                .title(_var.data.tooltip != null && _var.data.tooltip.title != null ? _var.data.tooltip.title : "")
                .run();

              // If there isnt a clicked node
              if(_var.clicked == null) {

                // Update table
                components.table()
                  ._var(_var)
                  .components(components)
                  .node(node)
                  .run();

              } else {

                // Hover table tooltip
                _var.container.d3.closest('.gViz-outer-wrapper').selectAll(".gViz-poet-table-tooltip .node-edge[data-node-id='"+node.id+"']")
                  .style('background-color', node.color)
                  .style('color', "#FFF")

              }

              break;

            case 'mouseout':

              // If there is a clicked node
              var isClicked = _var._clicked == null;

              // Fade links
              _var.links.transition().style('opacity', function(g) { return isClicked || g.source.id === _var._clicked.id ? 1 : 0.1; });

              // Reset nodes and links opacity
              _var.nodes.transition()
                .style('opacity', function(g) { return isClicked || _var._clicked.id === g.id || _var._clicked.outEdges[g.id] != null ? 1 : 0.1; })
                .style('filter', '')

              // Set bars component
              shared.visualComponents.tooltip()
                ._var(_var)
                .action("hide")
                .run();

              // If there is no clicked
              if(_var.clicked == null) { _var.container.d3.closest('.gViz-outer-wrapper').select('.gViz-poet-table-tooltip').html(''); }
              else {

                // Hover table tooltip
                _var.container.d3.closest('.gViz-outer-wrapper').selectAll(".gViz-poet-table-tooltip .node-edge")
                  .style('background-color', 'rgba(255,255,255,0.6)')
                  .style('color', "#666")

              }

              break;

            case 'click':

              // Initialize node extent
              var extent = [null, null];

              // Iterate over nodes
              _var.data.data.nodes.forEach(function(d) {

                // Get hashed node
                var n = _var._data.nodes[d.id];

                // Set value
                n._value = _var._clicked == null || _var._clicked.id === d.id ? n.value : (_var._clicked.outEdges[n.id] == null ? 0 : +_var._clicked.outEdges[n.id].value);

                // If its not the clicked node
                if(_var._clicked == null || _var._clicked.id !== d.id) {

                  // Update extent
                  if(extent[0] == null || extent[0] > n._value) { extent[0] = n._value; }
                  if(extent[1] == null || extent[1] < n._value) { extent[1] = n._value; }

                }

              });

              // Update node scale
              _var.nodeScale.domain(extent);

              // Fade links
              _var.links.transition().style('display', function(g) {
                return _var.clicked == null || g.source === node.id || g.source.id === node.id || (_var._clicked != null && (g.source === _var._clicked.id || g.source.id === _var._clicked.id)) ? 'block' : 'none';
              });

              // Update nodes style
              _var.nodes.transition()
                .attr('r', function(d) { return _var.getRadius(d); })
                .style('fill', function(n) { return _var._clicked != null && n.id === _var._clicked.id ? '#FFF' : n.color; })
                .style('stroke', function(n) { return _var._clicked != null && n.id === _var._clicked.id ? n.color : '#FFF'; })
                .style('display', function(g) {
                  return _var.clicked == null || g.id === node.id || _node.outEdges[g.id] != null || (_var._clicked != null && (g.id === _var._clicked.id || _var._clicked.outEdges[g.id] != null)) ? 'block' : 'none';
                });

              // If there is no clicked
              if(_var.clicked != null) {

                // Update table
                components.table()
                  ._var(_var)
                  .components(components)
                  .node(node)
                  .run();

              }

              break;

          }

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','action','components','node','nodeSel'].forEach(function (key) {

    // Attach variables to validation function
    validate[key] = function (_) {
      if (!arguments.length) {
        eval('return ' + key);
      }
      eval(key + ' = _');
      return validate;
    };

    // Attach variables to main function
    return main[key] = function (_) {
      if (!arguments.length) {
        eval('return ' + key);
      }
      eval(key + ' = _');
      return main;
    };
  });

  // Executa a funcao chamando o parametro de step
  main.run = function (_) {
    return main('run');
  };

  return main;
};

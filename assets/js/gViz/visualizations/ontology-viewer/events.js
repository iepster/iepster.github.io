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
      case 'run': return _var.nodeDragging !== true;
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
                return g.source.id === node.id || _var.searched[g.id] != null || (_var._clicked != null && (g.source.id === _var._clicked.id)) ? 1 : 0.1;
              });

              // Fade nodes text
              _var.nodesText.transition()
                .style('opacity', function(g) {
                  return g.id === node.id || _node.outEdges[g.id] != null || _var.searched[g.id] != null || (_var._clicked != null && (g.id === _var._clicked.id || _var._clicked.outEdges[g.id] != null)) ? 1 : 0.1;
                })

              // Fade nodes and add drop shadow
              _var.nodes.transition()
                .style('opacity', function(g) {
                  return g.id === node.id || _node.outEdges[g.id] != null || _var.searched[g.id] != null || (_var._clicked != null && (g.id === _var._clicked.id || _var._clicked.outEdges[g.id] != null)) ? 1 : 0.1;
                })
                .style("filter", function(g) { return g === node ? "url(#"+_var.shadowId+")" : ""; })

              // Get x and y values
              var x = (_var.zoomTransform.x) + node.x * _var.zoomTransform.k;
              var y = (_var.zoomTransform.y) + node.y * _var.zoomTransform.k - _var.nodeRadius(node) * _var.zoomTransform.k;

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
                _var.container.d3.closest('.gViz-outer-wrapper').selectAll(".gViz-ontology-viewer-table-tooltip .node-edge[data-node-id='"+node.id+"']")
                  .style('background-color', node.color)
                  .style('color', "#FFF")

              }

              break;

            case 'mousemove':

              // Get x and y values
              var x = (_var.zoomTransform.x) + node.x * _var.zoomTransform.k;
              var y = (_var.zoomTransform.y) + node.y * _var.zoomTransform.k - _var.nodeRadius(node) * _var.zoomTransform.k;

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
                .action("updateLocation")
                .body(_var.data.tooltip != null && _var.data.tooltip.body != null ? _var.data.tooltip.body : "")
                .borderColor(node.color)
                .hasImg(_var.data.tooltip != null && _var.data.tooltip.hasImg === true)
                .left(_var.wrap.node().getBoundingClientRect().left +_var.margin.left + x)
                .muted(_var.data.tooltip != null && _var.data.tooltip.muted != null && _var.data.tooltip.muted === true)
                .obj(tooltipObj)
                .top(_var.wrap.node().getBoundingClientRect().top + _var.margin.top + y)
                .title(_var.data.tooltip != null && _var.data.tooltip.title != null ? _var.data.tooltip.title : "")
                .run();

              break;

            case 'mouseout':

              // If there is a clicked node
              var isClicked = _var._clicked != null;
              var hasSearch = _var.search.value.length !== 0;

              // Fade links
              _var.links.transition().style('opacity', function(g) { return (!hasSearch && !isClicked) || (isClicked && g.source.id === _var._clicked.id) ? 1 : 0.1; });

              // Reset nodes opacity
              _var.nodes.transition()
                .style('opacity', function(g) { return _var.searched[g.id] != null || (!hasSearch && !isClicked) || (isClicked && (_var._clicked.id === g.id || _var._clicked.outEdges[g.id] != null)) ? 1 : 0.1; })
                .style("filter", function(g) { return (isClicked && g.id === _var._clicked.id) ? "url(#"+_var.shadowId+")" : ""; })

              // Reset nodes text opacity
              _var.nodesText.transition()
                .style('opacity', function(g) { return _var.searched[g.id] != null || (!hasSearch && !isClicked) || (isClicked && (_var._clicked.id === g.id || _var._clicked.outEdges[g.id] != null)) ? 1 : 0.1; })

              // Set bars component
              shared.visualComponents.tooltip()
                ._var(_var)
                .action("hide")
                .run();

              // If there is no clicked
              if(!isClicked) { _var.container.d3.closest('.gViz-outer-wrapper').select('.gViz-ontology-viewer-table-tooltip').html(''); }
              else {

                // Hover table tooltip
                _var.container.d3.closest('.gViz-outer-wrapper').selectAll(".gViz-ontology-viewer-table-tooltip .node-edge")
                  .style('background-color', 'rgba(255,255,255,0.6)')
                  .style('color', "#666")

              }

              break;

            case 'click':

              // Initialize node extent
              var extent = [null, null];

              // Iterate over nodes
              _var.data.data.nodes.forEach(function(d) {

                // If it is not the clicked node
                if(d !== _var._clicked) {

                  // Get hashed node
                  var n = _var._data.nodes[d.id];

                  // Set value
                  n._value = _var._clicked == null || _var._clicked.id === d.id ? n.value : (_var._clicked.outEdges[n.id] == null ? 0 : +_var._clicked.outEdges[n.id].value);

                  // Update extent
                  if(extent[0] == null || extent[0] > n._value) { extent[0] = n._value; }
                  if(extent[1] == null || extent[1] < n._value) { extent[1] = n._value; }

                }

              });

              // If there is a clicked node
              if(_var._clicked != null) {

                // Set _value for clicked node
                _var._clicked._value = 0;
                Object.keys(_var._clicked.outEdges).forEach(function(k) { _var._clicked._value += _var._data.nodes[k]._value; });

                // Update extent
                if(extent[0] == null || extent[0] > _var._clicked._value) { extent[0] = _var._clicked._value; }
                if(extent[1] == null || extent[1] < _var._clicked._value) { extent[1] = _var._clicked._value; }
              }

              // Update node scale
              _var.nodeScale.domain(extent);

              // Fade links
              _var.links.transition().style('display', function(g) {
                return _var.clicked == null || g.source === node.id || g.source.id === node.id || (_var._clicked != null && (g.source === _var._clicked.id || g.source.id === _var._clicked.id)) ? 'block' : 'none';
              });

              // Update nodes style
              _var.nodes.transition()
                .attr('r', function(d) { return _var.nodeRadius(d); })
                .style('display', function(g) {
                  return _var.clicked == null || g.id === node.id || _node.outEdges[g.id] != null || (_var._clicked != null && (g.id === _var._clicked.id || _var._clicked.outEdges[g.id] != null)) ? 'block' : 'none';
                })
                .style("filter", function(g) { return (_var._clicked != null && g.id === _var._clicked.id) ? "url(#"+_var.shadowId+")" : ""; })

              // Reset nodes text opacity
              _var.nodesText.transition().style('display', function(g) {
                return _var.clicked == null || g.id === node.id || _node.outEdges[g.id] != null || (_var._clicked != null && (g.id === _var._clicked.id || _var._clicked.outEdges[g.id] != null)) ? 'block' : 'none';
              });

              // Update table
              components.table()
                ._var(_var)
                .components(components)
                .node(node)
                .run();

              break;

            case 'search':

              // If there is a search
              var isClicked = _var._clicked != null;
              var hasSearch = _var.search.value.length !== 0;

              // Fade links
              _var.links.transition().style('opacity', function(g) {
                return !hasSearch || (isClicked && (g.source.id === _var._clicked.id)) ? 1 : 0.1;
              });

              // Fade nodes text
              _var.nodesText.transition()
                .style('opacity', function(g) {
                  return !hasSearch || _var.searched[g.id] != null || (isClicked && (g.id === _var._clicked.id || _var._clicked.outEdges[g.id] != null)) ? 1 : 0.1;
                })

              // Fade nodes and add drop shadow
              _var.nodes.transition()
                .style('opacity', function(g) {
                  return !hasSearch || _var.searched[g.id] != null || (isClicked && (g.id === _var._clicked.id || _var._clicked.outEdges[g.id] != null)) ? 1 : 0.1;
                })

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

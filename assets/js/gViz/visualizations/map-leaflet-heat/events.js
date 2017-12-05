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

          // Set shapes and bars
          var bars   = _var.g.select('.chart-elements').selectAll('.bar, .bottom-bar, .bar-circle');
          var pointEls = _var.g.select('.chart-elements').selectAll('.point-element');
          var points = _var.g.select('.chart-elements').selectAll('.point');

          // Store node
          _node = node;

          switch (action) {

            case 'mouseover':

              // If the node exists
              if(node != null) {

                // Fade bars
                bars.transition()
                  .style('opacity', function(g) { return g.id === node.id ? 1 : 0.2; })
                  .style("filter", function(g) { return g === node ? "url(#"+_var.shadowId+")" : ""; })

                // Show / Hide point groups
                pointEls
                  .style('display', function(g) { return g.id === node.id && node.draggable != null && node.draggable === true ? 'block' : 'none'; })

                // Fade points
                points.transition().style("filter", function(g) { return g === node ? "url(#"+_var.shadowId+")" : ""; })

                // Get variables to calculate position
                var isDraggable = node.draggable != null && node.draggable === true;
                var translate = _var.wrap.style("transform").replace(/px/g, '').replace(/translate3d/g, 'translate').replace(/, 0\)/g, ')');
                var t = shared.helpers.selection.getTransformation(translate);

                // Get x and y values
                var x = _var.map.latLngToLayerPoint(node).x - t.translateX;
                var y = _var.map.latLngToLayerPoint(node).y - t.translateY;

                // Get left and top positions
                var left = _var.wrap.node().getBoundingClientRect().left + x;
                var top  = _var.wrap.node().getBoundingClientRect().top + y - _var.barHeight(node) - (isDraggable ? 10 : 5);

                // Initialize tooltip object
                var tooltipObj = { properties: {} };

                // Set color
                tooltipObj.color =_var.barColor(node);

                // Set node attributes to tooltip obj
                Object.keys(node).forEach(function(k) { tooltipObj[k] = node[k]; });

                // Set bars component
                var tooltip = _var.data.tooltip;
                shared.visualComponents.tooltip()
                  ._var(_var)
                  .body(_var.data.tooltip != null && _var.data.tooltip.body != null ? _var.data.tooltip.body : "")
                  .muted(_var.data.tooltip != null && _var.data.tooltip.muted != null && _var.data.tooltip.muted === true)
                  .borderColor(tooltip.borderColor != null ? tooltip.borderColor : _var.barColor(node))
                  .backgroundColor(tooltip.backgroundColor != null ? tooltip.backgroundColor : null)
                  .left(left)
                  .hasImg(_var.data.tooltip != null && _var.data.tooltip.hasImg === true)
                  .obj(tooltipObj)
                  .top(top)
                  .title(_var.data.tooltip != null && _var.data.tooltip.title != null ? _var.data.tooltip.title : "")
                  .run();

                // Initialize tooltipTable object
                var tooltipTableObj = { properties: {} };

                // Set color
                tooltipTableObj.color =_var.barColor(node);

                // Set node attributes to tooltipTable obj
                Object.keys(node).forEach(function(k) { tooltipTableObj[k] = node[k]; });

                // Set bars component
                var tooltipTable = _var.data.tooltipTable;
                shared.visualComponents.tooltipTable()
                  ._var(_var)
                  .body(tooltipTable != null && tooltipTable.body != null ? tooltipTable.body : "")
                  .borderColor(tooltipTable.borderColor != null ? tooltipTable.borderColor : _var.barColor(node))
                  .backgroundColor(tooltipTable.backgroundColor != null ? tooltipTable.backgroundColor : null)
                  .hasImg(tooltipTable != null && tooltipTable.hasImg === true)
                  .muted(tooltipTable != null && tooltipTable.muted != null && tooltipTable.muted === true)
                  .obj(tooltipTableObj)
                  .target(_var.container.d3.closest('.gViz-outer-wrapper').select('.gViz-map-table-tooltip'))
                  .title(tooltipTable != null && tooltipTable.title != null ? tooltipTable.title : "")
                  .left(10)
                  .bottom(10)
                  .run();

              }

              break;

            case 'mouseout':

              // Reset opacity and filter
              bars.transition().style('opacity', 1).style("filter", "")

              // Show / Hide point groups
              pointEls.style('display', 'none')

              // Fade points
              points.transition().style("filter", "")

              // Hide tooltipTable
              shared.visualComponents.tooltipTable()
                ._var(_var)
                .action("hide")
                .target(_var.container.d3.closest('.gViz-outer-wrapper').select('.gViz-map-table-tooltip'))
                .run();

              // Hide tooltip
              shared.visualComponents.tooltip()
                ._var(_var)
                .action("hide")
                .run();

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

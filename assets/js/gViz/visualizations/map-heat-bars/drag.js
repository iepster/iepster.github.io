// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = null;
  var components = {};

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

        // Build entire visualizations
        case 'run':

          // Start the drag action
          _var.dragstarted = function (d) {

            // Set dragging node to true
            _var.nodeDragging = true;

            // Set bars component
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

            // Trigger onDragStart attribute function
            if(_var.onDragStart != null && typeof _var.onDragStart === "function") { _var.onDragStart(d); }

          }

          // While dragging
          _var.dragging = function (d) {
            var position = -d3.mouse(this)[1] * _var.getZoomTransform();
            if(position >= _var.bottomBarHeight(d)) {
              d.value = _var.barScale.invert(position);
              d3.select(this).selectAll(".point.element").attr("d", _var.pointPath).attr("fill", _var.draggableColor);
              d3.select(this).selectAll(".arrow.element").attr("d", _var.arrowsPath).attr("fill", _var.arrowsColor);
              d3.select(this).selectAll(".bg-point.element").attr("cy", _var.barY)
              _var.container.d3.selectAll(".bar").filter(function(g) { return g === d; })
                .attr('height', _var.barHeight)
                .attr('y', _var.barY)
                .attr('fill', _var.barColor)
              _var.container.d3.selectAll(".bar-circle").filter(function(g) { return g === d; })
                .attr('cy', _var.barY)
                .attr('fill', _var.barColor)

            }
          }

          // End the drag action
          _var.dragended = function (d) {

            // Set dragging node to true
            _var.nodeDragging = false;

            // Update point Els visibility
            if(_var.hovered !== d.id) { d3.select(this).style("display", "none"); }

            // Trigger onDragEnd attribute function
            if(_var.onDragEnd != null && typeof _var.onDragEnd === "function") { _var.onDragEnd(d); }

          }

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','components'].forEach(function (key) {

    // Attach variables to validation function
    validate[key] = function (_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return validate;
    };

    // Attach variables to main function
    return main[key] = function (_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return main;
    };
  });

  // Executa a funcao chamando o parametro de step
  main.run = _ => main('run');

  return main;
};

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

            // Remove tooltip while dragging
            shared.visualComponents.tooltip()
              ._var(_var)
              .action("hide")
              .run();

            // Remove area
            _var.g.selectAll(".area-between").style('display', 'none');

            // Remove mouse events from elements
            _var.g.selectAll(".chart-elements").selectAll(".element-group").style("filter", "").style('opacity', 1);
            _var.g.selectAll(".chart-elements").selectAll(".element-group").selectAll('.point-group').style("filter", "").style('opacity', 1);
            _var.g.selectAll(".chart-elements").selectAll(".element-group").selectAll('.line').style("filter", "").style('opacity', 1);


            // Trigger onDragStart attribute function
            if(_var.onDragStart != null && typeof _var.onDragStart === "function") { _var.onDragStart(d); }

          }

          // While dragging
          _var.dragging = function (d) {
            var value = _var.y.invert(d3.mouse(this)[1]);
            d.y = value > _var.y.domain()[1] ? _var.y.domain()[1] : (value < _var.y.domain()[0] ? _var.y.domain()[0] : value);
            d3.select(this).selectAll(".point.element, .bg-point.element").attr("d", function(d) { return _var.pointPath(d, true); });
            d3.select(this).selectAll(".arrow.element").attr("d", function(d) { return _var.arrowsPath(d); });
            _var.container.d3.selectAll(".line[data-id='"+d._parentId+"']").attr("d", function (d) { return _var.lineConstructor(d.values); })
          }

          // End the drag action
          _var.dragended = function (d) {

            // Set dragging node to true
            _var.nodeDragging = false;

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

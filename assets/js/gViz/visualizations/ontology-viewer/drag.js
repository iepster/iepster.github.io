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

            if (!d3.event.active) _var.simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;

            // Set dragging node to true
            _var.nodeDragging = true;

            // Set bars component
            shared.visualComponents.tooltip()
              ._var(_var)
              .action("hide")
              .run();

          }

          // While dragging
          _var.dragging = function (d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          }

          // End the drag action
          _var.dragended = function (d) {

            if (!d3.event.active) _var.simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;

            // Set dragging node to true
            _var.nodeDragging = false;

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

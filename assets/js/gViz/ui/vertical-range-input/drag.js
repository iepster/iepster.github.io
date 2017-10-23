// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = null;

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
            if (!d3.event.active) {

              // Set y
              var y = d3.event.y <= -10 ? -10 : (d3.event.y >= _var.height + 10 ? _var.height - 10 : d3.event.y);
              var yValue = _var.y.invert(y+10);
              d3.event.y = y;

              // Update elements
              var g = d3.select(this);
              g.attr("transform", "translate(-1," + y + ")");
              g.selectAll('.drag-text').text(_var.yFormat(yValue));

              // Trigger onInput
              _var.onInput(yValue);

            }
          }

          // While dragging
          _var.dragging = function (d) {

            // Set y
            var y = d3.event.y <= -10 ? -10 : (d3.event.y >= _var.height - 10 ? _var.height - 10 : d3.event.y);
            var yValue = _var.y.invert(y+10);
            d3.event.y = y;

            // Update elements
            var g = d3.select(this);
            g.attr("transform", "translate(-1," + y + ")");
            g.selectAll('.drag-text').text(_var.yFormat(yValue));

            // Trigger onInput
            _var.onInput(yValue);

          }

          // End the drag action
          _var.dragended = function (d) {
            if (!d3.event.active) {

              // Set y
              var y = d3.event.y <= -10 ? -10 : (d3.event.y >= _var.height - 10 ? _var.height - 10 : d3.event.y);
              var yValue = _var.y.invert(y+10);
              d3.event.y = y;

              // Update elements
              var g = d3.select(this);
              g.attr("transform", "translate(-1," + y + ")");
              g.selectAll('.drag-text').text(_var.yFormat(yValue));

              // Trigger onChange and onInput
              _var.onInput(yValue);
              _var.onChange(yValue);

            }
          }

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var'].forEach(function (key) {

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

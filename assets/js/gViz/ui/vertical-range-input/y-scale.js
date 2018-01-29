// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;

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

          // Initialize scale
          _var.y = d3.scaleLinear().range([_var.height, 0]);

          // Set x domain
          _var.yBounds = [_var.min, _var.max];
          _var.y.domain(_var.yBounds).nice();

          // Set format
          _var.yFormat = shared.helpers.number.parseFormat({ prefix: _var.prefix, suffix: _var.suffix, format: _var.format });

          // Get y axis ticks
          var bins = d3.max([3, parseInt(_var.height / 25, 10)]);

          // Define y axis
          _var.yAxis = d3.axisLeft(_var.y).ticks(bins).tickFormat(_var.yFormat);

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var'].forEach(function (key) {

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

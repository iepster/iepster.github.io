// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var data = [];

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
          _var.xLeft = d3.scaleLinear().range([_var.width/2, 0]);

          // Define aux variables
          var min = null,
              max = null,
              diff = null;

          // Get bounds
          data.forEach(function(d) {

            // Set domain from xIn values
            d.values.forEach(function(v) {

              // Update min and max based on data
              if(min == null || min > +v.xLeft.x) { min = +v.xLeft.x; }
              if(max == null || max < +v.xLeft.x) { max = +v.xLeft.x; }

            });
          });

          // Get axis target
          if(_var.data.xLeft != null && _var.data.xLeft.target != null && !isNaN(+_var.data.xLeft.target)) {
            _var.xLeftTarget = +_var.data.xLeft.target;
            if(min == null || min > +_var.data.xLeft.target) { min = +_var.data.xLeft.target; }
            if(max == null || max < +_var.data.xLeft.target) { max = +_var.data.xLeft.target; }
          }

          // Check for default values
          if(isNaN(min)) { min = 0; }
          if(isNaN(max)) { max = 1; }

          // Get mix and max values for axis set from json
          if(_var.data.xLeft != null && _var.data.xLeft.min != null && !isNaN(+_var.data.xLeft.min) && +_var.data.xLeft.min < min) { min = +_var.data.xLeft.min; }
          if(_var.data.xLeft != null && _var.data.xLeft.max != null && !isNaN(+_var.data.xLeft.max) && +_var.data.xLeft.max > max) { max = +_var.data.xLeft.max; }

          // Get diff
          var diff = Math.abs(max - min) === 0 ? Math.abs(max * 0.001) : 0;

          // Get axis equal
          if(_var.data.xLeft != null && _var.data.xLeft.equal != null && _var.data.xLeft.equal === true && max > 0 && min < 0) {
            if(Math.abs(max) > Math.abs(min)) { min = -max; }
            else { max = Math.abs(min); }
          }

          // Set x domain
          _var.xLeftBounds = [(min == 0 ? min : min - diff), max + diff];
          _var.xLeft.domain(_var.xLeftBounds).nice();

          // Set format
          _var.xLeftFormat = shared.helpers.number.parseFormat(_var.data == null ? null : _var.data.xLeft);

          // Get x axis ticks
          var bins = d3.max([3, parseInt(_var.height / 100, 10)]);

          // Define x axis
          _var.xLeftAxis = d3.axisBottom(_var.xLeft).ticks(bins).tickPadding(10).tickFormat(_var.xLeftFormat);

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','data'].forEach(function (key) {

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

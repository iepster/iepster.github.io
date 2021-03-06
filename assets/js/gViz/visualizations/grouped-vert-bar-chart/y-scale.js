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

          // Define aux variables
          var min = null,
              max = null,
              diff = null;

          // Get bounds
          data.forEach(function(d) {

            // Get wrap value, if exists, and update the domain
            var wrapValue = null;
            if(_var.hasWrapper(d.wrap)) {
              if(_var.wrapperType(d.wrap) === 'metric') { d.y = wrapValue = d3[d.wrap](d.values, function(v) { return +v.y; }); }
              else { d.y = wrapValue = +d.wrap; }
            }

            // Update domain
            if(wrapValue != null && (min == null || min > +wrapValue)) { min = +wrapValue; }
            if(wrapValue != null && (max == null || max < +wrapValue)) { max = +wrapValue; }

            // Set domain from xIn values
            d.values.forEach(function(v) {
              if(min == null || min > +v.y) { min = +v.y; }
              if(max == null || max < +v.y) { max = +v.y; }
            });
          });

          // Get axis target
          if(_var.data.y != null && _var.data.y.target != null && !isNaN(+_var.data.y.target)) {
            _var.yTarget = +_var.data.y.target;
            if(min == null || min > +_var.data.y.target) { min = +_var.data.y.target; }
            if(max == null || max < +_var.data.y.target) { max = +_var.data.y.target; }
          }

          // Check for default values
          if(isNaN(min)) { min = 0; }
          if(isNaN(max)) { max = 1; }

          // Get diff
          var diff = Math.abs(max - min) === 0 ? Math.abs(max * 0.1) : 0;

          // Get axis equal
          if(_var.data.y != null && _var.data.y.equal != null && _var.data.y.equal === true && max > 0 && min < 0) {
            if(Math.abs(max) > Math.abs(min)) { min = -max; }
            else { max = Math.abs(min); }
          }

          // Set y domain
          _var.yBounds = [(min == 0 ? min : min - diff), max + diff];

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

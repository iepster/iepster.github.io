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
          _var.yLeft = d3.scaleLinear().range([_var.height, 0]);

          // Define aux variables
          var min = null,
              max = null,
              diff = null;

          // Get bounds
          data.forEach(function(d) {
            if((min == null &&  d.yBar  != null && !isNaN(+d.yBar) ) || (d.yBar  != null && !isNaN(+d.yBar)  && min > +d.yBar )) { min = +d.yBar; }
            if((max == null &&  d.yBar  != null && !isNaN(+d.yBar) ) || (d.yBar  != null && !isNaN(+d.yBar)  && max < +d.yBar )) { max = +d.yBar; }
          });

          // Get axis target
          if(_var.data.yLeft != null && _var.data.yLeft.target != null && !isNaN(+_var.data.yLeft.target)) {
            _var.yTarget = +_var.data.yLeft.target;
            if(min == null || min > +_var.data.yLeft.target) { min = +_var.data.yLeft.target; }
            if(max == null || max < +_var.data.yLeft.target) { max = +_var.data.yLeft.target; }
          }

          // Check for default values
          if(isNaN(min)) { min = 0; }
          if(isNaN(max)) { max = 1; }

          // Get diff
          var diff = Math.abs(max - min) === 0 ? Math.abs(max * 0.1) : Math.abs(max - min) * 0.05;

          // Set x domain
          _var.yLeftBounds = [min, max]; //(min == 0 ? min : min - diff), max + diff];
          _var.yLeft.domain(_var.yLeftBounds).nice();

          // Set format
          _var.yLeftFormat = shared.helpers.number.parseFormat(_var.data == null ? null : _var.data.yLeft);

          // Define y axis
          _var.yLeftAxis = d3.axisLeft(_var.yLeft).tickPadding(10).tickFormat(_var.yLeftFormat);

          // Display yLeft axis
          if(_var.data.yLeft != null && _var.data.yLeft.isVisible !== false) {

            // Update margin left and width
            _var.width += _var.margin.left;
            _var.margin.left = 5 + d3.max(_var.yLeftAxis.scale().ticks().map(function(d) { return shared.helpers.text.getSize(_var.yLeftFormat(d)); }));
            _var.width -= _var.margin.left;

          }

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

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
          _var.x = d3.scaleLinear().range([0, _var.width]);

          // Define aux variables
          var min = null,
              max = null,
              diff = null;

          // Get bounds
          data.forEach(function(d) {

            // Get wrap value, if exists, and update the domain
            var wrapValue = null;
            if(_var.hasWrapper(d.wrap)) {
              if(_var.wrapperType(d.wrap) === 'metric') { d.x = wrapValue = d3[d.wrap](d.values, function(v) { return +v.x; }); }
              else { d.x = wrapValue = +d.wrap; }
            }

            // Update domain
            if(wrapValue != null && (min == null || min > +wrapValue)) { min = +wrapValue; }
            if(wrapValue != null && (max == null || max < +wrapValue)) { max = +wrapValue; }

            // Set domain from xIn values
            d.values.forEach(function(v) {
              if(min == null || min > +v.x) { min = +v.x; }
              if(max == null || max < +v.x) { max = +v.x; }
            });
          });

          // Get axis target
          if(_var.data.x != null && _var.data.x.target != null && !isNaN(+_var.data.x.target)) {
            _var.xTarget = +_var.data.x.target;
            if(min == null || min > +_var.data.x.target) { min = +_var.data.x.target; }
            if(max == null || max < +_var.data.x.target) { max = +_var.data.x.target; }
          }

          // Check for default values
          if(isNaN(min)) { min = 0; }
          if(isNaN(max)) { max = 1; }

          // Get mix and max values for axis set from json
          if(_var.data.x != null && _var.data.x.min != null && !isNaN(+_var.data.x.min) && +_var.data.x.min < min) { min = +_var.data.x.min; }
          if(_var.data.x != null && _var.data.x.max != null && !isNaN(+_var.data.x.max) && +_var.data.x.max > max) { max = +_var.data.x.max; }

          // Get diff
          var diff = Math.abs(max - min) === 0 ? Math.abs(max * 0.1) : 0;

          // Get axis equal
          if(_var.data.x != null && _var.data.x.equal != null && _var.data.x.equal === true && max > 0 && min < 0) {
            if(Math.abs(max) > Math.abs(min)) { min = -max; }
            else { max = Math.abs(min); }
          }

          // Set x domain
          _var.xBounds = [(min == 0 ? min : min - diff), max + diff];
          _var.x.domain(_var.xBounds).nice();

          // Set format
          _var.xFormat = shared.helpers.number.parseFormat(_var.data == null ? null : _var.data.x);

          // Get x axis ticks
          var bins = d3.max([3, parseInt(_var.height / 100, 10)]);

          // Define x axis
          _var.xAxis = d3.axisBottom(_var.x).ticks(bins).tickPadding(10).tickFormat(_var.xFormat);

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

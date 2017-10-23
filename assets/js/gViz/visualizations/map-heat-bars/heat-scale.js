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

          // Map heat colors entry
          if(_var.data.heat == null || _var.data.heat.colors == null || _var.data.heat.colors.length === 0) { _var.heatColors = ["#bbb","#444"]; }
          else {

            // Map data for d3 color
            var colors = _var.data.heat.colors.map(function(d) { return d3.color(d); }).filter(function(d) { return d != null; });

            // Define scales
            if(colors.length === 0) { _var.heatColors = ["#bbb","#444"]; }
            else if(colors.length === 1) { _var.heatColors = [colors[0], colors[0].darker(3)]; }
            else { _var.heatColors = colors; }

          }

          // Initialize scale
          _var.heatScale = d3.scaleLinear().range(_var.heatColors);

          // Initialize hash values
          _var.heatData = {}

          // Define aux variables
          var min = null,
              max = null,
              diff = null;

          // Get bounds
          data.forEach(function(d) {

            // Store heat data for faster use
            _var.heatData[d.id] = d;

            // Set domain from values
            if(min == null || min > +d.value) { min = +d.value; }
            if(max == null || max < +d.value) { max = +d.value; }

          });

          // Check for default values
          if(isNaN(min)) { min = 0; }
          if(isNaN(max)) { max = 1; }

          // Get diff
          var diff = Math.abs(max - min) === 0 ? Math.abs(max * 0.1) : Math.abs(max - min) * 0.05;

          // Set x domain
          _var.heatBounds = [min, max];
          _var.heatScale.domain(_var.heatBounds);

          // Set format
          _var.heatFormat = shared.helpers.number.parseFormat(_var.data == null ? null : _var.data.heat);

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

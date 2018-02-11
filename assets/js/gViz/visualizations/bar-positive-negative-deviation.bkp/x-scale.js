// Imports
var utilsData = require('./utils-data.js');
var d3 = require("d3");
var shared = require("../../shared/_init.js");
// the x scale refers to the scale of the bottom(negative) bars
// Initialize the visualization class
module.exports = function () {
  "use strict";
  // Get attributes values

  var rangeMap = utilsData.rangeMap;
  var xAxisTicks = utilsData.xAxisTicks;
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

          // Define the x scale
          _var.x = d3.scaleLinear().range([10, _var.width - 10]);
          _var.x.domain(rangeMap[_var.negativeRange]);

          // Get axis format with prefix and sufix
          var prefix = _var.data.x != null && _var.data.x.prefix != null ? _var.data.x.prefix : "";
          var sufix  = _var.data.x != null && _var.data.x.sufix != null ? _var.data.x.sufix : "";
          _var.xFormat = function(d) { return prefix + shared.helpers.number.format.s(+d).toUpperCase() + sufix; };

          // Get x axis ticks
          _var.xTicks = xAxisTicks;

          // set the xAxis scale, ticks, format
          _var.xAxis = d3.axisBottom(_var.x).tickValues(_var.xTicks).tickPadding(10).tickFormat(_var.xFormat);
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

// Imports
var utilsData = require('./utils-data.js');
var d3 = require("d3");
var shared = require("../../shared/_init.js");
// the x scale top refers to the scale of the top(positive) bars
// Initialize the visualization class
module.exports = function () {
  "use strict";

  var rangeMap = utilsData.rangeMap;
  var xAxisTicks = utilsData.xAxisTicks;

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

          // Define scale
          _var.xTop = d3.scaleLinear().range([10, _var.width - 10]);
          _var.xTop.domain(rangeMap[_var.positiveRange]);

          // Get axis format with prefix and sufix
          var prefix = _var.data.x != null && _var.data.x.prefix != null ? _var.data.x.prefix : "";
          var sufix  = _var.data.x != null && _var.data.x.sufix != null ? _var.data.x.sufix : "";
          _var.xFormat = function(d) { return prefix + shared.helpers.number.format.s(+d).toUpperCase() + sufix; };

          // Get x axis tick values
          _var.xTicksTop = xAxisTicks;

          // set the xAxisTop scale, ticks, format
          _var.xAxisTop = d3.axisTop(_var.xTop).tickValues(_var.xTicksTop).tickPadding(10).tickFormat(_var.xFormat);

          break;
      }
    }

    return _var;
  };

  // Run thorugh the global variables
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

  // execute the main fn of the step parameters ('run')
  main.run = function (_) {
    return main('run');
  };

  return main;
};

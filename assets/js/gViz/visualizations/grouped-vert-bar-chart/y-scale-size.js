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

          // Create scale
          _var.y = d3.scaleLinear().range([_var.height, 0]);
          _var.y.domain(_var.yBounds).nice();

          // Set format
          _var.yFormat = shared.helpers.number.parseFormat(_var.data == null ? null : _var.data.y);

          // Get y axis ticks
          var bins = d3.max([3, parseInt(_var.height / 40, 10)]);

          // Define y axis
          _var.yAxis = d3.axisLeft(_var.y).ticks(bins).tickPadding(10).tickFormat(_var.yFormat);

          // Adjust width and margin based on screenMode
          if(_var.screenMode === 'portrait' || _var.screenMode === 'portrait-primary' || _var.screenMode === 'portrait-secondary') {
            _var.width += _var.margin.left;
            _var.margin.left = 5;
            _var.width -= _var.margin.left;
          } else {
            _var.width += _var.margin.left;
            _var.margin.left = 5 + d3.max(_var.yAxis.scale().ticks().map(function(d) { return shared.helpers.text.getSize(_var.yFormat(d)); }));
            _var.width -= _var.margin.left;
          }

          // Update x for d3 zoom transform
          _var.zoomTransform.x = _var.margin.left;

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

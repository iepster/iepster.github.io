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
          _var.yRight = d3.scaleLinear().range([_var.height, 0]);

          // Define aux variables
          var min = null,
              max = null,
              diff = null;

          // Get bounds
          data.forEach(function(d) {
            if((min == null &&  d.yLine != null && !isNaN(+d.yLine)) || (d.yLine != null && !isNaN(+d.yLine) && min > +d.yLine)) { min = +d.yLine; }
            if((max == null &&  d.yLine != null && !isNaN(+d.yLine)) || (d.yLine != null && !isNaN(+d.yLine) && max < +d.yLine)) { max = +d.yLine; }
          });

          // Get axis target
          if(_var.data.yRight != null && _var.data.yRight.target != null && !isNaN(+_var.data.yRight.target)) {
            _var.yTarget = +_var.data.yRight.target;
            if(min == null || min > +_var.data.yRight.target) { min = +_var.data.yRight.target; }
            if(max == null || max < +_var.data.yRight.target) { max = +_var.data.yRight.target; }
          }

          // Check for default values
          if(isNaN(min)) { min = 0; }
          if(isNaN(max)) { max = 1; }

          // Get diff
          var diff = Math.abs(max - min) === 0 ? Math.abs(max * 0.1) : Math.abs(max - min) * 0.05;

          // Set x domain
          _var.yRightBounds = [min, max]; //(min == 0 ? min : min - diff), max + diff];
          _var.yRight.domain(_var.yRightBounds).nice();

          // Set format
          _var.yRightFormat = shared.helpers.number.parseFormat(_var.data == null ? null : _var.data.yRight);

          // Get left ticks
          var leftTicks = _var.yLeftAxis.scale().ticks();
          var zeroIndex = leftTicks.indexOf(0) + 1;
          var positiveBins = leftTicks.slice((zeroIndex === 0 ? 0 : zeroIndex), leftTicks.length);
          var negativeBins = leftTicks.slice(0, (zeroIndex === 0 ? 0 : zeroIndex - 2));

          // Set positive ticks
          var bins = leftTicks.length - 1;
          var size = Math.abs(_var.yRight.domain()[1] - _var.yRight.domain()[0]) / bins;
          _var.yRightTicks = zeroIndex === 1 ? [0] : [];
          d3.range(bins + 1).forEach(function(i) { _var.yRightTicks.push((_var.yRight.domain()[0] + size * i)); });

          // Add eytra values
          if(_var.yRight.domain()[1] > 0 && _var.yRight.domain()[0] < 0) { _var.yRightTicks.push(0); }
          if(_var.yTarget != null) { _var.yRightTicks.push(_var.yTarget); }

          // Define y axis
          _var.yRightAxis = d3.axisRight(_var.yRight).tickPadding(10).tickFormat(_var.yRightFormat).tickValues(_var.yRightTicks);

          // Display yRight axis
          if(_var.data.yRight != null && _var.data.yRight.isVisible !== false) {

            // Update margin right and width
            _var.width += _var.margin.right;
            _var.margin.right = 5 + d3.max(_var.yRightAxis.scale().ticks().map(function(d) { return shared.helpers.text.getSize(_var.yRightFormat(d)); }));
            _var.width -= _var.margin.right;

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

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

          // Get type of x axis
          _var.xBottomIsNumber = true;

          // Set format
          var xFmt = _var.xBottomIsDate ? 'date' : (_var.xBottomIsNumber ? 'number' : 'text');
          _var.xBottomFormat = shared.helpers[xFmt].parseFormat(_var.data == null ? null : _var.data.xBottom);

          // Initialize domains, text values objects for labels resizing and count of elements
          _var.xBottomDomain = {};
          var textValuesObj = {};
          var elementCount = 0;

          // Define aux variables
          var min = null,
              max = null,
              diff = null;

          // Get domains
          data.forEach(function(d) {

            // Only for positive values
            if(+d.y < 0) {

              // Increment element count
              elementCount += 1;

              // Parse date value
              if(_var.xBottomIsNumber) {
                if(min == null || min > +d.x) { min = +d.x; }
                if(max == null || max < +d.x) { max = +d.x; }
                d.parsedX = +d.x;
              }

              // Store name for futher use
              if((d.x == null || d.x === "") && (d.x != null && d.x !== "" && textValuesObj[d.x] == null)) {
                textValuesObj[d.x] = shared.helpers.text.getSize(_var.xBottomFormat(d.parsedX));
              }

            }
          });

          // Check for default values
          if(isNaN(min)) { min = 0; }
          if(isNaN(max)) { max = 1; }

          // Get diff
          var diff = Math.abs(max - min) === 0 ? Math.abs(max * 0.1) : 0;

          // Set y domain
          _var.xBottomBounds = [(min == 0 ? min : min - diff), max + diff];

          // Calculate height based on data elements
          _var.calcWidth = 10 + (elementCount*(_var.barWidth+2));
          _var.calcWidth = _var.width > _var.calcWidth ? _var.width : _var.calcWidth;

          // Define scales
          _var.xBottom = d3.scaleLinear().range([0, _var.calcWidth]);
          _var.xBottom.domain(_var.xBottomBounds).nice();

          // Get y axis ticks
          var bins = d3.max([3, parseInt(_var.calcWidth / 100, 10)]);

          // Define axis
          _var.xBottomAxis = d3.axisBottom(_var.xBottom).ticks(bins).tickPadding(17).tickFormat(_var.xBottomFormat);

          // Get sizes of outer text to adjust max number of lines on bottom
          _var.xBottomMaxLines = 1;
          if(_var.data.attrs != null && _var.data.attrs.wrapText != null && _var.data.attrs.wrapText === true) {
            Object.keys(textValuesObj.x).forEach(function(x) {
              var numLines = Math.floor(textValuesObj.x[x] / 100);
              if(numLines > _var.xBottomMaxLines && numLines <= 2) { _var.xBottomMaxLines = numLines; };
            });
          }

          // Update margin bottom and height
          _var.height += _var.margin.bottom;
          _var.margin.bottom = 30 + _var.xBottomMaxLines*25
          _var.height -= _var.margin.bottom;

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

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

          // Set format
          _var.xIsDate = (_var.data.x != null && _var.data.x.type === 'time' && _var.data.x.inFormat != null && _var.data.x.outFormat != null);
          _var.xIsNumber = (_var.data.x != null && _var.data.x.type === 'number' && _var.data.x.format != null);
          var xFmt = _var.xIsDate ? 'date' : (_var.xIsNumber ? 'number' : 'text');
          _var.xFormat = shared.helpers[xFmt].parseFormat(_var.data == null ? null : _var.data.x);

          // Initialize domains
          _var.xDomain = {};

          // Initialize text values objects for labels resizing
          var textValuesObj = {};

          // Initialize count of elements
          var elementCount = 0;

          // Get domains
          data.forEach(function(d) {

            // Increment element count
            elementCount += 1;

            // Parse date value
            if(_var.xIsDate) {
              d.parsedName = d3.timeParse(_var.data.x.inFormat)(d.name);
              if(d.parsedName != null) { d.name = _var.xFormat(d.name); }
            } else {
              d.parsedName = d.name;
            }

            // Add id to xIn domain value
            _var.xDomain[d.x] = d;

            // Store name for futher use
            if((d.name == null || d.name === "") && (d.name != null && d.name !== "" && textValuesObj[d.name] == null)) {
              textValuesObj[d.name] = shared.helpers.text.getSize(d.name);
            }

          });

          // Calculate height based on data elements
          _var.calcWidth = 20 + (elementCount*(_var.barWidth+2));
          _var.calcWidth = _var.width > _var.calcWidth ? _var.width : _var.calcWidth;

          // Define scales
          _var.x = d3.scaleBand().range([0, _var.calcWidth]).paddingInner(0.05).paddingOuter(0.05);

          // Initialize domains
          var xDomain = Object.keys(_var.xDomain).sort(function(a,b) { return d3.descending(Math.abs(+_var.xDomain[a].y), Math.abs(+_var.xDomain[b].y)); });

          // Set x and xIn domain
          _var.x.domain(xDomain);

          // Update barWidth if its not set by the user
          _var.barWidth = _var.data.attrs != null && _var.data.attrs.barWidth != null && !isNaN(+_var.data.attrs.barWidth) ? +_var.data.attrs.barWidth : _var.xIn.bandwidth();

          // Define axis
          _var.xAxis = d3.axisBottom(_var.x).tickPadding(17);

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

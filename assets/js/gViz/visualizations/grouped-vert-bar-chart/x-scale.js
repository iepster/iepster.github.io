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
          _var.xInDomain = {};

          // Initialize text values objects for labels resizing
          var textValuesObj = { x: {}, xIn: {} };

          // Initialize count of elements
          var elementCount = 0, groupCount = 0;

          // Get domains
          data.forEach(function(d) {

            // Increment group count
            groupCount += 1;

            // Parse date value
            if(_var.xIsDate) {
              d.parsedName = d3.timeParse(_var.data.x.inFormat)(d.name);
              if(d.parsedName != null) { d.name = _var.xFormat(d.name); }
            }

            // Add id to x domain value
            _var.xDomain[d.x] = d;

            // Store name for futher use
            if(d.name != null && d.name !== "" && textValuesObj.x[d.name] == null) { textValuesObj.x[d.name] = shared.helpers.text.getSize(d.name); }

            // Iterate over values
            d.values.forEach(function(v) {

              // Increment element count
              elementCount += 1;

              // Set parent id
              v.parent = d.x;

              // Parse date value
              if(_var.xIsDate) {
                v.parsedName = d3.timeParse(_var.data.x.inFormat)(v.name);
                if(v.parsedName != null) { v.name = _var.xFormat(v.name); }
              }

              // Add id to xIn domain value
              _var.xInDomain[v.x] = v;

              // Store name for futher use
              if((d.name == null || d.name === "") && (v.name != null && v.name !== "" && textValuesObj.xIn[v.name] == null)) {
                textValuesObj.xIn[v.name] = shared.helpers.text.getSize(v.name);
              }

            });
          });

          // Calculate height based on data elements
          _var.calcWidth = (groupCount + 1)*10 + (elementCount*(_var.barWidth+2));
          _var.calcWidth = _var.width > _var.calcWidth ? _var.width : _var.calcWidth;

          // Define scales
          _var.x = d3.scaleBand().range([0, _var.calcWidth]).paddingInner(0.05).paddingOuter(0.05);
          _var.xIn = _var.data.data.length === 1 ? d3.scaleBand().padding(0.1) : d3.scaleBand().paddingInner(0.05).paddingOuter(1);

          // Initialize domains
          var xDomain = Object.keys(_var.xDomain), xInDomain = Object.keys(_var.xInDomain);

          // Order Domains
          if(_var.xIsDate) {
            if(xDomain.filter(function(k) { return _var.xDomain[k].parsedName == null; }).length === 0) {
              xDomain = xDomain.sort(function(a,b) { return d3.ascending(_var.xDomain[a].parsedName, _var.xDomain[b].parsedName); });
            }
            if(xInDomain.filter(function(k) { return _var.xInDomain[k].parsedName == null; }).length === 0) {
              xInDomain = xInDomain.sort(function(a,b) { return d3.ascending(_var.xInDomain[a].parsedName, _var.xInDomain[b].parsedName); });
            }
          }

          // Set x and xIn domain
          _var.x.domain(xDomain);
          _var.xIn.domain(xInDomain).range([0,_var.x.bandwidth()]);

          // Update barWidth if its not set by the user
          _var.barWidth = _var.data.attrs != null && _var.data.attrs.barWidth != null && !isNaN(+_var.data.attrs.barWidth) ? +_var.data.attrs.barWidth : _var.xIn.bandwidth();

          // Define axis
          _var.xAxis = d3.axisBottom(_var.x).tickPadding(17);

          // Get sizes of outer text to adjust max number of lines on bottom
          _var.xMaxLines = 1;
          if(_var.data.attrs != null && _var.data.attrs.wrapText != null && _var.data.attrs.wrapText === true) {
            Object.keys(textValuesObj.x).forEach(function(name) {
              var numLines = Math.floor(textValuesObj.x[name] / _var.x.bandwidth());
              if(numLines > _var.xMaxLines && numLines <= 2) { _var.xMaxLines = numLines; };
            });

            // Get sizes of inner text to adjust max number of lines on bottom
            Object.keys(textValuesObj.xIn).forEach(function(name) {
              var numLines = Math.floor(textValuesObj.xIn[name] / _var.xIn.bandwidth());
              if(numLines > _var.xMaxLines && numLines <= 2) { _var.xMaxLines = numLines; };
            });
          }

          // Update margin bottom and height
          _var.height += _var.margin.bottom;
          _var.margin.bottom = 30 + _var.xMaxLines*25
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

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

          // Define scales
          _var.x = _var.xIsDate || _var.xIsNumber ? d3.scaleLinear().range([0, _var.width]) : d3.scaleBand().range([0, _var.width]).padding(0.1);

          // Define aux variables
          var min = null, max = null, diff = null;

          // Initialize domains
          _var.xDomain = {};
          var xDomain = [];

          // Get domains
          data.forEach(function(d) {

            // Date value
            if(_var.xIsDate) {

              // Parse values
              d.parsedX = d3.timeParse(_var.data.x.inFormat)(d.x).getTime();
              d.formattedX = _var.xFormat(d.x);

              // Set domain
              if(min == null || min > +d.parsedX) { min = +d.parsedX; }
              if(max == null || max < +d.parsedX) { max = +d.parsedX; }

            // Number values
            } else if(_var.xIsNumber) {

              // Parse values
              d.parsedX = +d.x;
              d.formattedX = _var.xFormat(d.x);

              // Set domain
              if(min == null || min > +d.x) { min = +d.x; }
              if(max == null || max < +d.x) { max = +d.x; }

            // For ordinal scales
            } else {

              // Get ordinal values
              d.parsedX = d.x;
              d.formattedX = d.x;

              // Add id to x domain value
              if(_var.xDomain[d.x] == null) {
                _var.xDomain[d.x] = d;
                xDomain.push(d.x);
              }
            }
          });

          // Date or number values
          if(_var.xIsDate || _var.xIsNumber) {

            // Sort values
            data = data.sort(function(a,b) { return d3.ascending(a.parsedX, b.parsedX); });

            // Check for default values
            if(isNaN(min)) { min = 0; }
            if(isNaN(max)) { max = 1; }

            // Get diff
            var diff = Math.abs(max - min) === 0 ? Math.abs(max * 0.1) : 0;

            // Set x domain
            _var.x.domain([(min == 0 ? min : min - diff), max + diff]).nice();

            // Get x axis ticks
            var bins = d3.max([3, parseInt(_var.width / 100, 10)]);

            // Define axis
            _var.xAxis = d3.axisBottom(_var.x).ticks(bins).tickPadding(10).tickFormat(_var.xIsDate ? d3.timeFormat(_var.data.x.outFormat) : _var.xFormat);

          } else {

            // Set x domain
            _var.x.domain(xDomain);

            // Define axis
            _var.xAxis = d3.axisBottom(_var.x).tickPadding(10).tickFormat(function(d) { return d; });

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

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

          // Define scales
          _var.x = d3.scaleBand().range([0, _var.width]).paddingInner(0.05);

          // Set format
          _var.xIsDate = (_var.data.x != null && _var.data.x.type === 'time' && _var.data.x.inFormat != null && _var.data.x.outFormat != null);
          _var.xIsNumber = (_var.data.x != null && _var.data.x.type === 'number' && _var.data.x.format != null);
          var xFmt = _var.xIsDate ? 'date' : (_var.xIsNumber ? 'number' : 'text');
          _var.xFormat = shared.helpers[xFmt].parseFormat(_var.data == null ? null : _var.data.x);

          // Initialize domains
          _var.xDomain = {}, _var.xInDomain = {};

          // Get domains
          data.forEach(function(d) {

            // Parse date value
            if(_var.xIsDate) {
              d.parsedName = d3.timeParse(_var.data.x.inFormat)(d.name);
              if(d.parsedName != null) { d.name = _var.xFormat(d.name); }
            }

            // Add id to x domain value
            _var.xDomain[d.x] = d;

            // Iterate over values
            d.values.forEach(function(v) {

              _var.xInDomain[v.x] = v;

              // Set parent node for values
              v.parent = d.x;
            });

          });

          // Initialize domains
          var xDomain = Object.keys(_var.xDomain);

          // Order Domains
          if(_var.xIsDate) {
            if(xDomain.filter(function(k) { return _var.xDomain[k].parsedName == null; }).length === 0) {
              xDomain = xDomain.sort(function(a,b) { return d3.ascending(_var.xDomain[a].parsedName, _var.xDomain[b].parsedName); });
            }
          }

          // Set x and xIn domain
          _var.x.domain(xDomain);

          // Define axis
          _var.xAxis = d3.axisBottom(_var.x).tickPadding(10);

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

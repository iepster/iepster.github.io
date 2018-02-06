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
          _var.yIsDate = (_var.data.y != null && _var.data.y.type === 'time' && _var.data.y.inFormat != null && _var.data.y.outFormat != null);
          _var.yIsNumber = (_var.data.y != null && _var.data.y.type === 'number' && _var.data.y.format != null);
          var yFmt = _var.yIsDate ? 'date' : (_var.yIsNumber ? 'number' : 'text');
          _var.yFormat = shared.helpers[yFmt].parseFormat(_var.data == null ? null : _var.data.y);

          // Initialize domains
          _var.yDomain = {};
          _var.yInDomain = {};

          // Initialize count of elements
          var elementCount = 0, groupCount = 0;

          // Get domains
          data.forEach(function(d) {

            // Increment group count
            groupCount += 1;

            // Parse date value
            if(_var.yIsDate) {
              d.parsedName = d3.timeParse(_var.data.y.inFormat)(d.name);
              if(d.parsedName != null) { d.name = _var.yFormat(d.name); }
            }

            // Add id to y domain value
            _var.yDomain[d.y] = d;

            // Iterate over values
            d.values.forEach(function(v) {

              // Increment element count
              elementCount += 1;

              // Set parent id
              v.parent = d.y;

              // Parse date value
              if(_var.yIsDate) {
                v.parsedName = d3.timeParse(_var.data.y.inFormat)(v.name);
                if(v.parsedName != null) { v.name = _var.yFormat(v.name); }
              }

              // Add id to yIn domain value
              _var.yInDomain[v.y] = v;

            });
          });

          // Calculate height based on data elements
          _var.calcHeight = (groupCount + 1)*20 + (elementCount*(_var.barHeight+15));
          _var.calcHeight = _var.height > _var.calcHeight ? _var.height : _var.calcHeight;

          // Define scales
          _var.y = d3.scaleBand().range([_var.calcHeight, 0]).paddingInner(0.05).paddingOuter(0.5);
          _var.yIn = _var.data.length === 1 ? d3.scaleBand().padding(0.1) : d3.scaleBand().paddingInner(0.1).paddingOuter(0.5);

          // Initialize domains
          var yDomain = Object.keys(_var.yDomain), yInDomain = Object.keys(_var.yInDomain);

          // Order Domains
          if(_var.yIsDate) {
            if(yDomain.filter(function(k) { return _var.yDomain[k].parsedName == null; }).length === 0) {
              yDomain = yDomain.sort(function(a,b) { return d3.ascending(_var.yDomain[a].parsedName, _var.yDomain[b].parsedName); });
            }
            if(yInDomain.filter(function(k) { return _var.yInDomain[k].parsedName == null; }).length === 0) {
              yInDomain = yInDomain.sort(function(a,b) { return d3.ascending(_var.yInDomain[a].parsedName, _var.yInDomain[b].parsedName); });
            }
          }

          // Set y and yIn domain
          _var.y.domain(yDomain);
          _var.yIn.domain(yInDomain).range([0,_var.y.bandwidth()]);

          // Define axis
          _var.yAxis = d3.axisLeft(_var.y).tickPadding(10);

          // Update margin left and width
          _var.width += _var.margin.left;
          _var.margin.left = 5 + d3.max(Object.keys(_var.yDomain).map(function(k) { return shared.helpers.text.getSize(_var.yDomain[k].name); }));
          _var.width -= _var.margin.left;

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

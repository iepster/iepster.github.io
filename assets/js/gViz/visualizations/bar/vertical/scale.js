// Imports
let d3 = require("d3");
var shared = require("../../../shared/_init.js");

// Module declaration
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var animation = 900;
  var action = 'create';
  var metric = 'value';

  // Validate attributes
  var validate = function validate(step) {

    switch (step) {
      case 'run':
        return true;
      default:
        return false;
    }
  };

  // Main function
  var main = function main(step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'run':

          switch (action) {

            case 'update-domain':

              // Initialize variables
              var min  = null;
              var max  = null;
              var diff = 0;
              var dates = {};

              // Update x domain
              _var.x.domain(_var.data.sort(function(a,b) {
                var aValue = a.values.filter(function(v) { return v.id === "currentYear"; });
                var bValue = b.values.filter(function(v) { return v.id === "currentYear"; });
                aValue = aValue.length === 0 ? 0 : +aValue[0].value;
                bValue = bValue.length === 0 ? 0 : +bValue[0].value;
                return d3.ascending(aValue,bValue);
                }).map(function(d) { return d.id; }));

              // Iterate over data
              _var.data.forEach(function(d) {

                // Mean
                var mean  = [];

                // Copy values
                if(d._values) { d.values = d._values; }
                else { d._values = d.values; }

                // Get only valid values
                d.values = d.values
                  .filter(function(v) { return _var[v.id] != null && _var[v.id]; })
                  .sort(function(a,b) { return d3.ascending(a.sort, b.sort); });

                // Parse values
                d.values.forEach(function(v) {

                  // Add to mean
                  mean.push(+v.value);

                  // Values
                  if(max == null || +v.value > max) { max = +v.value; }
                  if(min == null || +v.value < min) { min = +v.value; }

                });

                // Set mean
                d.mean = d3.mean(mean);

              });

              // Update xIn domain
              _var.xIn
                .domain(_var.data[0].values.map(function(v) { return v.id; }))
                .range([0, _var.x.bandwidth()]);

              // Min/Max default
              if(min == null || max == null) { min = max = 0; }

              // Get difference
              if (isNaN(min) && isNaN(max) || min === 0 && max === 0) { min = 0;max = 0.1; }
              diff = max === min ? Math.abs(max * 0.01) : Math.abs(max - min) * .1;

              // Update y domain
              _var.y.domain([(min == 0 ? min : min - diff), max + diff]);

              break;
          }
          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'animation', 'action', 'value'].forEach(function (key) {

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
  main.run = function (_) { return main('run'); };

  return main;
};

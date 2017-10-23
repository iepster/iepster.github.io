// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var       = null;
  var action     = 'update'
  var components = null;

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

          switch (action) {

            // Update data for the current domain
            case 'update':

              // Initialize data
              _var.values = [];

              // Iterate over objects
              _var.data.data.forEach(function(d) {

                // Get obj properties
                var obj = d;
                var values = _var.tAxis.bounds.length === 0 ? d.values : d.values.filter(function(v) { return v._tValue >= _var.tAxis.bounds[0] && v._tValue <= _var.tAxis.bounds[1]; });

                if(values.length > 0) {

                  // Get x, y and z values
                  obj._values = { xValues: [], yValues: [], zValues: [] };
                  values.forEach(function(v) {
                    obj._values.xValues.push(+v.x);
                    obj._values.yValues.push(+v.y);
                    obj._values.zValues.push(+v.z);
                  });

                  // Get x, y and z aggregation values
                  obj._values.x = d3[_var.xAggregation](obj._values.xValues);
                  obj._values.y = d3[_var.yAggregation](obj._values.yValues);
                  obj._values.z = d3[_var.zAggregation](obj._values.zValues);

                  // Store object in data array
                  _var.values.push(obj);

                }

              });

              break;
          }
          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','action','components'].forEach(function (key) {

    // Attach variables to validation function
    validate[key] = function (_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return validate;
    };

    // Attach variables to main function
    return main[key] = function (_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return main;
    };
  });

  // Executa a funcao chamando o parametro de step
  main.run = _ => main('run');

  return main;
};

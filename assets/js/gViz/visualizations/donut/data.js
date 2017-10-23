// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var animation = 900;

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

          // Initialize variables
          _var.pieData = [];
          var total = 100;//d3.sum(_var.data.values, function(d) { return +d.value; });

          // Parse data
          _var.data.values.forEach(function(d) {

            // Initialize objects
            var obj = { parent: _var.data, id: d.id, name: d.name, values: [
              { id: d.id, name: d.name, value: d.value, colors: d.colors },
              { id: "empty-data", name: "Empty Data", value: total - d.value, colors: [{ color: "#2b4054" }, { color: "#2b4054" }] }
            ]};

            // Store valid objects
            _var.pieData.push(obj);

          });

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'animation'].forEach(function (key) {

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

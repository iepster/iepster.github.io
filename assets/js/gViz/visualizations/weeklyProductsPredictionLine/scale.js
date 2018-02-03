// Imports
let d3 = require("d3");
var shared = require("../../shared/_init.js");

// Module declaration
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var animation = 900;
  var action = 'create';
  var metric = 'value';
  let showTotals = undefined;

  // Validate attributes
  var validate = function validate(step) {

    switch (step) {
      case 'run':
        if (!showTotals) console.log('err - showTotals')
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

              // set the dates as a domain to the x scale
              _var.x.domain(_var.data.sales.dates);

              // set the y domain from 0 to 100 (since the data is shown in percents)
              _var.y.domain([0, 100]);

          break;
        }
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'animation', 'action', 'value', 'showTotals'].forEach(function (key) {

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

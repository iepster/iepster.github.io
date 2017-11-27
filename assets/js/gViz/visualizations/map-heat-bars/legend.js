// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var      = undefined;
  var animation = 900;
  var components = {};

  // Validate attributes
  var validate = function(step) {
    switch (step) {
      case 'run': return true;
      default: return false;
    }
  };

  // Main function
  var main = function(step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'run':

          // Get outer wrapper
          var outerWrapper = _var.container.d3.closest('.gViz-outer-wrapper');

          // Set margin left and display style
          outerWrapper.select('.legend-wrapper, .legend-wrapper-full')
            .style('display', _var.data == null || _var.data.legend == null || _var.data.legend.isVisible == null || _var.data.legend.isVisible === true ? 'block' : 'none')

          // Set margin left and display style
          outerWrapper.select('.legend-wrapper, .legend-wrapper-full')
            .select('.scale-wrapper')
              .style('display', _var.mode === 'heat' ? 'block' : 'none')
              .select('.scale-rect')
                .style('background', _var.mode === "heat" ? "linear-gradient(to right, "+_var.heatColors.join(',')+")" : _var.barColor({}))

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','animation','components'].forEach(function(key) {

    // Attach variables to validation function
    validate[key] = function(_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return validate;
    };

    // Attach variables to main function
    return main[key] = function(_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return main;
    };
  });

  // Executa a funcao chamando o parametro de step
  main.run = _ => main('run');

  return main;
};

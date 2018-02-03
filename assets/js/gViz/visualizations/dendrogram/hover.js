// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var      = undefined;
  var animation = 900;
  var components = null;

  // Validate attributes
  var validate = function(step) {
    switch (step) {
      case 'run': return _var.hovered != null && Object.prototype.toString.call(_var.hovered) == '[object Object]' && _var.hovered.id != null;
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

          // Bind element groups
          _var.g.selectAll(".node-group").filter(function(d) { return d.data.id === _var.hovered.id; }).each(function(d) {

            // Set mouse over
            components.events()
              ._var(_var)
              .action('mouseover')
              .nodeSel(d3.select(this))
              .nodeObj(this)
              .node(d)
              .run();

          });

          break;
      }
    } else {

      // Bind element groups
      _var.g.selectAll(".node-group").each(function(d) {

        // Set mouse over
        components.events()
          ._var(_var)
          .action('mouseout')
          .nodeSel(d3.select(this))
          .nodeObj(this)
          .node(d)
          .run();

      });

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

// Imports
var d3 = require("d3");
var shared = require("../../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var       = undefined;
  var animation  = 900;
  var action     = "mouseover";
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

          // Bind element groups
          _var.g.selectAll(".chart-elements .element-group")

            // On mouseover
            .on('mouseover', function(d) {

              // Set mouse over
              components.events()
                ._var(_var)
                .action('mouseover')
                .nodeObj(this)
                .node(d)
                .run();

              // Dispatch hover node event
              _var.hover.fn(d);

            })

            // On mouseout
            .on('mouseout', function(d) {

              // Set mouse over
              components.events()
                ._var(_var)
                .action('mouseout')
                .nodeObj(this)
                .node(d)
                .run();

              // Show element hovered
              components.hover()
                ._var(_var)
                .components(components)
                .run();

              // Dispatch hover node event
              _var.hover.fn(null);

            });




          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','animation','action','components'].forEach(function(key) {

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

// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var components = {};

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

          // Update selection searched for searched nodes
          var updateNodes = function(search) {

            // Clean selection
            _var.searched = {};

            // Filter nodes
            _var.data.data.nodes
              .filter(function(d) {
                return _var.clicked === d || (search.length > 1 && d.name.toLowerCase().trim().indexOf(search) !== -1);
              })
              .forEach(function(node) {

                // Set node
                _var.searched[node.id] = node;

              });

          }

          // Bind key input
          _var.search.d3.on('keyup', function() {

            // Get event and only fire for Enter key
            var event = d3.event || window.event;
            if (event.keyCode === 13) {

              // Update search value
              _var.search.value = _var.search.d3.node().value.toLowerCase().trim();

              // Update searched nodes
              updateNodes(_var.search.value);

              // Mouseover event
              components.events()
                ._var(_var)
                .action("search")
                .components(components)
                .run();

              // Update simulation
              _var.ticked();
            }
          });

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'components'].forEach(function (key) {

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

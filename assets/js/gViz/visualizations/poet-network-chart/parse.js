// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = null;

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

          // Initialize hashes
          _var._data = { nodes: {}, links: {} };

          // Iterate over nodes
          _var.data.data.nodes.forEach(function(d) {

            // Set color
            if(d.color == null) { d.color = _var.colors.d3(d.id); }

            // Set neighbours
            d.outEdges = {};
            d.inEdges = {};

            // Initialize radius
            d.value = 0;
            d._value = 0;

            // Store node
            _var._data.nodes[d.id] = d;

          });

          // Iterate over links
          _var.data.data.links.forEach(function(d) {

            // Store neighbour
            _var._data.nodes[d.source].outEdges[d.target] = d;
            _var._data.nodes[d.target].inEdges[d.source] = d;

            // Increase radius
            _var._data.nodes[d.source].value += +d.value;
            _var._data.nodes[d.target].value += +d.value;
            _var._data.nodes[d.source]._value += +d.value;
            _var._data.nodes[d.target]._value += +d.value;

            // Set values
            _var._data.links[d.source + "-- --" + d.target] = d;

          });

          // Set _clicked element
          _var._clicked = _var._clicked != null ? null : _var._data.nodes[_var.clicked];

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var'].forEach(function (key) {

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

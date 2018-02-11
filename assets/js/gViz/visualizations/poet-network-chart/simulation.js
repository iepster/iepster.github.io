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

          // Rearrange nodes and links on screen
          _var.ticked = function () {

            // Update links
            _var.links.attr("d", function(d) { return "M " + d.source.x + "," + d.source.y + " " + d.target.x + "," + d.target.y; })

            // Update nodes
            _var.nodes
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; });

          }

          // Initialize simulation force layout
          _var.simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) { return d.id; }))
            .force("charge", d3.forceManyBody().distanceMax(_var.width * 0.3).strength(function (d) { return -200; }))
            .force("center", d3.forceCenter(_var.width / 2, _var.height / 2))
            .force("collide",d3.forceCollide( function(d){ return _var.getRadius(d) + 8; }) )
            .force("y", d3.forceY(0))
            .force("x", d3.forceX(0))
            .alphaTarget(1)
            .on("tick", _var.ticked);

          // Force actions
          _var.simulation.nodes(_var.data.data.nodes)
          _var.simulation.force("link").links(_var.data.data.links);

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

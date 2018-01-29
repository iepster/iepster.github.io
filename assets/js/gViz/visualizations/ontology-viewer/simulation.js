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
            _var.links.attr("d", _var.linkPath)

            // Update node text
            _var.nodesText.attr('transform',   function(d) { return "translate(" + _var.nodeTextX(d) + "," + _var.nodeTextY(d, this) + ")"; })

            // Update nodes
            _var.nodes
              .attr('d', _var.nodePath)
              .each(function(d) {
                _var._data.nodes[d.id].x = d.x;
                _var._data.nodes[d.id].y = d.y;
              });

          }

          // Initialize simulation force layout
          _var.simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) { return d.id; }))
            .force("charge", d3.forceManyBody() )
            .force("center", d3.forceCenter(_var.width / 2, _var.height / 2))
            .force("collide", d3.forceCollide( function(d){ return _var.nodeRadius(d) + 8; }).iterations(16))
            .force("y", d3.forceY(0))
            .force("x", d3.forceX(0))
            .alphaDecay(0.05)
            //.alphaTarget(1)
            .on("tick", _var.ticked);

          // Force actions
          _var.simulation.nodes(_var.data.data.nodes)
          _var.simulation.force("link").links(_var.data.data.links);

          // Update Forces
          _var.updateForces = function() {

            // Initialize simulation attributes
            _var.forceAttrs = {
              gravity: (_var.data.force != null && _var.data.force.gravity != null && !isNaN(+_var.data.force.gravity) ? +_var.data.force.gravity : -30),
              linkStrength: (_var.data.force != null && _var.data.force.linkStrength != null && !isNaN(+_var.data.force.linkStrength) ? +_var.data.force.linkStrength : 0.1)
            }

            // Update forces
            _var.simulation.force("charge").strength(_var.forceAttrs.gravity);
            _var.simulation.force("link").strength(_var.forceAttrs.linkStrength);
            _var.simulation.alpha(1).restart();

          }

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

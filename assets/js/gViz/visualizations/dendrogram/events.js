// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var      = undefined;
  var animation = 300;
  var action    = "mouseover";
  var nodeObj   = null;
  var nodeSel   = null;
  var node      = null;
  var scale     = 1.3;
  var speed     = 1;

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

          switch (action) {

            case 'mouseover':

              // Style
              _var.g.selectAll(".node-group").style('opacity', function(n) { return n == node ? 1 : 0.1; });
              _var.g.selectAll(".left-link").style('opacity', 0.1);
              _var.g.selectAll("path.link").style('stroke', "#584c5b");
              nodeSel.selectAll('.node-s-abbr, .label-link, .label-circle').style('opacity', 1);

              // Increase scale
              d3.select(nodeObj).selectAll('g.shapes-outer-g')
                .transition().duration(100)
                .attr("transform", function (d) { return "scale("+scale+")"; })

              // Timer variables
              node.speed = speed;
              var self = nodeObj;

              // // Start timer
              // node.timer.restart(function() {
              //   node.angle += node.speed;
              //   var transform = function(d) { return "rotate(" + node.angle + ")"; };
              //   d3.select(self).selectAll("g.shapes-g").attr("transform", transform);
              // }, 100, 10);

              break;

            case 'mouseout':

              // Style
              _var.g.selectAll(".node-group, path.left-link").style('opacity', 1);
              _var.g.selectAll("path.link").style('stroke', "#584c5b");
              nodeSel.selectAll('.node-s-abbr, .label-link, .label-circle')
                .style("opacity", function(n) { return n.parent && n.satAttrs && n.satAttrs.lvl >= n.parent.maxSatLvl-1 ? 1 : 0; } )

              // // Stop timer
              // node.timer.stop();

              // Decrease scale
              d3.select(nodeObj).selectAll('g.shapes-outer-g')
                .transition().duration(100)
                .attr("transform", function (d) { return "scale(1)"; })

              break;

            case 'click':

              // Style
              _var.g.selectAll(".node-group, path.link, path.left-link").style('opacity', 1);
              _var.g.selectAll("path.link").style('stroke', "#7291AD");
              nodeSel.selectAll('.node-s-abbr, .label-link, .label-circle')
                .style("opacity", function(n) { return n.parent && n.satAttrs && n.satAttrs.lvl >= n.parent.maxSatLvl-1 ? 1 : 0; } )

              // // Stop timer
              // node.timer.stop();

              // Timer variables
              var self = nodeObj;

              // Reset node angle
              node.angle = 0;

              // Reset transformation
              var transform = function(d) { return "rotate(" + node.angle + ")"; };
              d3.select(nodeObj).selectAll("g.shapes-g").attr("transform", transform);

              // Decrease scale
              d3.select(nodeObj).selectAll('g.shapes-outer-g').attr("transform", function (d) { return "scale(1)"; })

              break;


          }
         break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','animation','action','nodeObj','nodeSel','node'].forEach(function(key) {

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

// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var       = undefined;
  var components = null;
  var nodeObj    = null;
  var nodeIndex  = 0;
  var node       = null;

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

          // Get parent selection
          var nodeSel = d3.select(nodeObj);

          // Opacity color
          var colors = [d3.color(node.color).rgb(), d3.color(node.color).rgb()];
          colors[0].opacity = 0.8;
          colors[1].opacity = 0.5;

          var gradId = `${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`;

          // Create gradient bg
          components.gradients()
            .container(_var.wrap)
            .id("diwo-gradient-"+_var._id+"-color-"+gradId)
            .gData([{ colors: [
              { offset:"0%", color: +node.y >= 0 ? colors[0].toString() : colors[1].toString() },
              { offset:"100%", color:  +node.y >= 0 ? colors[1].toString() : colors[0].toString() }
            ]}])
            .x1(0)
            .y1(_var.getY(node))
            .x2(0)
            .y2(_var.getY(node) + _var.getHeight(node))
            .run();

          // Update bar
          var bar = nodeSel.selectAll('.bar.element').data([node], function (d) { return d.id; });
          bar.exit().remove();
          bar = bar.enter().append("rect").attr("class", 'bar element').style("opacity", 0).merge(bar);
          bar
            .transition().duration(_var.animation)
            .attr('x', 0)
            .attr('y', function(d) { return _var.getY(d); })
            .attr('width', _var.barWidth)
            .attr('height', function(d) { return _var.getHeight(d); })
            .style("fill", function(d) { return d.y < 0 ? "red" : "green" })
            .style("opacity", 1);

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','components','nodeObj','nodeIndex','node'].forEach(function(key) {

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

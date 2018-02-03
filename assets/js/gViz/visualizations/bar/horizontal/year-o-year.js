// Imports
var d3 = require("d3");
var shared = require("../../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var      = undefined;
  var animation = 900;
  var nodeObj   = null;
  var node      = null;

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
          var max = d3.max(node.values.map(function(d) { return +d.value; }));
          var min = d3.min(node.values.map(function(d) { return +d.value; }));

          // Update bar
          var bar = nodeSel.selectAll('.bar-year-o-year.element').data(_var.yearOYear ? [node] : []);
          bar.exit().remove();
          bar = bar.enter().append("rect").attr("class", 'bar-year-o-year element').merge(bar);
          bar
            .attr('y', 0)
            .attr('x', _var.y(min))
            .attr('height', _var.x.bandwidth())
            .attr('width', _var.y(max) - _var.y(min))
            .style('fill', "#FFF")
            .style('opacity', "0.3")

          // Update bar
          var line = nodeSel.selectAll('.line-year-o-year.element').data(_var.yearOYear ? [max, min] : []);
          line.exit().remove();
          line = line.enter().append("line").attr("class", 'line-year-o-year element').merge(line);
          line
            .attr('y1', 0)
            .attr('x1', function(d) { return _var.y(d); })
            .attr('y2', _var.x.bandwidth())
            .attr('x2', function(d) { return _var.y(d); })
            .style('fill', "none")
            .style('stroke', "#FFF")

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','animation','nodeObj','node'].forEach(function(key) {

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

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
          bar = bar.enter().append("rect").attr("class", 'bar-year-o-year element').attr('height', 0).attr('y', _var.y(min)).merge(bar);
          bar
            .attr('x', 0)
            .attr('width', _var.x.bandwidth())
            .style('fill', "#FFF")
            .style('opacity', 0.3)
            .transition().duration(animation)
              .attr('y', _var.y(max))
              .attr('height', _var.y(min) - _var.y(max))

          // Update bar
          var line = nodeSel.selectAll('.line-year-o-year.element').data(_var.yearOYear ? [max, min] : []);
          line.exit().remove();
          line = line.enter().append("line").attr("class", 'line-year-o-year element')
            .attr('y1', _var.y(min))
            .attr('y2', _var.y(min))
            .merge(line);
          line
            .attr('x1', 0)
            .attr('x2', _var.x.bandwidth())
            .style('fill', "none")
            .style('stroke', "#FFF")
            .transition().duration(animation)
              .attr('y1', function(d) { return _var.y(d); })
              .attr('y2', function(d) { return _var.y(d); })

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

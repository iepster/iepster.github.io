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

          // Set initial offsets
          var offsets = { labels: { currentYear: 30, previousyear: -25 }, values: { currentYear: 30, previousyear: -40 } };

          // Set offset for labels and values
          if(_var.yearOYear && _var.previousYear) {
            offsets.labels[node.id] = 0;
            offsets.values[node.id] = 0;
          } else if((!_var.yearOYear && _var.previousYear) || (_var.yearOYear && !_var.previousYear)) {
            offsets.labels[node.id] = 0;
            offsets.values[node.id] = 0;
          }

          // Get parent selection
          var nodeSel = d3.select(nodeObj);

          // Create label groups
          var label = nodeSel.selectAll(".label").data([node]);
          label.exit().remove();
          label = label.enter().append("text").attr("class", "label").merge(label);
          label
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", function(d) { return (offsets.labels[d.id] == null ? 0 : offsets.labels[d.id]) + (d.id === "currentYear" ? -30 : 25); })
            .text(function(d) { return d.name; })

          // Create value groups
          var value = nodeSel.selectAll(".label-value").data([node.values.filter(function(d) { return d.id === node.id; })[0]]);
          value.exit().remove();
          value = value.enter().append("text").attr("class", "label-value").merge(value);
          value
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", function(d) { return (offsets.values[d.id] == null ? 0 : offsets.values[d.id]) +(d.id === "currentYear" ? -15 : 40); })
            .style("fill", function(d) { return d.colors[0].color; })
            .text(function(d) { return shared.helpers.number.localePercent(+d.value); })


          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','animation','components','nodeObj','node'].forEach(function(key) {

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

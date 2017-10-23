// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var       = null;
  var components = null;

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

          // Element canvas
          var elements = _var.g.selectAll(".chart-elements").data(["chart-elements"]);
          elements.exit().remove();
          elements = elements.enter().append("g").attr("class", "chart-elements").merge(elements);

          // Create groups
          var groups = elements.selectAll(".element-group").data(["element-group"]);
          groups.exit().remove();
          groups = groups.enter().append("g").attr("class", "element-group").merge(groups);

          // For each element in group
          groups
            .attr("transform", function (d) { return `translate(-1,${_var.y(+_var.value)})`; })
            .each(function (e, i) {

              // Create rect
              var rect = d3.select(this).selectAll(".drag-rect").data(["drag-rect"]);
              rect.exit().remove();
              rect = rect.enter().append("rect").attr("class", "drag-rect").merge(rect);
              rect
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", _var.width + 15)
                .attr("height", 20)
                .style("fill", "#eee")
                .style("fill-opacity", "0.7")

              // Create text
              var text = d3.select(this).selectAll(".drag-text").data(["drag-text"]);
              text.exit().remove();
              text = text.enter().append("text").attr("class", "drag-text").merge(text);
              text
                .attr("x", _var.width/2)
                .attr("y", 13)
                .attr("text-anchor", 'middle')
                .style("font-size", "10px")
                .style("fill", "#7DB6DB")
                .text(_var.yFormat(_var.value))

              // Create arrows
              var arrow = d3.select(this).selectAll(".drag-arrow").data(["top","bottom"]);
              arrow.exit().remove();
              arrow = arrow.enter().append("text").attr("class", "drag-arrow").merge(arrow);
              arrow
                .attr("x", _var.width + 8)
                .attr("y", function(d) { return d === 'top' ? 8 : 16; })
                .attr("text-anchor", 'middle')
                .style("font-size", "6px")
                .style("fill", "#666")
                .text(function(d) { return d === "top" ? "▲" : "▼"; })

            });

          // Bind drag
          groups.call(d3.drag()
            .on("start", _var.dragstarted)
            .on("drag", _var.dragging)
            .on("end", _var.dragended));


          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','components'].forEach(function (key) {

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

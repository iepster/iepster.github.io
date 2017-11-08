// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var animation = 900;

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

          // Draw svg
          _var.wrap = _var.container.d3.selectAll(`svg.chart-${_var._id}`).data(["chart-svg"]);
          _var.wrap.exit().remove();
          _var.wrap = _var.wrap.enter().append("svg").attr('class', `plot-evolution-graph chart-${_var._id}`).merge(_var.wrap); // svg

          // Update outer dimensions
          _var.wrap
            .attr("width", _var.width + _var.margin.left + _var.margin.right)
            .attr("height", _var.height + _var.margin.top + _var.margin.bottom + _var.margin.tSize);

          // Draw g
          _var.g = _var.wrap.selectAll("g.chart-wrap").data(["chart-wrap"]); // svg:g
          _var.g.exit().remove();
          _var.g = _var.g.enter().append('g').attr('class', "chart-wrap").merge(_var.g);
          _var.g.attr("transform", `translate(${_var.margin.left},${_var.margin.top})`);

          // Draw gE for elements
          _var.gE = _var.wrap.selectAll("g.chart-wrap-elements").data(["chart-wrap-elements"]); // svg:g
          _var.gE.exit().remove();
          _var.gE = _var.gE.enter().append('g').attr('class', "chart-wrap-elements").merge(_var.gE);
          _var.gE.attr("transform", `translate(${_var.margin.left},${_var.margin.top})`);

          // Draw gT for t-axis-wrap
          _var.gT = _var.wrap.selectAll("g.t-axis-wrap").data(["t-axis-wrap"]); // svg:g
          _var.gT.exit().remove();
          _var.gT = _var.gT.enter().append('g').attr('class', "t-axis-wrap").merge(_var.gT);
          _var.gT.attr("transform", `translate(${_var.margin.tOffset + _var.margin.tLeft},${_var.height + _var.margin.top + _var.margin.bottom})`);

          // Draw shadow
          shared.visualComponents.shadow()
            ._var(_var)
            .wrap(_var.wrap)
            .id(_var.shadowId)
            .run();

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'animation'].forEach(function (key) {

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

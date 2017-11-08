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
          _var.wrap = _var.container.d3.selectAll(`svg.chart-${_var._id}`).data(["chart-svg-linear"], d => d);
          _var.wrap.exit().remove();
          _var.wrap = _var.wrap.enter().append("svg").attr('class', `line-chart chart-${_var._id}`).merge(_var.wrap); // svg

          // Update outer dimensions
          _var.wrap
            .attr("width", _var.width + _var.margin.left + _var.margin.right)
            .attr("height", _var.height + _var.margin.top + _var.margin.bottom);

          // Draw g
          _var.g = _var.wrap.selectAll("g.chart-wrap").data(["chart-wrap"]); // svg:g
          _var.g.exit().remove();
          _var.g = _var.g.enter().append('g').attr('class', "chart-wrap").merge(_var.g);

          // Update inner dimensions
          _var.g.attr("transform", `translate(${_var.margin.left},${_var.margin.top})`);





          // Add filters ( Shadows)
          _var.defs = _var.wrap.append('defs');

          //Drop shadow filter
          var randomNumber = Math.floor(Math.random() * 1000000);
          _var.dropShadowUrl = 'drop-shadow-' +randomNumber;

          _var.dropShadowFilter = _var.defs.append("filter").attr("id", _var.dropShadowUrl).attr("height", "200%");
          _var.dropShadowFilter.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", 3).attr("result", "blur");
          _var.dropShadowFilter.append("feOffset").attr("in", "blur").attr("dx", 5).attr("dy", 5).attr("result", "offsetBlur");

          _var.dropShadowFilter.append("feFlood").attr('flood-color', 'black').attr("flood-opacity", "0.4").attr("result", "offsetColor");
          _var.dropShadowFilter.append("feComposite").attr('in', 'offsetColor').attr('in2', 'offsetBlur').attr("operator", "in").attr("result", "offsetBlur");


          _var.feMerge = _var.dropShadowFilter.append("feMerge");
          _var.feMerge.append("feMergeNode").attr("in", "offsetBlur")
          _var.feMerge.append("feMergeNode").attr("in", "SourceGraphic");



          // Create Square Arrowed Tooltip
          if (_var.wrap.selectAll('.square-arrowed-line-tooltip').size() == 0) {
            _var.tooltip = _var.wrap.append('g').attr('class', 'square-arrowed-line-tooltip');
            var width = 100;
             _var.tooltipWidth = width;

             _var.tooltip.append('path')
                   .attr('d', `M 0 0 L ${width} 0 L ${width} ${width * 3 / 8} L ${width * 5 / 8}  ${width * 3 / 8}  L  ${width / 2}  ${width / 2}  L ${width * 3 / 8}   ${width * 3 / 8}  L 0  ${width * 3 / 8}  L 0 0 `)
                   .style("filter", "url(" + _var.urlLocation + "#" + _var.dropShadowUrl + ")")

             _var.tooltip.append('text')
              .attr('class', 'font-highlight')
              .attr('text-anchor', 'middle')
              .attr('x', width / 2)
              .attr('y', width / 5)
              .attr('fill', 'white')
              .attr('font-weight', 'bold')
              .attr('font-size', 19)
              .attr('alignment-baseline', 'central')

           
          }


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

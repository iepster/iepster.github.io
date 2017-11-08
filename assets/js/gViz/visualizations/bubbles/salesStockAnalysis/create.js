// Imports
var d3 = require("d3");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var attrs = undefined;
  var calc = undefined;

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

          //=======================  DRAWING   =========================
          //chart container
          var container = d3.select(attrs.container)
          var svg = container.selectAll('.svg-item').data(['svg-item'])
          svg.exit().remove();
          svg = svg.enter().append('svg').merge(svg);
          svg.attr('class', 'svg-item').attr('font-family', attrs.svgFontFamily).attr('width', attrs.svgWidth).attr('height', attrs.svgHeight).style('pointer-events', 'none').style('overflow', 'visible')
          // .attr("viewBox", "0 0 " + attrs.svgWidth + " " + attrs.svgHeight)
          // .attr("preserveAspectRatio", "xMidYMid meet")

          // svg
          var chart = svg.selectAll('.svg-group-item').data(['chart-group'])
          chart.exit().remove();
          chart = chart.enter().append('g').merge(chart);
          chart.attr('class', 'chart').attr('class', 'svg-group-item').attr('width', calc.chartWidth).attr('height', calc.chartHeight).attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')').style('pointer-events', attrs.hasPointerEvents ? 'all' : 'none')

          //center point for bubble
          var centerPoint = chart.selectAll('.center-point').data(['center-point'])
          centerPoint.exit().remove();
          centerPoint = centerPoint.enter().append('g').merge(centerPoint);
          centerPoint.attr('class', 'center-point').attr('transform', 'translate(' + calc.centerPointX + ',' + calc.centerPointY + ')')

          // =======================  ASSIGN NEEDED PROPS   =========================
          _var.containerObject = container;
          _var.chart = chart;
          _var.centerPoint = centerPoint;
          _var.svg = svg;
          break;
      }
    }
    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'calc', 'attrs'].forEach(function (key) {
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

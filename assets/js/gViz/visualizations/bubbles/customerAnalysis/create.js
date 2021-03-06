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
          var svg = container.selectAll('.svg-item').data(['svg-item']);
          svg.exit().remove();
          svg = svg.enter().append('svg').merge(svg);
          svg.attr('class', 'svg-item').attr('font-family', attrs.svgFontFamily).attr('width', attrs.svgWidth).attr('height', attrs.svgHeight).style('overflow', 'visible')
          // .attr("viewBox", "0 0 " + attrs.svgWidth + " " + attrs.svgHeight)
          // .attr("preserveAspectRatio", "xMidYMid meet")

          // svg
          var chart = svg.selectAll('.svg-group-item').data(['chart-group']);
          chart.exit().remove();
          chart = chart.enter().append('g').merge(chart);
          chart.attr('class', 'chart').attr('class', 'svg-group-item').attr('width', calc.chartWidth).attr('height', calc.chartHeight).attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')')

          //center point for bubble
          var centerPoint = chart.selectAll('.center-point').data(['center-point']);
          centerPoint.exit().remove();
          centerPoint = centerPoint.enter().append('g').merge(centerPoint);
          centerPoint.attr('class', 'center-point').attr('transform', 'translate(' + calc.centerPointX + ',' + calc.centerPointY + ')')

          var defs = chart.selectAll('.defs').data(['defs']);
          defs.exit().remove();
          defs = defs.enter().append('defs').merge(defs);
          defs.attr('class', 'defs');

          var pattern = defs.selectAll('.pattern').data(['pattern']);
          pattern.exit().remove();
          pattern = pattern.enter().append('pattern').merge(pattern);
          pattern.attr('class', 'pattern').attr('id', 'rectangularPattern').attr('width', attrs.rectanglePatternLength).attr('height', attrs.rectanglePatternLength).attr('patternUnits', 'userSpaceOnUse')

          var rect = pattern.selectAll('.rect').data(['rect']);
          rect.exit().remove();
          rect = rect.enter().append('rect').merge(rect);
          rect.attr('class', 'rect').attr('x', 0).attr('y', 0).attr('width', attrs.rectanglePatternLength).attr('height', attrs.rectanglePatternLength).attr('stroke', 'white').attr('stroke-width', '0.1px').attr('fill', attrs.circleFill);



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

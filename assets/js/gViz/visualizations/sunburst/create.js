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
      case 'run': {
        return true;
      };
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
          var container = d3.select(attrs.container);
          var containerWidth = container.node().getBoundingClientRect().width;
          var svgTranslateValue = (containerWidth - attrs.svgWidth) / 2;

          //Breadcrumbs
          var breadcrumbTrail = container.patternify({ selector: 'svg-breadcrumb-element', elementTag: 'svg' }).attr('width', "100%").attr('font-family', attrs.svgFontFamily).attr('height', 50 + 'px').attr('id', 'trail')

          //Svg container
          var svg = container
            .patternify({ selector: 'svg-element', elementTag: 'svg' })
            .attr('font-family', attrs.svgFontFamily).attr('width', attrs.svgWidth).attr('height', attrs.svgHeight).style('transform', ' translate(' + svgTranslateValue + ')' + 'scale(' + attrs.scale + ')')

          //Chart wrapper - same as _var.g
          var chart = svg
            .append('g')
            .patternify({ selector: 'chart', elementTag: 'g' })
            .attr('class', 'chart').attr('width', calc.chartWidth).attr('height', calc.chartHeight).attr('transform', 'translate(' + (calc.chartLeftMargin + calc.chartWidth/2) + ',' + (calc.chartHeight/2) + ')').attr('pointer-events', 'none')

          // Center point
          var centerPoint = chart
            .patternify({ selector: 'center-point', elementTag: 'g' })
            .append('g').attr('class', 'center-point')

          //Tooltip
          _var.foreignObjTooltip = svg.patternify({ selector: 'foreign-object-tooltip', elementTag: 'foreignObject' }).attr('width', 600).attr('height', 200).attr('class', 'foreign-obj-tooltip')

          //Div tooltip
          var tooltipDiv = container.patternify({ selector: 'tooltip-div', elementTag: 'div' }).style("opacity", 0).style('position', 'fixed').style('width', 'auto').style('pointer-events', 'none').style('font-family', attrs.svgFontFamily).style('background-color', 'white').style('z-index', 4)

          //Center div
          var centerDiv = container.patternify({ selector: attrs.lineChartSelector, elementTag: 'div' }).style('width', 0 + 'px').style('height', 0 + 'px').style('position', 'absolute').style('top', (calc.chartTopMargin * 0.6 + calc.centerPointY + attrs.breadCrumbDimensions.h) + 'px').style('left', (calc.chartLeftMargin + calc.chartWidth / 4.1) + 'px')

          //################################   FILTERS  &   SHADOWS  ##################################

          // Add filters ( Shadows)
          var defs = chart.patternify({ selector: 'defs-element', elementTag: 'defs' })
          calc.dropShadowUrl = "drop-shadow-sunburst" + Math.floor(Math.random() * 1000000);

          //Drop shadow filter
          var dropShadowFilter = defs.patternify({ selector: 'filter-element', elementTag: 'filter' }).attr("id", calc.dropShadowUrl).attr("height", "130%");
          dropShadowFilter.patternify({ selector: 'fe-gaussian-blur-element', elementTag: 'feGaussianBlur' }).attr("in", "SourceAlpha").attr("stdDeviation", 5).attr("result", "blur");
          dropShadowFilter.patternify({ selector: 'feOffset-element', elementTag: 'feOffset' }).attr("in", "blur").attr("dx", 2).attr("dy", 4).attr("result", "offsetBlur");
          dropShadowFilter.patternify({ selector: 'feFlood-element', elementTag: 'feFlood' }).attr('flood-color', 'black').attr("flood-opacity", "0.4").attr("result", "offsetColor");
          dropShadowFilter.patternify({ selector: 'feComposite-element', elementTag: 'feComposite' }).attr('in', 'offsetColor').attr('in2', 'offsetBlur').attr("operator", "in").attr("result", "offsetBlur");
          var feMerge = dropShadowFilter.patternify({ selector: 'feMerge-element', elementTag: 'feMerge' })
          feMerge.patternify({ selector: 'feMergeNode-element', elementTag: 'feMergeNode' }).attr("in", "offsetBlur")
          feMerge.patternify({ selector: 'feMergeNode2-element', elementTag: 'feMergeNode' }).attr("in", "SourceGraphic");

          // =======================  ASSIGN NEEDED PROPS   =========================
          _var.chart = chart;
          _var.centerPoint = centerPoint;
          _var.tooltipDiv = tooltipDiv;
          _var.breadcrumbTrail = breadcrumbTrail;
          break;
      }
    }
    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'data', 'attrs', 'calc'].forEach(function (key) {

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

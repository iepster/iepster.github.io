// Imports
var d3 = require("d3");
var common = require("../common");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var attrs = undefined;
  var calc = undefined;
  var chart = undefined;
  var svg = undefined;
  var container = undefined;
  var headerTitle = undefined;
  var chartName = undefined;
  var insightsWrapper = undefined;
  var profileImage = undefined;
  var legends = undefined;
  var shortChartName = undefined;
  var STATES = common.STATES;

  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run': {
        if (!attrs) console.log('not valid - attrs');
        if (!calc) console.log('not valid - calc');
        if (!chart) console.log('not valid -chart');
        if (!chart) console.log('not valid -chart');
        if (!svg) console.log('not valid -svg');
        if (!container) console.log('not valid -container');
        if (!headerTitle) console.log('not valid -headerTitle');
        if (!chartName) console.log('not valid -headerTitle');
        if (!insightsWrapper) console.log('not valid -insightsWrapper');
        if (!profileImage) console.log('not valid -profileImage');
        if (!legends) console.log('not valid -legends');
        if (!shortChartName) console.log('not valid -shortChartName');
        return true;
      }
      default: return false;
    }
  };

  // Main function
  var main = function (step) {

    // Validate attributes if necessary
    if (validate(step)) {
      switch (step) {
        case 'run':
          _var.updateHandlerFuncs.hoverStart = function (handlerFunc) {
            chart.on('mouseenter', handlerFunc);
          }
          _var.updateHandlerFuncs.hoverEnd = function (handlerFunc) {
            chart.on('mouseleave', handlerFunc);
          }

          // smoothly handle state updating
          _var.updateHandlerFuncs.state = function () {
            switch (attrs.state) {
              case STATES.INITIAL: {
                _var.connectorLine.attr('opacity', 1);
                insightsWrapper.transition()
                  // .attrTween("transform", translateAlong(svg.select('.transition-path').node()))
                  .attr('transform', 'translate(' + (calc.chartWidth * 0.8 + 70) + ',' + (calc.chartWidth * 0.87 - calc.chartWidth * 0.8) + ') ').select('.insight-text-wrapper').attr('opacity', '0')

                profileImage.transition().attr('opacity', '1').attr('x', calc.imagePosX + 40 + 70).attr('y', calc.imagePosY - calc.chartWidth * 0.8);
                legends.transition().attr('opacity', '0');
                shortChartName.transition().attr('opacity', '0');
                chartName.transition().attr('opacity', '1');
                svg.transition().style('transform', 'scale(' + attrs.scale + ')').attr('opacity', 1).on('end', function () { container.style('z-index', 0); });
                headerTitle.transition().style('transform', 'translate(' + 0 + ',0) scale(' + (1) + ')').attr('x', calc.centerPointX);
                break;
              }
              case STATES.ACTIVE: {
                _var.connectorLine.attr('opacity', 0);
                container.style('z-index', 1)
                svg.transition().attr('opacity', 1).style('transform', 'scale(' + (attrs.scale * attrs.titleHoverMovementIndex) + ')');
                headerTitle.transition().style('transform', ' scale(' + (1 / attrs.titleHoverMovementIndex) + ')').attr('x', function (d) { var old = d3.select(this).attr('x'); return +old * attrs.titleHoverMovementIndex; });
                insightsWrapper.transition().attr('transform', 'translate(' + (calc.chartWidth * 0.7) + ',' + calc.chartWidth * 0.87 + ') ').select('.insight-text-wrapper').attr('opacity', '1')
                profileImage.transition().attr('opacity', '1').attr('x', calc.imagePosX).attr('y', calc.imagePosY);
                legends.transition().attr('opacity', '1');
                shortChartName.transition().attr('opacity', '1');
                chartName.transition().attr('opacity', '0');
                break;
              }
              case STATES.SHADOWED: {
                container.style('z-index', 0)
                svg.transition().attr('opacity', 0.1).style('transform', 'scale(' + attrs.scale + ')')
                break;
              }
            }
          }

          _var.updateHandlerFuncs.scale = function () {
            svg.style('transform', 'scale(' + attrs.scale + ')')
            var reversedScale = 1 / attrs.scale;
            headerTitle.style('transform', 'scale(' + reversedScale + ')')
          }

          _var.updateHandlerFuncs.scale();
          _var.updateHandlerFuncs.state();
          _var.updateHandlerFuncs.hoverStart(attrs.hoverStart);
          _var.updateHandlerFuncs.hoverEnd(attrs.hoverEnd);


          break;
      }
    }
    return _var;
  };

  ['_var', 'calc', 'insightsWrapper', 'profileImage', 'legends', 'shortChartName', 'chartName', 'attrs', 'svg', 'chart', 'container', 'headerTitle'].forEach(function (key) {
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

  main.run = _ => main('run');
  return main;
};

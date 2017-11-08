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
  var salesMixExternalMiniDonut = undefined;
  var headerTitle = undefined;
  var chartName = undefined;
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
        if (!salesMixExternalMiniDonut) console.log('not valid -salesMixExternalMiniDonut');
        if (!headerTitle) console.log('not valid -headerTitle');
        if (!chartName) console.log('not valid -headerTitle');
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
                container.style('z-index', 0)
                svg.transition().attr('opacity', 1)
                _var.salesMixExternalMiniDonutLine.transition().attr('x2', 38).attr('y2', 5)
                salesMixExternalMiniDonut.transition().attr('transform', 'translate(' + (calc.chartWidth * 0.9) + ',' + (-calc.chartWidth / 4) + ')').attr('opacity', 1).selectAll('.back-circle').attr('r', 55)
                break;
              }
              case STATES.ACTIVE: {

                // container.style('z-index', 1)
                svg.transition().attr('opacity', 1);
                _var.salesMixExternalMiniDonutLine.transition().attr('x2', 38 + 80).attr('y2', -10)
                salesMixExternalMiniDonut.transition().attr('transform', 'translate(' + (calc.chartWidth * 0.9 + 80) + ',' + (-calc.chartWidth / 4 - 20) + ')').transition().selectAll('.back-circle').attr('r', 80)
                break;
              }
              case STATES.HIDDEN: {
                container.style('z-index', 0)
                svg.transition().attr('opacity', 0)
                break;
              }
              case STATES.SHADOWED: {
                container.style('z-index', 0)
                svg.transition().attr('opacity', 0.1)
                break;
              }
            }
          }
          _var.updateHandlerFuncs.scale = function () {
            svg.style('transform', 'scale(' + attrs.scale + ')');
            var reversedScale = 1 / attrs.scale;
            var avgMovingOnScale = 18;
            chartName.style('transform', 'scale(' + reversedScale + ')').attr('y', function (d) { var y = d3.select(this).attr('y'); return +y - reversedScale * avgMovingOnScale - 10; });
            headerTitle.attr('transform', 'translate(100,1) scale(' + reversedScale + ')')
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

  ['_var', 'calc', 'chartName', 'attrs', 'svg', 'chart', 'container', 'salesMixExternalMiniDonut', 'headerTitle'].forEach(function (key) {

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

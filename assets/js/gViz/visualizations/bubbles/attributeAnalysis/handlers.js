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
  var analysisWrapper = undefined;
  var attributeNames = undefined;
  var attributePercents = undefined;
  var STATES = common.STATES;

  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run': {
        if (!attrs) console.log('not valid - attrs');
        if (!calc) console.log('not valid - calc');
        if (!chart) console.log('not valid -chart');
        if (!svg) console.log('not valid -svg');
        if (!container) console.log('not valid -container');
        if (!headerTitle) console.log('not valid -headerTitle');
        if (!chartName) console.log('not valid -chartName');
        if (!analysisWrapper) console.log('not valid -analysisWrapper');
        if (!attributeNames) console.log('not valid -attributeNames');
        if (!attributePercents) console.log('not valid -attributePercents');
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

              //initial state for chart
              case STATES.INITIAL: {
                svg.transition().style('transform', 'scale(' + attrs.scale + ')').attr('opacity', 1).on('end', function (d) { container.style('z-index', 0); });
                analysisWrapper.transition().attr('opacity', 1).attr('transform', 'translate(' + calc.analysIconPosX + ',' + calc.analysIconPosY + ')')
                headerTitle.transition().attr('transform', 'translate(' + calc.centerPointX + ',' + (-calc.chartHeight / 16) + ') scale(' + (1) + ')')
                attributeNames.transition().attr('opacity', 0)
                attributePercents.transition().attr('opacity', 0)
                _var.analysisArrow.transition().attr('transform', `scale(${1})`)
                _var.chartName.transition().attr('transform', `scale(${1})`)
                break;
              }

              //active state, this will be triggered mostly on hover
              case STATES.ACTIVE: {
                var scaleIndex = 1.4;
                container.style('z-index', 1)

                svg.transition().attr('opacity', 1).style('transform', 'scale(' + (attrs.scale * scaleIndex) + ')');
                _var.analysisArrow.transition().attr('transform', `scale(${1 / scaleIndex}) translate(0,${calc.chartHeight / 8})`);
                _var.chartName.transition().attr('transform', `scale(${1 / scaleIndex}) translate(0,${calc.chartHeight / 8})`)
                headerTitle.transition().attr('transform', `scale(${1 / scaleIndex})  translate(${calc.centerPointX * scaleIndex},${-calc.chartHeight / 16}) `)
                analysisWrapper.transition().attr('transform', 'translate(' + (calc.analysIconPosX - 50) + ',' + (calc.analysIconPosY - 20) + ')').transition().attr('transform', 'scale(1.5)' + ' translate(' + (calc.analysIconPosX - 20) + ',' + (calc.analysIconPosY - 60) + ')').attr('opacity', 0);
                attributeNames.transition().attr('opacity', 1)
                attributePercents.transition().attr('opacity', 1)
                break;

              }

              //when chart will be partially displayed
              case STATES.SHADOWED: {
                svg.transition().attr('opacity', 0.1).style('transform', 'scale(' + attrs.scale + ')')
                break;
              }
            }
          }

          //scale func
          _var.updateHandlerFuncs.scale = function () {
            svg.style('transform', 'scale(' + attrs.scale + ')');

            // var reversedScale = 1 / attrs.scale;
            // var avgMovingOnScale = 18;
            // chartName.style('transform', 'scale(' + reversedScale + ')')
            //     .attr('y', function (d) {
            //         var y = d3.select(this).attr('y')
            //         return +y - reversedScale * avgMovingOnScale;
            //     });

            // headerTitle.style('transform', 'scale(' + reversedScale + ')')
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

  ['_var', 'calc', 'attributePercents', 'attributeNames', 'analysisWrapper', 'chartName', 'attrs', 'svg', 'chart', 'container', 'headerTitle'].forEach(function (key) {

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

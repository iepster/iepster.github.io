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
          _var.updateHandlerFuncs.hoverStart = function (handlerFunc) { chart.on('mouseenter', handlerFunc); }
          _var.updateHandlerFuncs.hoverEnd = function (handlerFunc) { chart.on('mouseleave', handlerFunc); }
          // smoothly handle state updating
          _var.updateHandlerFuncs.state = function () {
            switch (attrs.state) {
              case STATES.INITIAL: {
                container.style('z-index', 0)
                svg.transition().attr('opacity', 1).style('transform', 'scale(' + attrs.scale + ')  translate(0,0)');
                _var.leftNumberFlagArcLines.transition().attr('opacity', 1)
                _var.rightNumberFlagArcLines.transition().attr('opacity', 1);

                _var.numberBackCircle2.transition().duration(300).attr('transform', attrs.lineDirection == 'LEFT' ? 'translate(-100,170)' : `translate(30,305)`).attr('opacity', 1)
                _var.numberCircleText2.transition().duration(300).attr('transform', attrs.lineDirection == 'LEFT' ? 'translate(-100,170)' : `translate(30,305)`).attr('opacity', 1)
                _var.numberBackCircle3.transition().duration(300).attr('transform', attrs.lineDirection == 'LEFT' ? 'translate(-90,240)' : `translate(100,350)`).attr('opacity', 1)
                _var.numberCircleText3.transition().duration(300).attr('transform', attrs.lineDirection == 'LEFT' ? 'translate(-90,240)' : `translate(100,350)`).attr('opacity', 1)

                break;
              }
              case STATES.ACTIVE: {
                container.style('z-index', 2)
                svg.transition().delay(100).attr('opacity', 1).style('transform', 'scale(' + attrs.scale + ')')
                _var.leftNumberFlagArcLines.transition().attr('opacity', 0)
                _var.rightNumberFlagArcLines.transition().attr('opacity', 0);

                _var.numberBackCircle2.transition().duration(300).attr('transform', attrs.lineDirection == 'LEFT' ? 'translate(-180,-150)' : `translate(220,150)`)
                _var.numberCircleText2.transition().duration(300).attr('transform', attrs.lineDirection == 'LEFT' ? 'translate(-180,-150)' : `translate(220,150)`)
                _var.numberBackCircle3.transition().duration(300).attr('transform', attrs.lineDirection == 'LEFT' ? 'translate(-160,40)' : `translate(-15,210)`)
                _var.numberCircleText3.transition().duration(300).attr('transform', attrs.lineDirection == 'LEFT' ? 'translate(-160,40)' : `translate(-15,210)`)

                break;
              }
              case STATES.HIDDEN: {
                container.style('z-index', 0)
                svg.transition().duration(300).style('transform', 'scale(0)').attr('opacity', 0)
                break;
              }
              case STATES.SHADOWED: {
                container.style('z-index', 0)
                svg.transition().attr('opacity', 0.1)
              }
            }
          }
          _var.updateHandlerFuncs.scale = function () { svg.style('transform', 'scale(' + attrs.scale + ')'); }
          _var.updateHandlerFuncs.showTitle = function () {
            var showing = attrs.showTitle;
            var result = showing ? 1 : 0
            headerTitle.attr('opacity', result);
          }
          _var.updateHandlerFuncs.scale();
          _var.updateHandlerFuncs.state();
          _var.updateHandlerFuncs.showTitle();
          _var.updateHandlerFuncs.hoverStart(attrs.hoverStart);
          _var.updateHandlerFuncs.hoverEnd(attrs.hoverEnd);
          break;
      }
    }
    return _var;
  };

  ['_var', 'calc', 'attrs', 'svg', 'chart', 'container', 'headerTitle'].forEach(function (key) {

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

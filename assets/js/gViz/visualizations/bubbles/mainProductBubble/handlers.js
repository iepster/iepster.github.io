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
                break;
              }
              case STATES.ACTIVE: {
                container.style('z-index', 1)
                svg.transition().attr('opacity', 1);
                break;
              }
              case STATES.HIDDEN: {
                container.style('z-index', 0)
                svg.transition().attr('opacity', 0.1)
                break;
              }
            }
          }

          _var.updateHandlerFuncs.scale = function () { svg.style('transform', 'scale(' + attrs.scale + ')'); }
          _var.updateHandlerFuncs.scale();
          _var.updateHandlerFuncs.state();
          _var.updateHandlerFuncs.hoverStart(attrs.hoverStart);
          _var.updateHandlerFuncs.hoverEnd(attrs.hoverEnd);
          break;
      }
    }
    return _var;
  };

  ['_var', 'calc', 'attrs', 'svg', 'chart', 'container'].forEach(function (key) {

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

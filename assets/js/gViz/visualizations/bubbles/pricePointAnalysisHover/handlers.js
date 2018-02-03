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
  var svg = undefined;
  var container = undefined;
  var chart = undefined;
  var STATES = common.STATES;

  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run': {
        if (!attrs) console.log('not valid - attrs');
        if (!calc) console.log('not valid - calc');
        if (!svg) console.log('not valid -svg');
        if (!container) console.log('not valid -container');
        if (!chart) console.log('not valid -chart');
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
                svg.transition().attr('opacity', 1).style('transform', 'scale(' + attrs.scale + ')')//.on('end', function (d) { container.style('z-index', 0); })
                break;
              }
              case STATES.ACTIVE: {
                container.style('z-index', 2);
                svg.transition().delay(300).attr('opacity', 1).style('transform', 'scale(' + attrs.scale + ')')
                break;
              }

              case STATES.HIDDEN: {
                svg.transition().style('transform', 'scale(0)').attr('opacity', 0)//.on('end', function (d) { container.style('z-index', 0); })
                break;
              }
              case STATES.SHADOWED: {
                container.style('z-index', 0)
                svg.transition().attr('opacity', 0.1)
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

  ['_var', 'calc', 'attrs', 'svg', 'container', 'chart'].forEach(function (key) {
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

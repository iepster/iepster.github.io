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
  var transitionGroup = undefined;
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
        if (!transitionGroup) console.log('not valid -transitionGroup');
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

              //initial state
              case STATES.INITIAL: {
                container.style('z-index', 0);
                svg.attr('opacity', 1);
                break;
              }

              //active state - mostly triggered on hover
              case STATES.ACTIVE: {
                container.style('z-index', 1);
                svg.transition().delay(280).duration(300).attr('opacity', 1).style('transform', 'scale(' + attrs.scale + ')')
                transitionGroup.transition().delay(600).attr('opacity', 1).style('transform', 'scale(1)')
                break;
              }

              //hidden state - mostly when it's dependent on other chart
              case STATES.HIDDEN: {
                transitionGroup.transition().attr('opacity', 0).style('transform', 'scale(0)')
                svg.transition().delay(20).attr('opacity', 0).style('transform', 'scale(0)').attr('transform', 'translate(-600,0)');
                break;
              }

              // will occur only some  scenarios
              case STATES.SHADOWED: {
                svg.transition().attr('opacity', 0.1).style('transform', 'scale(' + attrs.scale + ')')
                transitionGroup.transition().delay(100).attr('opacity', 0.1).style('transform', 'scale(1)')
                break;
              }
            }
          }

          //initialize scale func
          _var.updateHandlerFuncs.scale = function () { svg.style('transform', 'scale(' + attrs.scale + ')'); }

          //invoke update handler functions
          _var.updateHandlerFuncs.scale();
          _var.updateHandlerFuncs.state();
          _var.updateHandlerFuncs.hoverStart(attrs.hoverStart);
          _var.updateHandlerFuncs.hoverEnd(attrs.hoverEnd);
          break;
      }
    }
    return _var;
  };

  // Expose Global variables
  ['_var', 'calc', 'attrs', 'svg', 'chart', 'container', 'transitionGroup'].forEach(function (key) {
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

  //invoke main step function
  main.run = _ => main('run');

  return main;
};

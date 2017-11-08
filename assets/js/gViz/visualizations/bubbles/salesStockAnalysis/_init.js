// Imports
let d3 = require("d3");
var common = require("../common");

// Module declaration
module.exports = function () {
  "use strict";


  // Auxiliar Functions
  let components = {
    initialize: require('./initialize.js'),
    create: require('./create.js'),
    elements: require('./elements.js'),
    handlers: require('./handlers.js'),

  };
  //var attrs={}
  // Get attributes values
  let attrs = {
    hoverStart: null,
    hoverEnd: null,
    data: null,
    state: common.STATES.INITIAL,
    container: null,
    scale: 1,
    svgWidth: 400,
    svgHeight: 400,
    marginTop: 50,
    marginBottom: 60,
    marginRight: 160,
    marginLeft: 5,
    svgFontFamily: "Yantramanav",
    circleStrokeWidth: 3,
    circleStroke: '#DAD3DE',
    headerTitleCirclePadding: -10,
    headerTitleFill: '#EA5C84',
    headerTitleFontSize: 24,
    chartNameFill: '#73628C',
    chartNameFontSize: 23,
    numberFlagFontSize: 27,
    numberFlagPosY: 10,
    numberFlagCircleRadius: 25,
    numberFlagColor: '#EA5C84',
    showTitle: false,
    valuTextFontSize: 30,
    linesFill: '#9D91AA',
    hasPointerEvents: false,
    lineDirection: 'LEFT'  // LEFT,RIGHT,NONE
  };

  let updateHandlerFuncs = common.getUpdateHandlerFuncs();
  updateHandlerFuncs.showTitle = null;
  var _var = {
    calc: null,
    chart: null,
    centerPoint: null,
    containerObject: null,
    svg: null,
    headerTitle: null,
    attrs: attrs,
    updateHandlerFuncs: updateHandlerFuncs
  };
  let action = 'build';

  // Validate attributes
  let validate = function (step) {
    switch (step) {
      case 'build': return true;
      case 'initialize': return true;
      case 'create': return true;
      case 'elements': return true;
      case 'handlers': return true;
      default: return false;
    }
  };

  // Main function
  let main = function (step) {

    // Validate attributes if necessary
    if (validate(step)) {
      switch (step) {

        // Build entire visualizations
        case 'build':
          console.log('initializing');
          main('initialize');
          console.log('creating');
          main('create');
          console.log('elements');
          main('elements');
          console.log('handling');
          main("handlers");
          console.log('done');
          break;
        // Initialize visualization variable
        case 'initialize':

          // Initializing
          _var = components.initialize()
            ._var(_var)
            .attrs(_var.attrs)
            .run();

          break;

        // Create initial elements
        case 'create':

          // Creating wrappers
          _var = components.create()
            ._var(_var)
            .attrs(_var.attrs)
            .calc(_var.calc)
            .run();
          break;

        // Setup chart elements
        case 'elements':

          // Running
          _var = components.elements()
            ._var(_var)
            .attrs(_var.attrs)
            .calc(_var.calc)
            .centerPoint(_var.centerPoint)
            .chart(_var.chart)
            .run();
          break;
        case 'handlers':

          // Handling
          _var = components.handlers()
            ._var(_var)
            .attrs(_var.attrs)
            .svg(_var.svg)
            .calc(_var.calc)
            .chart(_var.chart)
            .container(_var.containerObject)
            .headerTitle(_var.headerTitle)
            .run();
          break;
      }
    }
    return _var;
  };

  // Expose some global variables
  ['container', 'action', 'svgHeight', 'svgWidth', 'hasPointerEvents'].forEach((key) => {
    // Attach variables to main function
    return main[key] = function (_) {
      var string = `attrs['${key}'] = _`;
      if (!arguments.length) { eval(`return attrs['${key}']`); }
      eval(string);
      return main;
    };
  });

  //expose variables which causes corresponding handler functions to run
  ['scale', 'state', 'data', 'hoverStart', 'hoverEnd', 'showTitle', 'numberFlagColor', 'chartNameFill', 'lineDirection'].forEach(function (key) {
    // Attach variables to main function
    return main[key] = function (_) {
      if (!arguments.length) {
        var res = eval(` attrs['${key}']`);
        return res;
      }
      eval(`attrs['${key}'] = _`);
      if (typeof eval(`updateHandlerFuncs['${key}']`) === 'function') {
        eval(`updateHandlerFuncs['${key}'](attrs['${key}'] )`);
      }
      return main;
    };
  });

  // Secondary functions
  main.run = _ => main("build");

  return main;

}

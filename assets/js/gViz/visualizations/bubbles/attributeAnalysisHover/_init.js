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
    state: common.STATES.ACTIVE,
    container: null,
    scale: 0.8,
    svgWidth: 500,
    svgHeight: 500,
    marginTop: 10,
    marginBottom: 70,
    marginRight: 5,
    marginLeft: 5,
    svgFontFamily: "Yantramanav",
    circleStrokeWidth: 3,
    circleStroke: 'none',
    circleFill: "#E679A3",
    headerTitleCirclePadding: -10,
    headerTitleFill: '#73628C',
    headerTitleFontSize: 21,
    chartNameFontSize: 20,
    chartNameFill: '#73628C',
    attrsSymbolFill: '#73628C',
    attrsSymbolFontSize: 18,
    attributeCircleRadius: 10,
    attrsCirclePosY: -5,
    barsPosY: 30,
    dashLineCount: 4,
    axesTextFill: '#73628C',
    leftAxisTextFontSize: 10,
    legendTextFill: '#73628C',
    legendTextFontSize: 12,
    legendTextPosX: 16,
    legendRectWidth: 15,
    legendRectPosY: -12,
    salesMixMiniCircleRadius: 60,
    salesMixMiniCircleTextPosY: -20,
    salesMixMiniCircleTextFill: '#73628C',
    salesMixMiniCircleValueFill: '#F08DA9',
    salesMixMiniCircleValueFontSize: 25
  };

  //outsaider triggered update handler functions
  let updateHandlerFuncs = common.getUpdateHandlerFuncs();

  //main var declaration
  var _var = {
    calc: null,
    chart: null,
    centerPoint: null,
    containerObject: null,
    svg: null,
    transitionGroup: null,
    scales: null,
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
            .scales(_var.scales)
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
            .transitionGroup(_var.transitionGroup)
            .run();
          break;
      }
    }
    return _var;
  };

  // Expose some global variables
  ['container', 'action', 'svgHeight', 'svgWidth'].forEach((key) => {

    // Attach variables to main function
    return main[key] = function (_) {

      var string = `attrs['${key}'] = _`;

      if (!arguments.length) { eval(`return attrs['${key}']`); }
      eval(string);
      return main;
    };
  });

  //expose variables which causes corresponding handler functions to run
  ['scale', 'state', 'data', 'hoverStart', 'hoverEnd'].forEach(function (key) {

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

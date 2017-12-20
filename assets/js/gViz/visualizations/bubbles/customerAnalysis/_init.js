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

  // Get attributes values
  let attrs = {
    hoverStart: null,
    hoverEnd: null,
    data: null,
    state: common.STATES.INITIAL,
    container: null,
    scale: 1,
    svgWidth: 500,
    svgHeight: 500,
    marginTop: 40,
    marginBottom: 130,
    marginRight: 85,
    marginLeft: 5,
    svgFontFamily: "Yantramanav",
    circleStrokeWidth: 3,
    circleStroke: '#DAD3DE',
    headerTitleCirclePadding: -10,
    headerTitleFill: '#EA5C84',
    headerTitleFontSize: 20,
    rectanglePatternLength: 15,
    titleHoverMovementIndex: 1.2,
    chartNameFill: '#73628C',
    chartNameFontSize: 18,
    shortChartNameFill: '#8B6C95',
    eachLegendHeight: 20,
    legendTextFontSize: 12,
    legendTextFill: '#EBA5C3',
    circleFill: '#F7B5C9',
    insightCircleFill: '#F7B5C9',
    insightLineFill: '#9D91AA',
    insightLineStrokeWidth: 2.5,
    insightTitleFill: '#8B6C95',
    insightTitleFontSize: 12,
    insightValueTextFill: '#F669A2',
    firstLineTextFontSize: 13,
    insightProfileCircleFill: '#F08DA9',
    urlLocation: 'login',
    colorRanges: [
      '#ECECEC',
      '#FFE1EF',
      '#FFC2DE',
      '#F88DB3',
      '#EB5C84',
      '#D60063'
    ],
  };

  let updateHandlerFuncs = common.getUpdateHandlerFuncs();

  var _var = {
    calc: null,
    scales: null,
    chart: null,
    centerPoint: null,
    containerObject: null,
    svg: null,
    chartname: null,
    headerTitle: null,
    insightsWrapper: null,
    profileImage: null,
    legends: null,
    shortChartName: null,
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
            .headerTitle(_var.headerTitle)
            .chartName(_var.chartName)
            .insightsWrapper(_var.insightsWrapper)
            .profileImage(_var.profileImage)
            .legends(_var.legends)
            .shortChartName(_var.shortChartName)
            .run();

          break;

      }
    }
    return _var;
  };

  // Expose some global variables
  ['container', 'action', 'svgHeight', 'svgWidth','circleFill','circleStroke'].forEach((key) => {

    // Attach variables to main function
    return main[key] = function (_) {
      var string = `attrs['${key}'] = _`;
      if (!arguments.length) { return eval(` attrs['${key}'];`); }
      eval(string);
      return main;
    };
  });

  //expose variables which causes corresponding handler functions to run
  ['scale', 'state', 'data', 'hoverStart', 'hoverEnd', 'urlLocation'].forEach(function (key) {
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

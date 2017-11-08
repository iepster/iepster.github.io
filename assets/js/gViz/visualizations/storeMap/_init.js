// Imports
var d3 = require("d3");

// Module declaration
module.exports = function () {
  "use strict";


  // Auxiliar Functions
  var components = {
    initialize: require('./initialize.js'),
    create: require('./create.js'),
    elements: require('./elements.js'),
    handlers: require('./handlers.js'),


  };


  var attrs = {
    data: null,
    container: null,
    urlLocation: null,
    scale: 1,
    svgWidth: 800,
    svgHeight: 300,
    marginTop: 100,
    marginBottom: 60,
    marginRight: 20,
    marginLeft: 20,
    rectanglePatternLength: 19,
    patterBackgroundColor: '#ECECEC',
    svgFontFamily: "Yantramanav",
    barMaxHeight: 70,
    bottomBarHeight: 3,
    bottomBarColor: '#596A6D',
    barWidth: 1.5,
    barOpacity: 1,
    barColor: '#8DC4CD',
    barHoverColor: 'teal',
    tooltipHoverColor: 'teal',
    infoPanelColor: '#8BC3D2',
    // zoomWidth: 2,
    // zoomHeight: 1.4,
    // moveLeft: 270,
    // moveTop:-20,
    zoomWidth: 5,
    zoomHeight: 3.2,
    moveLeft: 200,
    moveTop: -150,
    urlLocation: 'watch',
    hasTooltip: false,
    zoomButtonColor: '#E1E1E1',
    zoomButtonTextColor: '#676991',
    isLeftChecked: true,
    displayToggle: true,
    hasInfoPanel: true,
    toggleLeftText: "Bars",
    toggleRightText: "Heatmap",
    transform: {
      k: 1, //scale
      x: 0,
      y: 0
    },
  }

  var _var = {
    attrs: attrs,
    calc: null,
    chart: null,
    handlers: {
      tooltipMouseEnter: null,
      tooltipMouseLeave: null,
      tooltipMouseMove: null,
      redraw: null
    }
  };



  var updateHandlerFuncs = {
    barHoverStart: undefined,
    barHoverEnd: undefined,
    highlightBars: undefined
  }



  var action = 'build';




  // Validate attributes
  var validate = function (step) {
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
  var main = function (step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'build':

          main('initialize');
          main('create');
          main('elements');
          main("handlers");
          break;
        // Initialize visualization variable
        case 'initialize':

          // Initializing
          _var = components.initialize()
            ._var(_var)
            .data(attrs.data)
            .attrs(attrs)
            .handlers(_var.handlers)
            .run();

          break;

        // Create initial elements
        case 'create':

          // Creating wrappers
          _var = components.create()
            ._var(_var)
            .calc(_var.calc)

            .attrs(attrs)
            .behaviors(_var.behaviors)
            .run();
          break;


        // Setup chart elements
        case 'elements':

          // Running
          _var = components.elements()
            ._var(_var)
            .svg(_var.svg)
            .attrs(attrs)
            .calc(_var.calc)
            .chart(_var.chart)
            .scales(_var.scales)
            .handlers(_var.handlers)
            .container(_var.container)
            .updateHandlerFuncs(updateHandlerFuncs)
            .defs(_var.defs)
            .run();


          break;



        case 'handlers':

          // Handling
          _var = components.handlers()
            ._var(_var)
            .attrs(attrs)
            .handlers(_var.handlers)
            .tooltipDiv(_var.tooltipDiv)
            .infoDiv(_var.infoDiv)
            .chart(_var.chart)
            .updateHandlerFuncs(updateHandlerFuncs)
            .barWrapper(_var.barWrapper)
            .projection(_var.projection)
            .scales(_var.scales)
            .urlLocation(attrs.urlLocation)
            .svg(_var.svg)
            .run();

          break;


      }
    }

    return _var;
  };

  // Expose some global variables
  ['data', 'container', 'svgWidth', 'urlLocation'].forEach((key) => {

    // Attach variables to main function
    return main[key] = function (_) {

      var string = `attrs['${key}'] = _`;

      if (!arguments.length) { eval(`return attrs['${key}']`); }
      eval(string);
      return main;
    };
  });


  //expose variables which causes corresponding handler functions to run

  ['barHoverStart', 'barHoverEnd', 'var'].forEach(function (key) {
    // Attach variables to main function
    return main[key] = function (_) {

      if (!arguments.length) { eval(`return attrs['${key}]'`); }
      eval(`updateHandlerFuncs['${key}'] = _`);
      return main;
    };
  });


  main.highlightBars = (flag, product) => updateHandlerFuncs.highlightBars(flag, product);

  // Secondary functions
  main.run = _ => main("build");

  return main;

}

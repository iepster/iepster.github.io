//Imports
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

  //Sunburst types
  var types = {
    LINED: 'LINED',  // in center line chart is displayed
    PRODUCTED: 'PRODUCTED' // in center product attributes is displayed
  }

  // Chart states
  var states = {
    INITIAL: 'INITIAL',
    DETAIL_VIEW: 'DETAIL_VIEW',
    INITIAL_DRAG: 'INITIAL_DRAG',
    DETAIL_DRAG: 'DETAIL_DRAG',
    EXTERNAL_DRAG: 'EXTERNAL_DRAG'
  }

  // Static attribute values
  var attrs = {
    data: null,
    container: null,
    urlLocation: null,
    data: null,
    type: types.PRODUCTED,
    state: states.INITIAL,
    scale: 1,
    marginTop: 20,
    marginBottom: 20,
    marginRight: 20,
    marginLeft: 20,
    svgFontFamily: "Yantramanav",
    lineChartSelector: 'line-chart-selector',
    centerText: 'Total Revenue',
    defaultTextColor: '#898888',
    dependentSunburst: null,
    sportSymbolUrl: './assets/images/gViz/visualizations/sunburst/sportbra.png',
    baseImagePath: '../../assets/sunburst/Products/',
    productTextDefaultFill: '#6F6E6E',
    productRevenueText: '$ 1K',
    productName: 'Product name',
    productColor: 'blue',
    productSizeVal: 'LDD',
    draggedSunburstTransparency: 0.3,
    breadcrumbTextSize: 12,
    isFullScreenMode: false,
    hideVariablesButton: true,
    radiusExponent: 0.5,
    radiusLengthFraction: 1,
    restModeSumText: "Total Sales Value",
     mouseToolTip: true,
    restModeSumValue: {
      "prefix": "$",
      "sufix": "",
      "format": ""
    },
    hoverModePriceText: "Total Sales", //support of dinamic props 
    hoverModePriceValue: {
      "prefix": "$",
      "sufix": "",
      "format": ""
    },
    firstLevelTooltipText: { "left": "{PERCENT} %", "right": "of the category " },  //support of dinamic props _ additional category percent property - PERCENT
    deepLevelTooltipText: { "left": "{PERCENT} %", "right": "of the collection {PROPERTY_NAME}" }, //support of dinamic props _ additional collection percent property - PERCENT
    hoverModeProductType: "{type}",//support of dinamic props 
    hoverModeProductName: "{name}",//support of dinamic props 
    breadCrumbDimensions: {
      w: 130, h: 20, s: 0, t: 10
    },
    opacityConfig: {    //opacity and depth config
      '1': 1,
      '2': 0.7,
      '3': 0.4
    }
  }

  //Context cariables
  var _var = {
    calc: null,
    chart: null,
    attrs: attrs,
    states: states,
    handlers: {
      tooltipMouseEnter: null,
      tooltipMouseLeave: null,
      tooltipMouseMove: null,
      breadcrumbShow: null,
      breadcrumbHide: null,
      detailView: null,
      initialView: null,
      dragStarted: null,
      dragging: null,
      dragEnded: null,
      freezeSector: null
    }
  };

  // Update handler functions
  var updateHandlerFuncs = {
    showDragCircle: undefined,
    isInDragArea: undefined,
    addNode: undefined,
    makeSunburstTransparent: undefined,
    onSectorHoverStart: f => { },
    onSectorHoverEnd: f => { },
    onNodeDeleted: f => { },
    onButtonClick: f => { console.log('button click works') }
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
            .run();
          break;

        // Setup chart elements
        case 'elements':

          // Running
          _var = components.elements()
            ._var(_var)
            .attrs(attrs)
            .calc(_var.calc)
            .chart(_var.chart)
            .centerPoint(_var.centerPoint)
            .layouts(_var.layouts)
            .hierarchy(_var.hierarchy)
            .arcs(_var.arcs)
            .scales(_var.scales)
            .formatting(_var.formatting)
            .handlers(_var.handlers)
            .breadcrumbTrail(_var.breadcrumbTrail)
            .behaviors(_var.behaviors)
            .types(types)
            .updateHandlerFuncs(updateHandlerFuncs)
            .run();
          break;

        case 'handlers':

          // Handling
          _var = components.handlers()
            ._var(_var)
            .attrs(_var.attrs)
            .handlers(_var.handlers)
            .tooltipDiv(_var.tooltipDiv)
            .sunburstPaths(_var.sunburstPaths)
            .breadcrumbTrail(_var.breadcrumbTrail)
            .states(_var.states)
            .centerPoint(_var.centerPoint)
            .scales(_var.scales)
            .arcs(_var.arcs)
            .calc(_var.calc)
            .revenueValue(_var.revenueValue)
            .productName(_var.productName)
            .productId(_var.productId)
            .centerText(_var.centerText)
            .states(states)
            .dragCircleContent(_var.dragCircleContent)
            .dragBackgroundCircle(_var.dragBackgroundCircle)
            .layouts(_var.layouts)
            .hierarchy(_var.hierarchy)
            .updateHandlerFuncs(updateHandlerFuncs)
            .chart(_var.chart)
            .behaviors(_var.behaviors)
            .types(types)
            .productWrapper(_var.productWrapper)
            .dragCircle(_var.dragCircle)
            .productRevenue(_var.productRevenue)
            .styleName(_var.styleName)
            .productImage(_var.productImage)
            .productTotalRevenueText(_var.productTotalRevenueText)
            .productsDefinition(_var.productsDefinition)
            .variablesButtonG(_var.variablesButtonG)
            .totalSalesValueG(_var.totalSalesValueG)
            .totalSalesValue(_var.totalSalesValue)
            .urlLocation(attrs.urlLocation)
            .run();

          break;
      }
    }

    return _var;
  };

  // Expose some global variables
  ['data', 'container', 'type', 'baseImagePath', 'urlLocation', 'isFullScreenMode', 'hideVariablesButton','svgWidth','svgHeight'].forEach((key) => {

    // Attach variables to main function
    return main[key] = function (_) {
      var string = `attrs['${key}'] = _`;
      if (!arguments.length) { eval(`return attrs['${key}']`); }
      eval(string);
      return main;
    };
  });

  //Expose variables which causes corresponding handler functions to run
  ['showDragCircle', 'makeSunburstTransparent'].forEach(function (key) {
    // Attach variables to main function
    return main[key] = function (_) {
      if (!arguments.length) { eval(`return attrs['${key}]'`); }
      eval(`attrs['${key}'] = _`);
      if (typeof eval(`updateHandlerFuncs['${key}']`) === 'function') {
        return eval(` updateHandlerFuncs['${key}'](${_})`);
      }
      return main;
    };
  });

  main.isInDragArea = (coords, newNode) => updateHandlerFuncs.isInDragArea(coords, newNode);
  main.addNode = _ => updateHandlerFuncs.addNode(_);
  main.highlighSectors = (flag, productsArr) => updateHandlerFuncs.highlighSectors(flag, productsArr);
  main.onSectorHoverStart = f => { updateHandlerFuncs.onSectorHoverStart = f; return main; }
  main.onSectorHoverEnd = f => { updateHandlerFuncs.onSectorHoverEnd = f; return main; }
  main.onButtonClick = f => { updateHandlerFuncs.onButtonClick = f; return main; }
  main.onNodeDeleted = f => { updateHandlerFuncs.onNodeDeleted = f; return main; }

  // Secondary functions
  main.run = _ => main("build");

  return main;
}

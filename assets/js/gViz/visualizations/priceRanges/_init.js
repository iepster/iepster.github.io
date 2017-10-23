// Imports
var d3 = require("d3");

// Module declaration
module.exports = function () {

  // Auxiliar Functions
  var components = {
    initialize: require('./initialize.js'),
    create: require('./create.js'),
    elements: require('./elements.js'),
    handlers: require('./handlers.js')
  };

  //Static attribute values
  var attrs = {
    data: null,
    container: null,
    urlLocation: null,
    data: null,
    scale: 1,
    state: 'FULL',  //FULL,CATEGORY,DETAIL,
    mode: 'CATEGORY', //PRICE_POINT, CATEGORY, COLLECTION
    svgWidth: 800,
    svgHeight: 700,
    marginTop: 100,
    marginBottom: 70,
    marginRight: 100,
    marginLeft: 130,
    tooltipWidth: 300,
    svgFontFamily: "Helvetica",
    centerCircleRadius: 50,
    stroke: '#515f60',
    strokeWidth: 0.8,
    pointRadius: 2.5,
    highlightedPointRadius: 7,
    pointOpacity: 0.25,
    legendLineThickness: 1,
    legendLineFill: '#5A5A59',
    defaultTextFill: '#3D3342',
    pointFill: '#3D3342',//'#4292A4',
    secondaryPointFill: '#FF4000',
    legendTextPosY: -51,
    legendTextFill: '#FF674C',
    legendFontSize: 13,
    categoryTextFontSize: 30,
    priceRangeCountTextFontSize: 11,
    urlLocation: "",
    colors: { min: "#D3EBF0", max: "#00B7DB" },
    log: true,
    tooltipFill: '#003443',
    activeBtnFill: '#FF4000',
    passiveBtnFill: '#C6C6C6',
    shouldNotBeScaled: ['.breadcrumb-wrapper', '.company-legends-wrapper'],
    hasToggle: false,
    centerText: "Center Text",
    bottomTooltipText: "Difference",
    zoomLevel: 1.14,
    circleDecreaseLevel: 0.9,
    breadCrumbDimensions: {
      w: 130, h: 25, s: 0, t: 10
    },

  }

  // Context variables
  var _var = {
    attrs: attrs,
    calc: null,
    chart: null,
    handlers: {
      breadcrumbShow: null,
      breadcrumbHide: null,
      hightlightSector: null,
      drillToDepth: null,
      priceRangeHighlight: null,
      pointTooltip: null,
      categoryMode: null,
      back: null
    },
    utils: {
      getPositionBasedOnArc: null
    },
    log: (m) => { if (attrs.log) { console.log(m); } }
  };

  //Action
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
            .arcs(_var.arcs)
            .layouts(_var.layouts)
            .handlers(_var.handlers)
            .svg(_var.svg)
            .run();
          break;

        //Setup some event handlers
        case 'handlers':

          // Handling
          _var = components.handlers()
            ._var(_var)
            .handlers(_var.handlers)
            .attrs(attrs)
            .chart(_var.chart)
            .breadcrumbTrail(_var.breadcrumbTrail)
            .arcs(_var.arcs)
            .calc(_var.calc)
            .tooltip(_var.tooltip)
            .fixedTooltip(_var.fixedTooltip)
            .run();
          break;
      }
    }
    return _var;
  };

  // Expose some global variables
  ['data', 'container', 'urlLocation', 'svgWidth', 'svgHeight'].forEach((key) => {

    // Attach variables to main function
    return main[key] = function (_) {
      var string = `attrs['${key}'] = _`;
      if (!arguments.length) { eval(`return attrs['${key}']`); }
      eval(string);
      return main;
    };
  });

  // Secondary functions
  main.run = _ => main("build");

  return main;

}

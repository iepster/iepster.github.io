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
    handlers: require('./handlers.js'),

  };
  var container;
  var chartsContainer;
  var attrs = {
    data: null,
    urlLocation: null,
    height: 500,
    width: 700,
    movementOffsetX: 0,
    movementOffsetY: 0,
  }
  var _var = {
    layoutType: null,
    attrs: attrs
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
          //console.log('elements');
          // main('elements');
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
            .run();

          break;

        // Create initial elements
        case 'create':

          // Creating wrappers
          _var = components.create()
            ._var(_var)
            .attrs(attrs)
            .layoutType(_var.layoutType)
            .data(attrs.data.data)
            .chartsContainer(chartsContainer)
            .urlLocation(attrs.urlLocation)
            .run();
          break;

        case 'handlers':

          // Handling
          _var = components.handlers()
            ._var(_var)
            .allCharts(_var.allCharts)
            .run();
          break;

      }
    }
    return _var;
  };

  // Expose some global variables
  ['container', 'data', 'urlLocation', '_var'].forEach((key) => {

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

  main.container = selector => {
    var contElem = d3.select(selector);

    //clear container
    contElem.html("");
    contElem.style('background-image', 'url(./assets/images/gViz/visualizations/bubbles/blackBackground.png)')
    contElem.style('overflow', 'hidden')

    if (contElem.style('height')) {
      var height = +contElem.style('height').match(/\d+/)[0];
      if (height > attrs.height) {
        attrs.height = height;
        attrs.movementOffsetY = 0
      } else {
        attrs.movementOffsetY = (height - attrs.height) / 2;
      }
    }
    d3.select("[data-id='gViz-visuals-vis-wrapper']").style('min-height', attrs.height + 'px')

    if (contElem.style('width')) {
      var width = +contElem.style('width').match(/\d+/)[0];
      if (width > attrs.width) {
        attrs.width = width;
        attrs.movementOffsetX = 0
      } else {
        attrs.movementOffsetX = (width - attrs.width) / 2;
      }

    }


    //add white background circles wrapper container
    var whiteCirclesWrapper = contElem.selectAll('.white-circles-wrapper').data(['.white-circles-wrapper']);
    whiteCirclesWrapper.exit().remove();
    whiteCirclesWrapper = whiteCirclesWrapper.enter().append('div').merge(whiteCirclesWrapper);
    whiteCirclesWrapper.attr('class', 'white-circles-wrapper').style("position", "absolute");


    //white background circles
    //common.drawWhiteCircles(whiteCirclesWrapper, attrs);

    //charts wrapper container
    var chartsWrapper = contElem.selectAll('.charts-wrapper').data(['charts-wrapper']);
    chartsWrapper.exit().remove();
    chartsWrapper = chartsWrapper.enter().append('div').merge(chartsWrapper);
    chartsWrapper.attr('class', 'charts-wrapper').style("position", "relative");
    chartsContainer = selector + ' .charts-wrapper';
    container = selector;
    return main;
  }

  return main;

}

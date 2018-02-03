// Imports
let d3 = require("d3");
var shared = require("../../shared/_init.js");

// Module declaration
module.exports = function () {
  "use strict";

  // Auxiliar Functions
  let components = {
    initialize: require('./initialize.js'),
    create: require('./create.js'),
    scale: require('./scale.js'),
    axis: require('./axis.js'),
    tooltip: require('./tooltip.js'),
    elements: require('./elements.js')
  };

  // Get attributes values
  let _id = `vis-predict-line-${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`;
  let _var = null;
  let action = 'build';
  let animation = 900;
  let container = null;
  var colors = { main: shared.helpers.colors.main, aux: shared.helpers.colors.aux };
  let data = [];
  let height = null;
  let margin = { top: 10, right: 10, bottom: 30, left: 40 };
  let width = 900;
  let urlLocation = '';  //filters, shadows
  let chartType = 'linear'  // can be : linear,curved
  let hasPoints = false;
  let hasTooltip = false;
  let showTotals = false;
  let legendTopPos = 3;
  let textColor = '#8D7799';

  // Validate attributes
  let validate = function (step) {
    switch (step) {
      case 'build': return (container != null) && (d3.selectAll(container).size() !== 0 || d3.select(container).size() !== 0);
      case 'initialize': return true;
      case 'create': return true;
      case 'scale': return true;
      case 'axis': return true;
      case 'elements': return true;
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

          main('initialize');
          main('create');
          main('scale');
          main('axis');
          main('elements');
          break;

        // Initialize visualization variable
        case 'initialize':

          // Initializing
          if (!_var) { _var = {}; }
          _var = components.initialize()
            ._var(_var)
            ._id((_var._id != null) ? _var._id : _id)
            .animation(animation)
            .chartType(chartType)
            .container(container)
            .colors(colors)
            .data(data)
            .height(height)
            .margin(margin)
            .width(width)
            .legendTopPos(legendTopPos)
            .textColor(textColor)
            .urlLocation(urlLocation)
            .run();

          break;

        // Create initial elements
        case 'create':

          // Creating wrappers
          _var = components.create()
            ._var(_var)
            .run();
          break;

        // Setup scale
        case 'scale':

          // Creating
          _var = components.scale()
            ._var(_var)
            .action('update-domain')
            .showTotals(showTotals)
            .run();
          break;

        // Setup axis elements
        case 'axis':

          // Running
          _var = components.axis()
            ._var(_var)
            .action('create')
            .chartType(chartType)
            .run();
          break;

        // Setup chart elements
        case 'elements':

          // Running
          _var = components.elements()
            ._var(_var)
            .components(components)
            .urlLocation(urlLocation)
            .hasPoints(hasPoints)
            .hasTooltip(hasTooltip)
            .legendTopPos(_var.legendTopPos)
            .textColor(_var.textColor)
            .chartType(chartType)
            .showTotals(showTotals)
            .run();
          break;

      }
    }

    return _var;
  };

  // Expose global variables
  ['_id', '_var', 'action', 'animation', 'container', 'colors', 'data', 'height', 'margin', 'width', 'urlLocation', 'chartType', 'hasPoints', 'hasTooltip','showTotals'].forEach(function (key) {

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

  // Secondary functions
  main.run = _ => main("build");

  return main;

}

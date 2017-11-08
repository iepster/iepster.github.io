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
    arcs: require('./arcs.js'),
    labels: require('./labels.js'),
    data: require('./data.js'),
    elements: require('./elements.js'),
    yearOYear: require('./year-o-year.js'),
    average: require('./average.js')
  };

  // Get attributes values
  let _id = `vis-donut-${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`;
  let _var = null;
  let action = 'build';
  let animation = 900;
  let container = null;
  var colors = { main: shared.helpers.colors.main, aux: shared.helpers.colors.aux };
  let data = {};
  let height = null;
  let margin = { top: 1, right: 1, bottom: 1, left: 1 };
  let width = null;
  let subdivisions = true;

  // Specifics
  let previousYear = true;
  let currentYear  = true;
  let yearOYear    = true;
  let avgReference = false;

  // Validate attributes
  let validate = function (step) {
    switch (step) {
      case 'build': return (container != null) && (d3.selectAll(container).size() !== 0 || d3.select(container).size() !== 0) ;
      case 'initialize': return data != null && data.values != null && data.values.length > 0;
      case 'create': return data != null && data.values != null && data.values.length > 0;
      case 'data': return data != null && data.values != null && data.values.length > 0;
      case 'elements': return data != null && data.values != null && data.values.length > 0;
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
          main('data');
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
            .container(container)
            .colors(colors)
            .data(data)
            .height(height)
            .margin(margin)
            .subdivisions(subdivisions)
            .width(width)
            .previousYear(previousYear)
            .currentYear(currentYear)
            .yearOYear(yearOYear)
            .avgReference(avgReference)
            .run();

          break;

        // Create initial elements
        case 'create':

          // Creating wrappers
          _var = components.create()
            ._var(_var)
            .run();
          break;

        // Setup data
        case 'data':

          // Creating
          _var = components.data()
            ._var(_var)
            .run();
          break;

        // Setup chart elements
        case 'elements':

          // Running
          _var = components.elements()
            ._var(_var)
            .components(components)
            .run();
          break;

      }
    }

    return _var;
  };

  // Expose global variables
  ['_id', '_var', 'action', 'animation', 'container', 'colors', 'data', 'height', 'margin','subdivisions', 'width','previousYear','currentYear','yearOYear','avgReference'].forEach(function (key) {

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

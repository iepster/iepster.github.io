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
    drag: require('./drag.js'),
    elements: require('./elements.js'),
    events: require('./events.js'),
    misc: require('./misc.js'),
    parse: require('./parse.js'),
    simulation: require('./simulation.js'),
    search: require('./search.js'),
    style: require('./style.js'),
    table: require('./table.js'),
    zoom: require('./zoom.js')
  };

  // Get attributes values
  let _id = `vis-ontology-viewer-${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`;
  let _var = null;
  let action = 'build';
  let animation = 900;
  let clicked = null;
  let container = null;
  var colors = { main: shared.helpers.colors.main, d3: d3.scaleOrdinal(d3.schemeCategory10) };
  let data = [];
  let margin = { top: 0, right: 0, bottom: 0, left: 0};

  // Validate attributes
  let validate = function (step) {
    switch (step) {
      case 'build':        return (container != null) && (d3.selectAll(container).size() !== 0 || d3.select(container).size() !== 0);
      case 'initialize':   return true;
      case 'create':       return data != null && data.data != null && data.data.nodes != null && data.data.nodes.length > 0;
      case 'drag':         return data != null && data.data != null && data.data.nodes != null && data.data.nodes.length > 0;
      case 'misc':         return true;
      case 'parse':        return data != null && data.data != null && data.data.nodes != null && data.data.nodes.length > 0;
      case 'elements':     return data != null && data.data != null && data.data.nodes != null && data.data.nodes.length > 0;
      case 'search':       return data != null && data.data != null && data.data.nodes != null && data.data.nodes.length > 0;
      case 'simulation':   return data != null && data.data != null && data.data.nodes != null && data.data.nodes.length > 0;
      case 'style':        return data != null && data.data != null && data.data.nodes != null && data.data.nodes.length > 0;
      case 'zoom':         return data != null && data.data != null && data.data.nodes != null && data.data.nodes.length > 0;
      case 'updateForces': return _var.simulation != null;
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
          main('style');
          main('parse');
          main('misc');
          main('create');
          main('drag');
          main('elements');
          main('simulation');
          main('zoom');
          main('search');
          main('updateForces');
          break;

        // Initialize visualization variable
        case 'initialize':

          // Initializing
          if (!_var) { _var = {};  }
          _var = components.initialize()
            ._var(_var)
            ._id((_var._id != null) ? _var._id : _id)
            .animation(animation)
            .clicked(clicked)
            .container(container)
            .colors(colors)
            .data(data)
            .margin(margin)
            .run();
          break;

        // Create initial elements
        case 'create':

          // Creating wrappers
          _var = components.create()
            ._var(_var)
            .run();
          break;

        // Drag fucntions
        case 'drag':

          // Initializing drag
          _var = components.drag()
            ._var(_var)
            .components(components)
            .run();
          break;

        // Parse data
        case 'parse':

          // Parsing elements from data
          _var = components.parse()
            ._var(_var)
            .run();
          break;

        // Style functions
        case 'style':

          // Initialize style functions
          _var = components.style()
            ._var(_var)
            .run();
          break;

        // Setup elements
        case 'elements':

          // Creating wrappers
          _var = components.elements()
            ._var(_var)
            .components(components)
            .run();
          break;

        // Setup simulation layout
        case 'simulation':

          // Setup simulation
          _var = components.simulation()
            ._var(_var)
            .run();
          break;

        // Set zoom
        case 'zoom':

          // Creating wrappers
          _var = components.zoom()
            ._var(_var)
            .run();
          break;

        // Show misc
        case 'misc':

          // Running
          _var = components.misc()
            ._var(_var)
            .components(components)
            .run();
          break;

        // Bind search
        case 'search':

          // Creating wrappers
          _var = components.search()
            ._var(_var)
            .components(components)
            .run();
          break;

        // Update
        case 'updateForces':

          // Update Forces
          _var.updateForces();

          break;

      }
    }

    return _var;
  };

  // Expose global variables
  ['_id', '_var', 'action', 'animation','clicked','container', 'colors', 'data', 'margin'].forEach(function (key) {

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
  main.updateForces = _ => main("updateForces");

  return main;

}

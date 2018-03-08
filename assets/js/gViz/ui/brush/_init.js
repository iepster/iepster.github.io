// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Module declaration
module.exports = function () {
  "use strict";

  // Auxiliar Functions
  var components = {
    initialize: require('./initialize.js'),
    brush: require('./brush.js'),
    brushAxis: require('./brush-axis.js'),
    brushScale: require('./brush-scale.js'),
    create: require('./create.js'),
    misc: require('./misc.js'),
    style: require('./style.js')
  };

  // Get attributes values
  var _id = `vis-brush-${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`;
  var _var = null;
  var action = 'build';
  var animation = 900;
  var container = null;
  var colors = { main: shared.helpers.colors.main };
  var data = [];
  var margin = { top: 0, right: 0, bottom: 0, left: 0 };

  // Event bindings
  var onSelect = function(d) { console.log(d); };

  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'build':      return (container != null) && (d3.selectAll(container).size() !== 0 || d3.select(container).size() !== 0);
      case 'initialize': return true;
      case 'brush':      return data != null && data.data != null && data.data.length > 0;
      case 'brushAxis':  return data != null && data.data != null && data.data.length > 0;
      case 'brushScale': return data != null && data.data != null && data.data.length > 0;
      case 'create':     return data != null && data.data != null && data.data.length > 0;
      case 'misc':       return true;
      case 'style':      return true;
      default:           return false;
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
          main('misc');
          main('brushScale');
          main('create');
          main('brushAxis');
          main('brush');
          break;

        // Initialize visualization variable
        case 'initialize':

          // Initializing
          if (!_var) { _var = {};  }
          _var = components.initialize()
            ._var(_var)
            ._id((_var._id != null) ? _var._id : _id)
            .animation(animation)
            .container(container)
            .colors(colors)
            .data(data)
            .margin(margin)
            .onSelect(onSelect)
            .run();

          break;

        // Setup style functions
        case 'style':

          // Styling
          _var = components.style()
            ._var(_var)
            .run();
          break;

        // Create initial elements
        case 'create':

          // Creating wrappers
          _var = components.create()
            ._var(_var)
            .run();
          break;

        // Setup brush
        case 'brush':

          // Running
          _var = components.brush()
            ._var(_var)
            .components(components)
            .run();
          break;

        // Setup brush scales
        case 'brushScale':

          // Running
          _var = components.brushScale()
            ._var(_var)
            .run();
          break;

        // Setup brush axis elements
        case 'brushAxis':

          // Running
          _var = components.brushAxis()
            ._var(_var)
            .components(components)
            .parent(main)
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

      }
    }

    return _var;
  };

  // Expose global variables
  ['_id', '_var', 'action', 'animation', 'container', 'colors', 'data', 'margin', 'onSelect'].forEach(function (key) {

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

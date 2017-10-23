// Imports
let d3 = require("d3");
var shared = require("../../shared/_init.js");

// Module declaration
module.exports = function () {
  "use strict";

  // Auxiliar Functions
  let components = {
    initialize: require('./initialize.js'),
    axis: require('./axis.js'),
    bars: require('./bars.js'),
    create: require('./create.js'),
    elements: require('./elements.js'),
    events: require('./events.js'),
    misc: require('./misc.js'),
    style: require('./style.js'),
    xLeftScale: require('./x-left-scale.js'),
    xRightScale: require('./x-right-scale.js'),
    yScale: require('./y-scale.js'),
    zoom: require('./zoom.js')
  };

  // Get attributes values
  let _id = `vis-pyramid-graph-${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`;
  let _var = null;
  let action = 'build';
  let animation = 900;
  let container = null;
  var colors = { main: shared.helpers.colors.main };
  let data = [];
  let margin = { top: 5, right: 0, bottom: 30, left: 70 };
  let hover = null;

  // Validate attributes
  let validate = function (step) {
    switch (step) {
      case 'build':       return (container != null) && (d3.selectAll(container).size() !== 0 || d3.select(container).size() !== 0);
      case 'initialize':  return true;
      case 'axis':        return data != null && data.data != null && data.data.length > 0;
      case 'create':      return data != null && data.data != null && data.data.length > 0;
      case 'elements':    return data != null && data.data != null && data.data.length > 0;
      case 'misc':        return true;
      case 'style':       return true;
      case 'xLeftScale':  return data != null && data.data != null && data.data.length > 0;
      case 'xRightScale': return data != null && data.data != null && data.data.length > 0;
      case 'yScale':      return data != null && data.data != null && data.data.length > 0;
      case 'zoom':        return data != null && data.data != null && data.data.length > 0;
      default:            return false;
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
          main('style');
          main('misc');
          main('yScale');
          main('xLeftScale');
          main('xRightScale');
          main('create');
          main('axis');
          main('elements');
          main('zoom');
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
            .hover(hover)
            .margin(margin)
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

        // Setup x left scale
        case 'xLeftScale':

          // Creating
          _var = components.xLeftScale()
            ._var(_var)
            .data(_var.data.data)
            .run();
          break;

        // Setup x right scale
        case 'xRightScale':

          // Creating
          _var = components.xRightScale()
            ._var(_var)
            .data(_var.data.data)
            .run();
          break;


        // Setup y scale
        case 'yScale':

          // Creating
          _var = components.yScale()
            ._var(_var)
            .data(_var.data.data)
            .run();
          break;

        // Setup axis elements
        case 'axis':

          // Running
          _var = components.axis()
            ._var(_var)
            .action('create')
            .run();
          break;

        // Setup chart elements
        case 'elements':

          // Running
          _var = components.elements()
            ._var(_var)
            .components(components)
            .data(_var.data.data)
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

      }
    }

    return _var;
  };

  // Expose global variables
  ['_id', '_var', 'action', 'animation', 'container', 'colors', 'data', 'margin', 'hover'].forEach(function (key) {

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

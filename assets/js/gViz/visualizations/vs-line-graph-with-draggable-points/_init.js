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
    create: require('./create.js'),
    drag: require('./drag.js'),
    elements: require('./elements.js'),
    events: require('./events.js'),
    misc: require('./misc.js'),
    style: require('./style.js'),
    xScale: require('./x-scale.js'),
    yScale: require('./y-scale.js')
  };

  // Get attributes values
  let _id = `vis-line-graph-${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`;
  let _var = null;
  let action = 'build';
  let animation = 900;
  let container = null;
  var colors = { main: shared.helpers.colors.main };
  let data = [];
  let margin = { top: 10, right: 10, bottom: 35, left: 0 };

  // Events bindings
  let onHover = function(d) { console.log(d); };
  let onClick = function(d) { console.log(d); };
  let onDragStart = function(d) { console.log(d); };
  let onDragEnd = function(d) { console.log(d); };

  // Validate attributes
  let validate = function (step) {
    switch (step) {
      case 'build':      return (container != null) && (d3.selectAll(container).size() !== 0 || d3.select(container).size() !== 0);
      case 'initialize': return true;
      case 'axis':       return data != null && data.data != null && data.data.length > 0;
      case 'create':     return data != null && data.data != null && data.data.length > 0;
      case 'drag':       return data != null && data.data != null && data.data.length > 0;
      case 'elements':   return data != null && data.data != null && data.data.length > 0;
      case 'misc':       return true;
      case 'style':      return true;
      case 'xScale':     return data != null && data.data != null && data.data.length > 0;
      case 'yScale':     return data != null && data.data != null && data.data.length > 0;
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
          main('drag');
          main('misc');
          main('yScale');
          main('xScale');
          main('create');
          main('axis');
          main('elements');
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
            .onHover(onHover)
            .onClick(onClick)
            .onDragStart(onDragStart)
            .onDragEnd(onDragEnd)
            .run();
          break;

        // Setup style functions
        case 'style':

          // Setting styles
          _var = components.style()
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

        // Create initial elements
        case 'create':

          // Creating wrappers
          _var = components.create()
            ._var(_var)
            .run();
          break;

        // Setup X scale
        case 'xScale':

          // Creating
          _var = components.xScale()
            ._var(_var)
            .data(_var.data.data)
            .run();
          break;

        // Setup Y scale
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

        // Setup elements
        case 'elements':

          // Running
          _var = components.elements()
            ._var(_var)
            .components(components)
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
  ['_id', '_var', 'action', 'animation', 'container', 'colors', 'data', 'margin','onHover','onClick','onDragStart','onDragEnd'].forEach(function (key) {

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

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
    axis: require('./axis.js'),
    brush: require('./brush.js'),
    elements: require('./elements.js'),
    events: require('./events.js'),
    misc: require('./misc.js'),
    tAxis: require('./t-axis.js'),
    tData: require('./t-data.js'),
    track: require('./track.js'),
    tScale: require('./t-scale.js'),
    values: require('./values.js'),
    xScale: require('./x-scale.js'),
    yScale: require('./y-scale.js'),
    zScale: require('./z-scale.js'),
    zoom: require('./zoom.js')
  };

  // Get attributes values
  let _id = `vis-plot-evolution-graph-${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`;
  let _var = null;
  let action = 'build';
  let animation = 900;
  let container = null;
  var colors = { main: shared.helpers.colors.main };
  let data = [];
  let margin = { top: 5, right: 2, bottom: 35, left: 0, tSize: 80, tOffset: 1, tLeft: 30 };

  // Validate attributes
  let validate = function (step) {
    switch (step) {
      case 'build':      return (container != null) && (d3.selectAll(container).size() !== 0 || d3.select(container).size() !== 0);
      case 'initialize': return true;
      case 'axis':       return data != null && data.data != null && data.data.length > 0;
      case 'brush':      return data != null && data.data != null && data.data.length > 0;
      case 'create':     return data != null && data.data != null && data.data.length > 0;
      case 'elements':   return data != null && data.data != null && data.data.length > 0;
      case 'misc':       return true;
      case 'reset':      return data != null && data.data != null && data.data.length > 0;
      case 'tAxis':      return data != null && data.data != null && data.data.length > 0;
      case 'tData':      return data != null && data.data != null && data.data.length > 0;
      case 'tScale':     return data != null && data.data != null && data.data.length > 0;
      case 'values':     return data != null && data.data != null && data.data.length > 0;
      case 'xScale':     return data != null && data.data != null && data.data.length > 0;
      case 'yScale':     return data != null && data.data != null && data.data.length > 0;
      case 'zScale':     return data != null && data.data != null && data.data.length > 0;
      case 'zoom':       return data != null && data.data != null && data.data.length > 0;
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
          main('misc');
          main('tData');
          main('tScale');
          main('yScale');
          main('xScale');
          main('zScale');
          main('create');
          main('tAxis');
          main('axis');
          main('brush');
          main('values');
          main('zoom');
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

        // Setup Z scale
        case 'zScale':

          // Creating
          _var = components.zScale()
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

        // Setup t axis data
        case 'tData':

          // Running
          _var = components.tData()
            ._var(_var)
            .run();
          break;

        // Setup t axis scales
        case 'tScale':

          // Running
          _var = components.tScale()
            ._var(_var)
            .run();
          break;

        // Setup t axis elements
        case 'tAxis':

          // Running
          _var = components.tAxis()
            ._var(_var)
            .components(components)
            .parent(main)
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

        // Setup values
        case 'values':

          // Draw elements
          _var = components.values()
            ._var(_var)
            .components(components)
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

        // Reset elements
        case 'reset':

          // Reset clicked node
          _var.clicked = null;

          // Remove track circles
          _var.gE.selectAll(".chart-track-elements").selectAll(".track-circle, .track-path").remove();

          // Reset t axis scales
          main('tScale')

          // Reset t axis
          main('tAxis')

          // Reset brush
          main('brush')

          // If the brush was created
          if(_var.brush != null) { _var.gT.select(".brush").call(_var.brush.move, [0, _var.tAxis.totalWidth]); }

          break;

        // Set zoom case
        case 'zoom':

          // Creating wrappers
          _var = components.zoom()
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
  ['_id', '_var', 'action', 'animation', 'container', 'colors', 'data', 'margin'].forEach(function (key) {

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

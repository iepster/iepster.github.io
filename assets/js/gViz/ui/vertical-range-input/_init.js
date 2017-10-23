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
    yScale: require('./y-scale.js')
  };

  // Get attributes values
  let _id = `ui-vertical-range-input-${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`;
  let _var = null;
  let action = 'build';
  let animation = 900;
  let container = null;
  let min = 0;
  let max = 100;
  let offset = 0;
  let onChange = function(d) { console.log("Change: " + d); };
  let onInput  = function(d) { console.log("Input: " + d); };
  let step = 1;
  let prefix = "";
  let suffix = "";
  let format = "";
  let value = 50;

  // Validate attributes
  let validate = function (step) {
    switch (step) {
      case 'build':      return (container != null) && (d3.selectAll(container).size() !== 0 || d3.select(container).size() !== 0);
      case 'initialize': return true;
      case 'axis':       return true;
      case 'create':     return true;
      case 'drag':       return true;
      case 'elements':   return true;
      case 'yScale':     return true;
      default:           return false;
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
          main('drag');
          main('yScale');
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
            .min(min)
            .max(max)
            .offset(offset)
            .onChange(onChange)
            .onInput(onInput)
            .step(step)
            .value(value)
            .prefix(prefix)
            .suffix(suffix)
            .format(format)
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
            .run();
          break;

        // Setup y scale
        case 'yScale':

          // Creating
          _var = components.yScale()
            ._var(_var)
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
            .run();
          break;

      }
    }

    return _var;
  };

  // Expose global variables
  ['_id', '_var', 'action', 'animation', 'container','min','max','onChange','onInput','step','value','prefix','suffix','format','offset'].forEach(function (key) {

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

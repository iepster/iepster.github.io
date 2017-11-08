// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Module declaration
module.exports = function () {
  "use strict";

  // Auxiliar Functions
  var components = {
    initialize: require('./initialize.js'),
    create: require('./create.js'),
    elements: require('./elements.js'),
    events: require('./events.js'),

  };

  // Get attributes values
  let _id = `double-entry-table-graph-${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`;

  //let _var = null;
  //let action = 'build';
  let animation = 900;
  let container = null;
  var colors = { main: shared.helpers.colors.main };
  let data = [];
  let height = 310;
  let margin = { top: 40, right: -50, bottom: 30, left: 100 };
  let width = null;
  var _var;
  var action = 'build';
  var handlers = {
    displayTooltip: null
  }

  // Validate attributes
  var validate = function (step) {

    switch (step) {
      case 'build': return (container != null) && (d3.selectAll(container).size() !== 0 || d3.select(container).size() !== 0);
      case 'initialize': return true;
      case 'create': return data != null;
      case 'elements': return data != null;
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
          console.log('done');
          break;

        case 'initialize':

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
            .width(width)
            .run();
          break;

        // Create initial elements
        case 'create':

          // Creating wrappers
          _var = components.create()
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

        case 'handlers':

          // Handling
          _var = components.handlers()
            ._var(_var)
            .handlers(handlers)
            .calc(_var.calc)
            .attrs(_var.attrs)
            .run();
          break;
      }
    }

    return _var;
  };

  // Expose some global variables
  ['data', 'container', 'height', 'width', 'urlLocation','_var'].forEach((key) => {

    // Attach variables to main function
    return main[key] = function (_) {
      var string = `${key} = _`;
      if (!arguments.length) { eval(`return ${key}`); }
      eval(string);
      return main;
    };
  });

  // Secondary functions
  main.run = _ => main("build");

  return main;

}

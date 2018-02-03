// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  let _id = `ui-vertical-range-input-${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`;
  let _var = null;
  let action = 'build';
  let animation = 900;
  let container = null;
  let min = 0;
  let max = 100;
  let onChange = function(d) { console.log("Change: " + d); };
  let onInput  = function(d) { console.log("Change: " + d); };
  let offset = 0;
  let step = 1;
  let prefix = "";
  let suffix = "";
  let format = "";
  let value = 50;

  // Validate attributes
  let validate = function (step) {
    switch (step) {
      case 'run': return true;
      default: return false;
    }
  };

  // Main function
  let main = function (step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'run':

          // Initialize variables
          if (!_var) { _var = {}; }
          _var._id = _id;
          _var.animation = animation;
          _var.min = min;
          _var.max = max;
          _var.offset = offset;
          _var.onChange = onChange;
          _var.onInput = onInput;
          _var.step = step;
          _var.prefix = prefix;
          _var.suffix = suffix;
          _var.format = format;
          _var.value = value;

           // Get container
          _var.container = {
            selector: container,
            d3: d3.select(container),
            el: ((typeof container === 'string' || container instanceof String) ? container : d3.select(container).node()),
            clientRect: d3.select(container).node().getBoundingClientRect()
          };

          // Define height and width
          _var.height = _var.container.clientRect.height - _var.offset;
          _var.width = _var.container.clientRect.width;

          // Set attribute _id to container and update container
          _var.container.d3.attr('data-vis-id', _var._id);

          break;
      }
    }

    return _var;
  };

  // Expose global variables
  ['_id', '_var', 'animation', 'container','min','max','onChange','onInput','offset','step','value','prefix','suffix','format'].forEach(function (key) {

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

  // Execute the specific called function
  main.run = _ => main('run');

  return main;
};

// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  let _id = null;
  let _var = null;
  let animation = 900;
  let container = null;
  var colors = { main: shared.helpers.colors.main, aux: shared.helpers.colors.aux };
  let data = [];
  let margin = { top: 10, right: 10, bottom: 10, left: 10 };

  // Events bindings
  let onHover = function(d) { console.log(d); };
  let onClick = function(d) { console.log(d); };

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
          _var.colors = colors;
          _var.margin = margin;
          _var.onHover = onHover;
          _var.onClick = onClick;

          // Id for shadows
          _var.shadowId = `vis-shadow-${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`

          // Set zoom transform
          if(_var.zoomTransform == null) { _var.zoomTransform = { k: 1, x: _var.margin.left, y: _var.margin.top }; }

           // Get container
          _var.container = {
            selector: container,
            d3: d3.select(container),
            el: ((typeof container === 'string' || container instanceof String) ? container : d3.select(container).node()),
            outerWrapper: d3.select(container).closest('.gViz-outer-wrapper'),
            outerWrapperClientRect: d3.select(container).closest('.gViz-outer-wrapper').node().getBoundingClientRect(),
            dimensions: {}
          };

          // Store data
          data.data = data.data.sort(function(a,b) { return d3.descending(Math.abs(+a.y), Math.abs(+b.y)); });
          _var.data = data;

          // Get bar width from the attrs
          _var.barWidth = _var.data.attrs != null && _var.data.attrs.barWidth != null && !isNaN(+_var.data.attrs.barWidth) ? +_var.data.attrs.barWidth : 10;

          // Show / Hide brush
          _var.margin.bottom = _var.data.attrs != null && _var.data.attrs.hasBrush != null && _var.data.attrs.hasBrush === false ? 5 : 60;

          break;
      }
    }

    return _var;
  };

  // Expose global variables
  ['_id', '_var', 'animation', 'container', 'colors', 'data', 'onClick', 'onHover', 'margin'].forEach(function (key) {

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

// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  let _id       = null;
  let _var      = null;
  let animation = 900;
  let container = null;
  var colors    = { main: shared.helpers.colors.main, aux: shared.helpers.colors.aux };
  let data      = [];
  let margin    = { top: 10, right: 10, bottom: 10, left: 10 };
  let metric     = 'x1';

  // Validate attributes
  let validate = function(step) {
    switch (step) {
      case 'run': return true;
      default: return false;
    }
  };

  // Main function
  let main = function(step) {

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
          _var.metric  = metric;

          // Id for shadows
          _var.shadowId = `vis-shadow-${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`

           // Get container
          _var.container = {
            selector: container,
            d3: d3.select(container),
            el: ((typeof container === 'string' || container instanceof String) ? container : d3.select(container).node()),
            outerWrapper: d3.select(container).closest('.gViz-outer-wrapper'),
            outerWrapperClientRect: d3.select(container).closest('.gViz-outer-wrapper').node().getBoundingClientRect(),
            dimensions: {}
          };

          // Map data and get labels
          _var.data = data;

          // Get formats
          _var.format = shared.helpers.number.parseFormat(_var.data == null ? null : _var.data[_var.metric]);

          // Get data attrs
          _var.arcOpacity = _var.data.attrs != null && _var.data.attrs.arcOpacity != null && !isNaN(+_var.data.attrs.arcOpacity) ? +_var.data.attrs.arcOpacity : 1;
          _var.muted = _var.data.attrs != null && _var.data.attrs.muted != null && _var.data.attrs.muted === true;
          _var.radius = _var.data.attrs == null || _var.data.attrs.radius == null || isNaN(+_var.data.attrs.radius) ? 30 : +_var.data.attrs.radius;

          // Initialize pie layout
          _var.pie = d3.pie()
            .sort(null)
            .value(function(d) { return d[_var.metric]; });

          break;
      }
    }

    return _var;
  };

  // Expose global variables
  ['_id','_var','animation','container','colors','data','margin','metric'].forEach(function(key) {

    // Attach variables to validation function
    validate[key] = function(_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return validate;
    };

    // Attach variables to main function
    return main[key] = function(_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return main;
    };
  });

  // Execute the specific called function
  main.run = _ => main('run');

  return main;
};

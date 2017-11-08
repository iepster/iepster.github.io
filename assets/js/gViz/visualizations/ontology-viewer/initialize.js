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
  let clicked   = null;
  let container = null;
  var colors    = { main: shared.helpers.colors.main, aux: shared.helpers.colors.aux };
  let data      = [];
  let margin    = { top: 10, right: 10, bottom: 10, left: 10 };

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
          if(clicked != null) { _var.clicked = clicked; }

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

          // Initialize search
          _var.search = { d3: _var.container.d3.closest('.gViz-outer-wrapper').select('.input-search'), value: '' };
          if(_var.searched == null) { _var.searched = {}; }

          // Map data and get labels
          _var.data = data;

          // Set zoom transform
          if(_var.zoomTransform == null) { _var.zoomTransform = { k: 1, x: _var.margin.left, y: _var.margin.right }; }

          // Initialize scales
          _var.linkScale = d3.scaleLinear().range([1, 2]);
          _var.nodeScale = d3.scaleLinear().range(_var.data.node.size != null ? _var.data.node.size : [5, 25]);
          _var.nodeTextScale = d3.scaleLinear().range([11, 11]);

          // Set format
          _var.nodeFormat = shared.helpers.number.parseFormat(_var.data == null ? null : _var.data.node);

          break;
      }
    }

    return _var;
  };

  // Expose global variables
  ['_id','_var','animation','clicked','container','colors','data','margin'].forEach(function(key) {

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

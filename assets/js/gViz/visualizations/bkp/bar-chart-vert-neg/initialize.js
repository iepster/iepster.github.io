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
  var colors = { main: shared.helpers.colors.main, aux: shared.helpers.colors.aux };
  let data      = [];
  let height    = null;
  let margin    = { top: 10, right: 10, bottom: 10, left: 10 };
  let width     = null;

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

          // Get container
          _var.container = {
            selector: container,
            d3: d3.select(container),
            el: ((typeof container === 'string' || container instanceof String) ? container : d3.select(container).node()),
            clientRect: d3.select(container).node().getBoundingClientRect()
          };

          // Map data and get labels
          _var.data = data;

          // Define height and width
          _var.height = ((height != null) ? height : _var.container.clientRect.height) - (_var.margin.top + _var.margin.bottom);
          _var.width = ((width != null) ? width : _var.container.clientRect.width) - (_var.margin.left + _var.margin.right);

          // Define bar width
          _var.barWidth = 10;

          // Set attribute _id to container
          _var.container.d3.attr('data-vis-id', _var._id);

          // NO DATA AVAILABLE
          if (_var.data.length === 0) {
            _var.container.d3.html("<h5 style='line-height: "+(_var.container.clientRect.height)+"px; text-align: center;'>NO DATA AVAILABLE</h5>");
          } else {
            _var.container.d3.selectAll("h5").remove();
          }

          // Get Y function
          _var.getY = function(d) {
            if(_var.yBounds[0] >= 0) { return _var.y(+d.y); }
            else if (_var.yBounds[1] < 0) { return _var.y(_var.yBounds[1]); }
            else { return +d.y >= 0 ? _var.y(+d.y) : _var.y(0); }
          }

          // Get Height function
          _var.getHeight = function(d) {
            if(_var.yBounds[0] >= 0) { return _var.height - _var.y(+d.y); }
            else if (_var.yBounds[1] < 0) { return _var.y(+d.y); }
            else { return +d.y >= 0 ? (_var.y(0) - _var.y(+d.y)) : (_var.y(+d.y) - _var.y(0)); }
          }

          break;
      }
    }

    return _var;
  };

  // Expose global variables
  ['_id','_var','animation','container','colors','data','height','margin','width'].forEach(function(key) {

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

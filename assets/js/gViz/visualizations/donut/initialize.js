// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  let _id       = undefined;
  let _var      = undefined;
  let animation = 900;
  let container = undefined;
  var colors = { main: shared.helpers.colors.main, aux: shared.helpers.colors.aux };
  let data      = [];
  let height    = undefined;
  let margin    = { top: 10, right: 10, bottom: 10, left: 10 };
  let width     = undefined;
  let subdivisions = true;

  // Specifics
  let previousYear = true;
  let currentYear  = true;
  let yearOYear    = true;
  let avgReference = true;

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
          _var.data = data;
          _var.margin = margin;
          _var.subdivisions = subdivisions;

          // Specifics
          _var.previousYear = previousYear;
          _var.currentYear  = currentYear ;
          _var.yearOYear    = yearOYear   ;
          _var.avgReference = avgReference;

          // Get container
          _var.container = { selector: container, d3: d3.select(container), el: (typeof container === 'string' || container instanceof String) ? container : d3.select(container).node() };

          // Define height and width
          var containerBounds = _var.container.d3.node().getBoundingClientRect();
          _var.height = ((height != null) ? height : containerBounds.height) - (_var.margin.top + _var.margin.bottom);
          _var.width = ((width != null) ? width : containerBounds.width) - (_var.margin.left + _var.margin.right);

          _var.height = Math.max(_var.height, 100);
          _var.width =  Math.max(_var.width, 100);

          // Set radius
          _var.radius = d3.min([_var.height, _var.width])/2;
          _var.radius = _var.radius < 50 ? 50 : _var.radius;

          // Initialize arc constructor
          _var.arc = d3.arc();

          // Initialize pie constructor
          _var.pie = d3.pie()
            .sort(null)
            .value(function(d) { return d.value; });

          // Set attribute _id to container
          _var.container.d3.attr('data-vis-id', _var._id);

          // NO DATA AVAILABLE
          if (_var.data.values.length === 0) {
            _var.container.d3.html("<h5 style='line-height: " + _var.container.d3.node().getBoundingClientRect().height + "px; text-align: center;'>NO DATA AVAILABLE</h5>");
          } else {
            _var.container.d3.selectAll("h5").remove();
          }

          break;
      }
    }

    return _var;
  };

  // Expose global variables
  ['_id','_var','animation','container','colors','data','height','margin','subdivisions','width','previousYear','currentYear','yearOYear','avgReference'].forEach(function(key) {

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

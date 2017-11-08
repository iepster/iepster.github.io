// Imports
var d3 = require("d3");
var shared = require("../../../shared/_init.js");

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
  let margin    = { top: 10, right: 2, bottom: 10, left: 2 };
  let width     = undefined;

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

          // Set margin
          _var.margin = margin;
          if(avgReference && _var.margin.top < 25) { _var.margin.top = 25; }

          // Get container
          _var.container = { selector: container, d3: d3.select(container), el: (typeof container === 'string' || container instanceof String) ?            container : d3.select(container).node() };

          // Specifics
          _var.previousYear = previousYear;
          _var.currentYear  = currentYear;
          _var.yearOYear    = yearOYear;
          _var.avgReference = avgReference;

          // Map data and get labels
          _var.data = data;
          _var.nodes = {}; _var.data.forEach(function(d) { _var.nodes[d.id] = d; d.children.forEach(function(c) { _var.nodes[c.id] = c;}); });
          _var.offset = 120;

          // Define height and width
          _var.height = ((height != null) ? height : _var.container.d3.node().getBoundingClientRect().height) - 4 - (_var.margin.top + _var.margin.bottom);
          _var.width = ((width != null) ? width : _var.container.d3.node().getBoundingClientRect().width) - 4 - (_var.margin.left + _var.margin.right);

          // Scales
          _var.axesSize = _var.height/_var.data.length;
          _var.xOut = d3.scaleBand().range([_var.height, 0]);
          _var.x = d3.scaleBand().paddingInner(0.1).paddingOuter(0.2);
          _var.xIn = d3.scaleBand().paddingInner(0.1);
          _var.y = d3.scaleLinear().range([0, _var.width-_var.offset]);

          // Axis
          _var.xAxis = d3.axisLeft(_var.x).tickPadding(10).tickSize(-_var.width+_var.offset);
          _var.yAxis = d3.axisBottom(_var.y).tickPadding(10).tickSize(-_var.axesSize);

          // Set attribute _id to container
          _var.container.d3.attr('data-vis-id', _var._id);

          // NO DATA AVAILABLE
          if (_var.data.length === 0) {
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
  ['_id','_var','animation','container','colors','data','height','margin','width','previousYear','currentYear','yearOYear','avgReference'].forEach(function(key) {

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

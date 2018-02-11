// Imports
var d3 = require("d3");
var shared = require("../../../shared/_init.js");

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
  let hovered   = null;
  let hover     = { selector: 'svg', fn: function fn(d) { if (d == null) { d = "Hovered"; } return console.log(d); } };
  let margin    = { top: 10, right: 10, bottom: 10, left: 10 };
  let width     = null;

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
          _var.margin = margin;
          _var.hover  = hover;
          _var.hovered  = hovered;

          // Get container
          _var.container = { selector: container, d3: d3.select(container), el: (typeof container === 'string' || container instanceof String) ?            container : d3.select(container).node() };

          // Specifics
          _var.previousYear = previousYear;
          _var.currentYear  = currentYear;
          _var.yearOYear    = yearOYear;
          _var.avgReference = avgReference;

          // Map data and get labels
          _var.data = data;
          _var.nodes = {}; _var.data.forEach(function(d) { _var.nodes[d.id] = d; });

          // Define height and width
          _var.height = ((height != null) ? height : _var.container.d3.node().getBoundingClientRect().height) - 4 - (_var.margin.top + _var.margin.bottom);
          _var.width = ((width != null) ? width : _var.container.d3.node().getBoundingClientRect().width) - 4 - (_var.margin.left + _var.margin.right);

          // Scales
          _var.x = d3.scaleBand().range([0, _var.width]).paddingInner(0.3).paddingOuter(0.15);
          _var.xIn = d3.scaleBand().paddingInner(0.1);
          _var.y = d3.scaleLinear().range([_var.height, 0]);

          // Axis
          _var.xAxis = d3.axisBottom(_var.x).tickPadding(10).tickSize(-_var.height);
          _var.yAxis = d3.axisLeft(_var.y).tickPadding(10).tickSize(-_var.width);

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
  ['_id','_var','animation','container','colors','data','height','hover','hovered','margin','width','previousYear','currentYear','yearOYear','avgReference'].forEach(function(key) {

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

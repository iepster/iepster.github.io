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
  let height = null;
  let margin = { top: 10, right: 10, bottom: 10, left: 10 };
  let metric = 'x1';
  let width = null;

  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run': {
        if (!data) {
          console.log('valdiation error - data')
        }
        return true;
      };
      default: return false;
    }
  };

  // Main function
  var main = function (step) {

    // Validate attributes if necessary
    if (validate(step)) {
      switch (step) {
        case 'run':

          // Initialize variables
          if (!_var) { _var = {}; }
          _var._id = _id;
          _var.animation = animation;
          _var.colors = colors;
          _var.margin = margin;

          // Id for shadows
          _var.shadowId = `vis-shadow-${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`

          // Get container
          _var.container = {
            selector: container,
            d3: d3.select(container),
            el: ((typeof container === 'string' || container instanceof String) ? container : d3.select(container).node()),
            clientRect: d3.select(container).node().getBoundingClientRect()
          };

          // Map data and get labels
          _var.data = _var._data = data;

          // Initialize tFormat
          var tFmt = _var.data != null && _var.data.t != null && _var.data.t.type === 'number' ? 'number' : 'date';
          //  _var.tFormat = shared.helpers[tFmt].parseFormat(_var.data == null ? null : _var.data.z);

          // Define height and width
          _var.height = ((height != null) ? height : _var.container.clientRect.height) - (_var.margin.top + _var.margin.bottom);
          _var.width = ((width != null) ? width : _var.container.clientRect.width) - (_var.margin.left + _var.margin.right);

          // Update height based on title and legend
          if(_var.data.title == null || _var.data.title === "") { _var.height += 35; }

          // Set attribute _id to container and update container
          _var.container.d3
            //.style('height', (_var.height + _var.margin.top + _var.margin.bottom) + 'px')
            .attr('data-vis-id', _var._id);

          // NO DATA AVAILABLE
          if (_var.data.data.nodes.length === 0 || _var.data.data.links.length == 0) {
            _var.container.d3.html("<h5 style='line-height: " + (_var.container.clientRect.height) + "px; text-align: center;'>NO DATA AVAILABLE</h5>");
          } else {
            _var.container.d3.selectAll("h5").remove();
          }
          break;
      }
    }

    return _var;
  };

  // Expose global variables
  ['_id', '_var', 'data', 'attrs', 'animation', 'container', 'colors', 'height', 'margin', 'width'].forEach(function (key) {

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





// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _id       = null;
  var _var      = null;
  var animation = 900;
  var container = null;
  var colors    = { main: shared.helpers.colors.main, aux: shared.helpers.colors.aux };
  var data      = [];
  var geoData   = [];
  var labelsData   = [];
  var height    = null;
  var margin    = { top: 10, right: 10, bottom: 10, left: 10 };
  var mode      = "bars";
  var width     = null;

  // Event bindings
  let onHover = function(d) { console.log(d); };
  let onHoverOut = function(d) { console.log(d); };
  let onClick = function(d) { console.log(d); };

  // Validate attributes
  var validate = function(step) {
    switch (step) {
      case 'run': return true;
      default: return false;
    }
  };

  // Main function
  var main = function(step) {

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
          _var.mode = mode;
          _var.onHover = onHover;
          _var.onHoverOut = onHoverOut;
          _var.onClick = onClick;

          // Id for shadows
          _var.shadowId = `vis-shadow-${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`

           // Get container
          _var.container = {
            selector: container,
            d3: d3.select(container),
            el: ((typeof container === 'string' || container instanceof String) ? container : d3.select(container).node()),
            clientRect: d3.select(container).node().getBoundingClientRect()
          };

          // Get data
          _var.data = data == null ? {} : data;
          _var.geoData = geoData;
          _var.labelsData = labelsData;
          _var.hasLabels = !(data != null && data.attrs != null && data.attrs.labels != null && data.attrs.labels === false);

          // Set zoom transform
          if(_var.zoomTransform == null) { _var.zoomTransform = { k: 1, x: _var.margin.left, y: _var.margin.right }; }

          // Define height and width
          var scale = _var.data != null && _var.data.attrs != null && _var.data.attrs.scale != null ? _var.data.attrs.scale : 1;
          _var.height = ((height != null) ? height : _var.container.clientRect.height)/scale;
          _var.width = ((width != null) ? width : _var.container.clientRect.width)/scale;

          // Update height and width on borders
          _var.height = _var.height - (_var.margin.top + _var.margin.bottom);
          _var.width = _var.width - (_var.margin.left + _var.margin.right);

          // Update height based on title and legend
          if(_var.data.title != null && _var.data.title !== "") { _var.height -= 35; }
          if(_var.data.legend == null || _var.data.legend.isVisible == null || _var.data.legend.isVisible === true) { _var.height -= 30; }

          // Set attribute _id to container
          _var.container.d3.attr('data-vis-id', _var._id);

          // NO DATA AVAILABLE
          if (_var.data.length === 0) {
            _var.container.d3.html("<h5 style='line-height: "+(_var.container.clientRect.height)+"px; text-align: center;'>NO DATA AVAILABLE</h5>");
          } else { _var.container.d3.selectAll("h5").remove(); }

          break;
      }
    }

    return _var;
  };

  // Expose global variables
  ['_id','_var','animation','container','colors','data','geoData','labelsData','height','margin','mode','onClick','onHover','onHoverOut','width'].forEach(function(key) {

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

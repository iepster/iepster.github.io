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
  let click     = { selector: 'svg', fn: function fn(d) { if (d == null) { d = "Clicked"; } return console.log(d); } };
  let hovered   = null;
  let hover     = { selector: 'svg', fn: function fn(d) { if (d == null) { d = "Hovered"; } return console.log(d); } };
  let container = null;
  let colors    = { scale: shared.helpers.colors.heat };
  let data      = [];
  let height    = null;
  let margin    = { top: 10, right: 10, bottom: 10, left: 10 };
  let mainValue = false;
  let scale     = 1;
  let sumLevel  = null;
  let width     = null;
  let zHeight   = null;
  let zWidth    = null;
  let zWidthPercent = null;
  let zoomNode  = null;

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
          _var.click = click;
          _var.hovered = hovered;
          _var.hover = hover;
          _var.colors = colors;
          _var.margin = margin;
          _var.sumLevel = sumLevel;
          _var.scale = scale;
          _var.translate = [_var.margin.left, _var.margin.top];
          _var.zoomLevel = -1;
          _var.mainValue = mainValue;
          _var.zoomNode = zoomNode;
          _var.zWidthPercent = zWidthPercent;

          // Get data
          _var.data = data.data;

          // Get data attributes
          _var.dataAttrs = {};
          Object.keys(data).forEach(function(k) { if(k !== 'data') { _var.dataAttrs[k] = data[k]; } });

          // Get container
          _var.container = {
            selector: container, d3: d3.select(container),
            el: (typeof container === 'string' || container instanceof String) ? container : d3.select(container).node()
          };

          // Get attrs
          _var.attrs = {
            maxDepth: 0,
            size: { w: 20, h: 20 },
            offset: { x: 10, y: 10 },
            satelites: { s: 16 },
            depths: {},
            _uniques: {},
            diagonals: {}
          };

          // Define height and width
          _var.height = ((height != null) ? height : _var.container.d3.node().getBoundingClientRect().height) - (_var.margin.top + _var.margin.bottom);
          _var.width = ((width != null) ? width : _var.container.d3.node().getBoundingClientRect().width) - (_var.margin.left + _var.margin.right);

          // Update height and width for min
          _var._height = _var.height = _var.height < 414 ? 414 : _var.height;
          _var._width = _var.width = _var.width < 600 ? 600 : _var.width;

          // Define zoom height and zoom width
          _var.zHeight = zHeight != null ? zHeight : _var.height;
          _var.zWidth = zWidth != null ? zWidth : _var.width * _var.zWidthPercent;

          // Set attribute _id to container
          _var.container.d3.attr('data-vis-id', _var._id);

          // // Update most outer
          // _var.container.d3.closest(".watch-view").each(function() {
          //   var parentHeight = this.getBoundingClientRect().height;
          //   var calcHeight = _var.height + _var.margin.top + _var.margin.bottom;
          //   d3.select(this).style('min-height', (parentHeight > calcHeight ? parentHeight : calcHeight) + "px");
          // });

          break;
      }
    }

    return _var;
  };

  // Expose global variables
  ['_id','_var','animation','click','hover','hovered','colors','container','data','height','margin','mainValue','scale','width','sumLevel','zHeight','zWidth','zWidthPercent','zoomNode'].forEach(function(key) {

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

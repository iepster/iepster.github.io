// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Module declaration
module.exports = function () {
  "use strict";

  // Auxiliar Functions
  var components = {
    initialize: require('./initialize.js'),
    barScale: require('./bar-scale.js'),
    create: require('./create.js'),
    drag: require('./drag.js'),
    elements: require('./elements.js'),
    events: require('./events.js'),
    heatScale: require('./heat-scale.js'),
    legend: require('./legend.js'),
    style: require('./style.js'),
    zoom: require('./zoom.js')
  };

  // Get attributes values
  var _id       = `vis-map-heat-bars-${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`;
  var _var      = null;
  var action    = 'build';
  var animation = 900;
  var container = null;
  var colors    = { main: shared.helpers.colors.main, d3: d3.scaleOrdinal(d3.schemeCategory10) };
  var data      = [];
  var geoData   = {};
  var labelsData   = {};
  var height    = null;
  var margin    = { top: 0, right: 10, bottom: 0, left: 10};
  var mode      = "bars";
  var width     = null;

  // Event bindings
  let onHover = function(d) { console.log(d); };
  let onHoverOut = function(d) { console.log(d); };
  let onClick = function(d) { console.log(d); };
  let onDragStart = function(d) { console.log(d); };
  let onDragEnd = function(d) { console.log(d); };

  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'build':      return (container != null) && (d3.selectAll(container).size() !== 0 || d3.select(container).size() !== 0);
      case 'initialize': return true;
      case 'barScale':   return data != null && data.data != null;
      case 'create':     return data != null && data.data != null;
      case 'drag':       return data != null && data.data != null;
      case 'elements':   return data != null && data.data != null;
      case 'heatScale':  return data != null && data.data != null;
      case 'legend':     return data != null && data.data != null;
      case 'style':      return true;
      case 'zoom':       return data != null && data.data != null;
      default: return false;
    }
  };

  // Main function
  var main = function (step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'build':

          main('initialize');
          main('style');
          main('drag');
          main('barScale');
          main('heatScale');
          main('create');
          main('elements');
          main('zoom');
          main('legend');
          break;

        // Initialize visualization variable
        case 'initialize':

          // Initializing
          if (!_var) { _var = {};  }
          _var = components.initialize()
            ._var(_var)
            ._id((_var._id != null) ? _var._id : _id)
            .animation(animation)
            .container(container)
            .colors(colors)
            .data(data)
            .geoData(geoData)
            .labelsData(labelsData)
            .height(height)
            .margin(margin)
            .mode(mode)
            .onHover(onHover)
            .onHoverOut(onHoverOut)
            .onClick(onClick)
            .onDragStart(onDragStart)
            .onDragEnd(onDragEnd)
            .width(width)
            .run();
          break;

        // Set bar scale
        case 'barScale':

          // Set bar scale
          _var = components.barScale()
            ._var(_var)
            .data(_var.data.data == null || _var.data.data.bars == null ? [] : _var.data.data.bars)
            .run();
          break;

        // Drag fucntions
        case 'drag':

          // Initializing drag
          _var = components.drag()
            ._var(_var)
            .components(components)
            .run();
          break;

        // Create initial elements
        case 'create':

          // Creating wrappers
          _var = components.create()
            ._var(_var)
            .run();
          break;

        // Setup elements
        case 'elements':

          // Creating wrappers
          _var = components.elements()
            ._var(_var)
            .components(components)
            .run();
          break;

        // Set heat scale
        case 'heatScale':

          // Set heat scale
          _var = components.heatScale()
            ._var(_var)
            .data(_var.data.data == null || _var.data.data.heat == null ? [] : _var.data.data.heat)
            .run();
          break;

        // Set style
        case 'style':

          // Set styling functions
          _var = components.style()
            ._var(_var)
            .run();
          break;

        // Set zoom
        case 'zoom':

          // Creating wrappers
          _var = components.zoom()
            ._var(_var)
            .run();
          break;

        // Show legend
        case 'legend':

          // Running
          _var = components.legend()
            ._var(_var)
            .components(components)
            .run();
          break;

      }
    }

    return _var;
  };

  // Expose global variables
  ['_id', '_var', 'action', 'animation','container', 'colors', 'data', 'geoData', 'labelsData', 'height', 'margin','mode','onClick','onHover','onHoverOut','width','onDragStart','onDragEnd'].forEach(function (key) {

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

  // Secondary functions
  main.run = _ => main("build");

  return main;

}

// Imports
let d3 = require("d3");
var shared = require("../../shared/_init.js");

// Module declaration
module.exports = function () {
  "use strict";

  // Auxiliar Functions
  let components = {
    initialize: require('./initialize.js'),
    breadcrumbs: require('./breadcrumbs.js'),
    create: require('./create.js'),
    helpers: require('./helpers.js'),
    gradients: require('./gradients.js'),
    backgrounds: require('./backgrounds.js'),
    zoom: require('./zoom.js'),
    links: require('./links.js'),
    nodes: require('./nodes.js'),
    satelites: require('./satelites.js'),
    setup: require('./setup.js'),
    events: require('./events.js'),
    hover: require('./hover.js')
  };

  // Get attributes values
  let _id       = `vis-dendrogram-${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`;
  let _var      = null;
  let action    = 'build';
  let animation = 900;
  let click     = { selector: 'svg', fn: function fn(d) { if (d == null) { d = "Clicked"; } return console.log(d); } };
  let hovered   = null;
  let hover     = { selector: 'svg', fn: function fn(d) { if (d == null) { d = "Hovered"; } return console.log(d); } };
  let colors    = { scale: shared.helpers.colors.heat };
  let container = null;
  let data      = [];
  let height    = null;
  let margin    = { top: 40, right: 10, bottom: 40, left: 10 };
  let mainValue = false;
  let scale     = 1;
  let sumLevel  = null;
  let width     = null;
  let zHeight   = null;
  let zWidth    = null;
  let zoomNode  = null;

  // Validate attributes
  let validate = function(step) {
    switch (step) {
      case 'build': return (container != null) && (d3.selectAll(container).size() !== 0 || d3.select(container).size() !== 0) ;
      case 'initialize':  return true;
      case 'create':      return true;
      case 'helpers':     return true;
      case 'setup':       return true;
      case 'hover':       return true;
      default: return false;
    }
  };

  // Main function
  let main = function(step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'build':

          main('initialize');
          main('create');
          main('helpers');
          main('create');
          main('setup');
          break;

        // Initialize visualization variable
        case 'initialize':

          // Initializing
          if (!_var) { _var = {}; }
          _var = components.initialize()
            ._var(_var)
            ._id((_var._id != null) ? _var._id : _id)
            .animation(animation)
            .click(click)
            .colors(colors)
            .container(container)
            .data(data)
            .height(height)
            .hover(hover)
            .hovered(hovered)
            .margin(margin)
            .mainValue(mainValue)
            .scale(scale)
            .sumLevel(sumLevel)
            .width(width)
            .zHeight(zHeight)
            .zWidth(zWidth)
            .zoomNode(zoomNode)
            .run();

          break;

        // Initialize helpers functions
        case 'helpers':

          // Initialize helpers functions
          _var = components.helpers()
            ._var(_var)
            .components(components)
            .parent(main)
            .run();
          break;

        // Create initial elements
        case 'create':

          // Creating
          _var = components.create()
            ._var(_var)
            .run();
          break;

        // Setup elements
        case 'setup':

          // Initialize
          _var = components.setup()
            ._var(_var)
            .components(components)
            .parent(main)
            .action('init')
            .run();

          // Update
          _var = components.setup()
            ._var(_var)
            .components(components)
            .parent(main)
            .action('update')
            .source(_var.root)
            .run();

          break;

        // Show element hovered
        case 'hover':

          // Initialize variables
          main('initialize');

          // Set width and zoom width
          _var.width = _var._width = _var._width / 0.55;
          _var.zWidth = _var.width * 0.55;

          // Running
          _var = components.hover()
            ._var(_var)
            .components(components)
            .run();

          break;

      }
    }

    return _var;
  };

  // Expose global variables
  ['_id','_var','action','animation','click','hover','hovered','container','colors','data','height','margin','mainValue','zoomNode','scale','width','sumLevel','zHeight','zWidth'].forEach(function(key) {

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

  // Secondary functions
  main.run   = _ => main(_);

  return main;

}

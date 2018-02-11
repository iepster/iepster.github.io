// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;

  // Validate attributes
  var validate = function (step) {

    switch (step) {
      case 'run': return true;
      default: return false;
    }
  };

  // Main function
  var main = function (step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'run':

          // Update brush scale width based on the new calculated width from y scale size
          _var.brushAttrs.width = _var.width;

          // Initialize root nodes for brush data
          _var.brushAttrs.root = { id: "Root Node", children: [] };

          // Map brush bins into root children to draw hierarchy
          _var.brushAttrs.root.children = _var.data.data;

          // Set hierarchy layout for root and labels
          _var.brushAttrs.hRoot = d3.hierarchy(_var.brushAttrs.root).sum(function(d) { return d.children == null || d.children.length === 0 ? 1 : 0; });

          // Initialize partition layout
          var partition = d3.partition()
              .size([ _var.brushAttrs.width , _var.brushAttrs.totalHeight ])
              .padding(1);

          // Partition on root nodes
          partition(_var.brushAttrs.hRoot);

          // Initialize max depth and labels
          _var.brushAttrs.maxDepth = 0;

          // Iterate over descendants
          _var.brushAttrs.hRoot.descendants().forEach(function(d, i) {

            // Get tAxis Height
            if(i === 0) { _var.brushAttrs.height = Math.abs(d.y1 - d.y0); }

            // Update max depth
            if(_var.brushAttrs.maxDepth < d.depth+1) { _var.brushAttrs.maxDepth = d.depth+1; }

          });

          // Initialize scale
          _var.brushAttrs.scale = d3.scaleLinear().domain([0, _var.brushAttrs.width]).range([0, _var.brushAttrs.width]);

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var'].forEach(function (key) {

    // Attach variables to validation function
    validate[key] = function (_) {
      if (!arguments.length) {
        eval('return ' + key);
      }
      eval(key + ' = _');
      return validate;
    };

    // Attach variables to main function
    return main[key] = function (_) {
      if (!arguments.length) {
        eval('return ' + key);
      }
      eval(key + ' = _');
      return main;
    };
  });

  // Executa a funcao chamando o parametro de step
  main.run = function (_) {
    return main('run');
  };

  return main;
};

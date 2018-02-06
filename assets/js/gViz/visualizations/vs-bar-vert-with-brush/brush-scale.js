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

          // Get brush bins based on number of elements on data array
          _var.brushAttrs.bins = [[0,10],[10,20],[20,50],[50,100],[100,250],[250,500],[500,1000],[1000, _var.data.data.length]].filter(function(a) { return a[0] < _var.data.data.length; });
          _var.brushAttrs.bins[_var.brushAttrs.bins.length-1][1] = _var.data.data.length;

          // Map brush bins into root children to draw hierarchy
          _var.brushAttrs.root.children = _var.brushAttrs.bins.map(function(d, i) {
            return {
              id: 'bin-' + i,
              type: 'bin',
              label: '',
              name: 'Top ' + (d[0]+1) + ' - ' + d[1],
              values: [d[0],d[1]],
              v: Math.log(d3.min([(d[1] - d[0]), 1000]))
            };
          });

          // Set hierarchy layout for root and labels
          _var.brushAttrs.hRoot = d3.hierarchy(_var.brushAttrs.root).sum(function(d) { return +d.v; });

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

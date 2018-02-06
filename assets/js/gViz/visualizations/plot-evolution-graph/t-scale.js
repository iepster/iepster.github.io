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

          // Set hierarchy layout for root and labels
          _var.hRoot = d3.hierarchy(_var.root).sum(function(d) { return +d.v; });

          // Get total width
          _var.tAxis.totalWidth = _var.width + _var.margin.left + _var.margin.right - 2*_var.margin.tOffset - _var.margin.tLeft;
          _var.tAxis.totalHeight = _var.margin.tSize; //(_var.margin.tSize / (_var.tAxis.maxDepth-1) * _var.tAxis.maxDepth) - _var.tAxis.height;

          // Initialize partition layout
          var partition = d3.partition()
              .size([ _var.tAxis.totalWidth , _var.tAxis.totalHeight ])
              .padding(1);

          // Partition on root nodes
          partition(_var.hRoot);

          // Initialize max depth and labels
          _var.tAxis.maxDepth = 0;
          _var.tAxis.labels = {};

          // Iterate over descendants
          _var.hRoot.descendants().forEach(function(d, i) {

            // Get tAxis Height
            if(i === 0) { _var.tAxis.height = Math.abs(d.y1 - d.y0); }

            // Update max depth
            if(_var.tAxis.maxDepth < d.depth+1) { _var.tAxis.maxDepth = d.depth+1; }

            // Update labels
            _var.tAxis.labels[d.data.label] = {
              y: (_var.margin.tSize + _var.tAxis.height - d.y1 + (d.y1 - d.y0)/2 + 4),
              id: d.data.label,
              value: d.data.label
            };

          });

          // Set reset
          _var.tAxis.labels['resetPlotBtn'] = { y: _var.tAxis.height/2 + 6, id: 'resetPlotBtn', value: 'R' };

          // Initialize scale
          _var.tAxis.scale = d3.scaleLinear().domain([0, _var.tAxis.totalWidth]).range([0, _var.tAxis.totalWidth]);

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

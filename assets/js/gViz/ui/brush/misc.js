// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var       = undefined;
  var action     = "start";
  var components = {};

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

          switch (action) {

            // First action to be done
            case 'start':

              // Update container _id, height and client bound rect
              _var.container.d3
                .attr('data-vis-id', _var._id)
                .style('height', (_var.container.outerWrapperClientRect.height) + "px")
                .style('top', '0px')

              // Define height and width
              var containerClientRect = _var.container.d3.node().getBoundingClientRect();
              _var.height = containerClientRect.height - (_var.margin.top + _var.margin.bottom);
              _var.width = containerClientRect.width - (_var.margin.left + _var.margin.right);

              // Initialize brush attributes object
              _var.brushAttrs = {
                width: _var.width,
                totalHeight: _var.height
              };

              // NO DATA AVAILABLE
              if (_var.data.data == null || _var.data.data.length === 0 || _var.data.style == null) {
                _var.container.d3.html("<h5 style='line-height: "+(containerClientRect.height)+"px; text-align: center;'>NO DATA AVAILABLE</h5>");
              } else {
                _var.container.d3.selectAll("h5").remove();
              }

              break;

            // Last action to be done
            case 'end':

              break;
          }
          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','action','components'].forEach(function(key) {

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

  // Executa a funcao chamando o parametro de step
  main.run = _ => main('run');

  return main;
};

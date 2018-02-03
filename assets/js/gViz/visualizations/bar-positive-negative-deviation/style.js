// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var      = undefined;
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

          // Get color function
          _var.getColor = function(d, attr="fill") {
            if(d == null) { return attr === 'stroke' ? "#333" : "#999"; }
            else if(+d.y >= 0 && d[attr] != null) { return d[attr]; }
            else if(+d.y >= 0 && d[attr+"-neg"] != null) { return d[attr+"-neg"]; }
            else if(+d.y < 0  && d[attr+"-neg"] != null) { return d[attr+"-neg"]; }
            else if(+d.y < 0  && d[attr] != null) { return d[attr]; }
            else { return attr === 'stroke' ? "#333" : "#999"; }
          }

          // Get Y function
          _var.getY = function(d) {
            if(_var.yBounds[0] >= 0) { return _var.y(+d.y); }
            else if (_var.yBounds[1] < 0) { return _var.y(_var.yBounds[1]); }
            else { return +d.y >= 0 ? _var.y(+d.y) : _var.y(0); }
          }

          // Get Y function
          _var.getStrokeY = function(d) {
            if(_var.yBounds[0] >= 0) { return _var.y(+d.y); }
            else if (_var.yBounds[1] < 0) { return _var.y(_var.yBounds[1]); }
            else { return _var.y(+d.y); }
          }

          // Get Height function
          _var.getHeight = function(d) {
            if(_var.yBounds[0] >= 0) { return _var.height - _var.y(+d.y); }
            else if (_var.yBounds[1] < 0) { return _var.y(+d.y); }
            else { return +d.y >= 0 ? (_var.y(0) - _var.y(+d.y)) : (_var.y(+d.y) - _var.y(0)); }
          }

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','components'].forEach(function(key) {

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

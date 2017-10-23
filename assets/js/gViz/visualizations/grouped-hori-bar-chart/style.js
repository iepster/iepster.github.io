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

          // Is wrapper function
          _var.hasWrapper = function(wrap) {
            return ['sum','median','mean','max','min'].indexOf(wrap) !== -1 || (wrap != null && !isNaN(+wrap));
          }

          // Is wrapper function
          _var.wrapperType = function(wrap) {
            if(['sum','median','mean','max','min'].indexOf(wrap) !== -1) { return 'metric'; }
            else { return 'number'; };
          }

          // Get color function
          _var.getColor = function(d, attr="fill") {
            if(_var.data.colors[d.y] == null) { return attr === 'stroke' ? "#333" : "#999"; }
            else if(+d.x >= 0 && _var.data.colors[d.y][attr] != null) { return _var.data.colors[d.y][attr]; }
            else if(+d.x >= 0 && _var.data.colors[d.y][attr+"-neg"] != null) { return _var.data.colors[d.y][attr+"-neg"]; }
            else if(+d.x < 0  && _var.data.colors[d.y][attr+"-neg"] != null) { return _var.data.colors[d.y][attr+"-neg"]; }
            else if(+d.x < 0  && _var.data.colors[d.y][attr] != null) { return _var.data.colors[d.y][attr]; }
            else { return attr === 'stroke' ? "#333" : "#999"; }
          }

          // Get X function
          _var.getX = function(d) {
            if(_var.xBounds[0] >= 0) { return 0; }
            else if (_var.xBounds[1] < 0) { return _var.x(+d.x); }
            else { return +d.x >= 0 ? _var.x(0) : _var.x(+d.x); }
          }

          // Get Width function
          _var.getWidth = function(d) {
            if(_var.xBounds[0] >= 0) { return _var.x(+d.x); }
            else if (_var.xBounds[1] < 0) { return _var.width - _var.x(+d.x); }
            else { return +d.x >= 0 ? (_var.x(+d.x) - _var.x(0)) : (_var.x(0) - _var.x(+d.x)); }
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

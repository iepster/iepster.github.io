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
            if(_var.data.colors[d.id] == null) { return attr === 'stroke' ? "#333" : "#999"; }
            else if(+d.x >= 0 && _var.data.colors[d.id][attr] != null) { return _var.data.colors[d.id][attr]; }
            else if(+d.x >= 0 && _var.data.colors[d.id][attr+"-neg"] != null) { return _var.data.colors[d.id][attr+"-neg"]; }
            else if(+d.x < 0  && _var.data.colors[d.id][attr+"-neg"] != null) { return _var.data.colors[d.id][attr+"-neg"]; }
            else if(+d.x < 0  && _var.data.colors[d.id][attr] != null) { return _var.data.colors[d.id][attr]; }
            else { return attr === 'stroke' ? "#333" : "#999"; }
          }

          // Get X Left function
          _var.getXLeft = function(d) {
            if(_var.xLeftBounds[0] >= 0) { return _var.xLeft(+d.xLeft.x); }
            else if (_var.xLeftBounds[1] <= 0) { return 0; }
            else { return +d.xLeft.x <= 0 ? _var.xLeft(0) : _var.xLeft(+d.xLeft.x); }
          }

          // Get Width Left function
          _var.getWidthLeft = function(d) {
            if(_var.xLeftBounds[0] >= 0) { return _var.width/2 - _var.xLeft(+d.xLeft.x); }
            else if (_var.xLeftBounds[1] <= 0) { return _var.xLeft(+d.xLeft.x); }
            else { return +d.xLeft.x <= 0 ? (_var.xLeft(+d.xLeft.x) - _var.xLeft(0)) : (_var.xLeft(0) - _var.xLeft(+d.xLeft.x)); }
          }

          // Get X Right function
          _var.getXRight = function(d) {
            if(_var.xRightBounds[0] >= 0) { return 0; }
            else if (_var.xRightBounds[1] < 0) { return _var.xRight(+d.xRight.x); }
            else { return +d.xRight.x >= 0 ? _var.xRight(0) : _var.xRight(+d.xRight.x); }
          }

          // Get Width Right function
          _var.getWidthRight = function(d) {
            if(_var.xRightBounds[0] >= 0) { return _var.xRight(+d.xRight.x); }
            else if (_var.xRightBounds[1] < 0) { return _var.width/2 - _var.xRight(+d.xRight.x); }
            else { return +d.xRight.x >= 0 ? (_var.xRight(+d.xRight.x) - _var.xRight(0)) : (_var.xRight(0) - _var.xRight(+d.xRight.x)); }
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

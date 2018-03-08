// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var animation = 900;

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

          // Get Y function
          _var.getY = function(y) {
            if(_var.yLeftBounds[0] >= 0) { return _var.yLeft(+y); }
            else if (_var.yLeftBounds[1] < 0) { return _var.yLeft(_var.yLeftBounds[1]); }
            else { return +y >= 0 ? _var.yLeft(+y) : _var.yLeft(0); }
          }

          // Get Y function
          _var.getYRight = function(y) {
            if(_var.yRightBounds[0] >= 0) { return _var.yRight(+y); }
            else if (_var.yRightBounds[1] < 0) { return _var.yRight(_var.yRightBounds[1]); }
            else { return +y >= 0 ? _var.yRight(+y) : _var.yRight(0); }
          }

          // Get Height function
          _var.getHeight = function(y) {
            if(_var.yLeftBounds[0] >= 0) { return _var.height - _var.yLeft(+y); }
            else if (_var.yLeftBounds[1] < 0) { return _var.yLeft(+y); }
            else { return +y >= 0 ? (_var.yLeft(0) - _var.yLeft(+y)) : (_var.yLeft(+y) - _var.yLeft(0)); }
          }

          // Set line width
          _var.lineWidth = function(d) {
            return _var.data != null && _var.data.attrs != null && _var.data.attrs.strokeWidth != null && !isNaN(_var.data.attrs.strokeWidth) ? _var.data.attrs.strokeWidth + "px" : "3px";
          }

          // Set line color
          _var.lineColor = function(d) {
            return _var.data != null && _var.data.attrs != null && _var.data.attrs.lineColor != null ? _var.data.attrs.lineColor : "#666";
          }

          // Set stroke style function
          _var.lineStyle = function(d) {
            var style = _var.data != null && _var.data.attrs != null && _var.data.attrs.lineStyle != null ? _var.data.attrs.lineStyle : "solid";
            if(style === "dotted") { return "2,2"; }
            else if(style === "dashed") { return "7,3"; }
            else { return "0,0"; }
          }

          // Set point color
          _var.pointColor = function(d) {
            return _var.data != null && _var.data.attrs != null && _var.data.attrs.pointColor != null ? _var.data.attrs.pointColor : "#666";
          }

          // Set shape path for node
          _var.pointPath = function(d) {

            // Get radius
            var r  = 4;
            var dr = r*2;
            var x  = _var.x(d.x) + _var.x.bandwidth()/2 + _var.zoomTransform.x;
            var y  = _var.yRight(+d.yLine);
            var shape = _var.data != null && _var.data.attrs != null && _var.data.attrs.pointShape != null ? _var.data.attrs.pointShape : "circle";

            // For each shape style
            switch(shape) {

              // Set rect shape
              case "rect":
                return "M " + ((x != null ? x : 0) - r) + " " + ((y != null ? y : 0) - r) + " " +
                       "l " + dr + ", 0 " +
                       "l 0 , " + dr + " " +
                       "l " + (-dr) + ", 0 " + "Z";
                break;

              // Set diamond shape
              case 'diamond':
                return "M " + (x != null ? x : 0) + " " + ((y != null ? y : 0) - r) + " " +
                       "l " + r + ", " + r + " " +
                       "l " + (-r) + ", " + r + " " +
                       "l " + (-r) + ", " + (-r) + " " + "Z";
                break;

              // Set triangle up shape
              case 'triangle-up':
                return "M " + (x != null ? x : 0) + " " + ((y != null ? y : 0) - r) + " " +
                       "l " + r + ", " + dr + " " +
                       "l " + (-dr) + ", " + 0 + " " + "Z";
                break;

              // Set triangle down shape
              case 'triangle-down':
                return "M " + ((x != null ? x : 0) - r) + " " + ((y != null ? y : 0) - r) + " " +
                       "l " + dr + ", 0 " +
                       "l " + (-r) + ", " + dr + " " + "Z";
                break;

              // Set circle shape
              default:
                return "M " + (x != null ? x : 0) + " " + (y != null ? y : 0) + " " +
                       "m -" + r + ", 0 " +
                       "a " + r + "," + r + " 0 1,0 " + ( r*2) + ",0 " +
                       "a " + r + "," + r + " 0 1,0 " + (-r*2) + ",0 ";
                break;
            }
          }

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'animation'].forEach(function (key) {

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

  // Executa a funcao chamando o parametro de step
  main.run = _ => main('run');

  return main;
};

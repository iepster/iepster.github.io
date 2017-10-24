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

          // Set line width
          _var.lineWidth = function(d) {
            return d.strokeWidth != null && !isNaN(d.strokeWidth) ? d.strokeWidth + "px" : "3px";
          }

          // Set line color
          _var.lineColor = function(d) {
            return d.color != null ? d.color : "#666";
          }

          // Set stroke style function
          _var.lineStyle = function(d) {
            var strokeStyle = d.strokeStyle != null ? d.strokeStyle : "solid";
            if(strokeStyle === "dotted") { return "2,2"; }
            else if(strokeStyle === "dashed") { return "7,3"; }
            else { return "0,0"; }
          }

          // Set point color
          _var.pointColor = function(d) {
            if(d.pointColor != null) { return d.pointColor; }
            else if(d._parent.pointColor != null) { return d._parent.pointColor; }
            else if(d._parent.color != null) { return d._parent.color; }
            else { return "#333"; }
          }

          // Set point color
          _var.pointSize = function(d, isDraggable=false) {
            var size = d.pointSize != null ? d.pointSize : (d._parent.pointSize != null ? d._parent.pointSize : 4);
            return isDraggable ? d3.max([10,size]) : size;
          }

          // Set shape path for node
          _var.pointPath = function(d, isDraggable=false) {

            // Get radius
            var r = isDraggable ? d3.max([10,_var.pointSize(d)]) : _var.pointSize(d);
            var dr = r*2;
            var x  = _var.x(d.parsedX) + (_var.xIsDate || _var.xIsNumber ? 0 : _var.x.bandwidth()/2);
            var y  = _var.y(+d.y);
            var shape = d.pointShape != null ? d.pointShape : (d._parent.pointShape != null ? d._parent.pointShape : "circle");

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

          // Arrwos color function depending on the point color
          _var.arrowsColor = function(d) {
            var pointColor = _var.pointColor(d);
            return shared.helpers.colors.isDark(pointColor) ? "#FFF" : "#333";
          }

          // Set shape path for node
          _var.arrowsPath = function(d, isDraggable=false) {

            // Get variables values to be used on the path construction
            var r = 3;
            var dr = r*2;
            var x  = _var.x(d.parsedX) + (_var.xIsDate || _var.xIsNumber ? 0 : _var.x.bandwidth()/2);
            var y  = _var.y(+d.y);
            var shape = d.pointShape != null ? d.pointShape : (d._parent.pointShape != null ? d._parent.pointShape : "circle");

            // Draw arrows path
            var path = "";

            // Arrow up
            path += "M " + (x != null ? x : 0) + " " + (((y-2) != null ? (y-2) : 0) - r) + " ";
            path += "l " + r + ", " + (dr*0.7) + " ";
            path += "l " + (-dr) + ", " + 0 + " " + "Z";

            // Arrow down
            path += "M " + ((x != null ? x : 0) - r) + " " + (((y+4) != null ? (y+4) : 0) - r) + " ";
            path += "l " + dr + ", 0 ";
            path += "l " + (-r) + ", " + (dr*0.7) + " " + "Z";

            return path
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

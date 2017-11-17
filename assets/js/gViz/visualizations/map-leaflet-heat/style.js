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

          // Set polygons shape color
          _var.polygonShapeColor = function() {
            var obj = _var.heatData[d.properties[_var.data.heat != null && _var.data.heat.shapeId != null ? _var.data.heat.shapeId : "id"]];
            return obj == null ? "#eee" : (obj.color != null ? obj.color : _var.heatScale(+obj.value));
          }

          // Set polygon shape opacity
          _var.polygonShapeOpacity = function(d) {
            return _var.data.heat != null && _var.data.heat.mapOpacity != null ? +_var.data.heat.mapOpacity : 1;
          }

          // Set polygon shape stroke color
          _var.polygonShapeStrokeColor = function(d) {
            return _var.data.heat != null && _var.data.heat.mapStrokeColor != null ? _var.data.heat.mapStrokeColor : "#FFF";
          }

          // Set bar shape color
          _var.barShapeColor = function(d) {
            return _var.data.bars != null && _var.data.bars.mapColor != null ? _var.data.bars.mapColor : "#DDD";
          }

          // Set bar shape opacity
          _var.barShapeOpacity = function(d) {
            return _var.data.bars != null && _var.data.bars.mapOpacity != null ? +_var.data.bars.mapOpacity : 0.8;
          }

          // Set bar shape stroke color
          _var.barShapeStrokeColor = function(d) {
            return _var.data.bars != null && _var.data.bars.mapStrokeColor != null ? _var.data.bars.mapStrokeColor : "#FFF";
          }

          // Set pin radius
          _var.pinRadius = function(d) {
            return _var.data.bars != null && _var.data.bars.pinRadius != null ? _var.data.bars.pinRadius : (2*_var.barWidth(d));
          }

          // Set bar width
          _var.barWidth = function(d) {
            return _var.data.bars != null && _var.data.bars.barWidth != null ? _var.data.bars.barWidth : 3;
          }

          // Set bottom bar y
          _var.barY = function(d) {
            var bottomBarHeight = _var.data.bars != null && _var.data.bars.bottomBarHeight != null ? -_var.data.bars.bottomBarHeight : -3;
            return bottomBarHeight - _var.barScale(+d.value);
          }

          // Set bottom bar height
          _var.barHeight = function(d) {
            var bottomBarHeight = _var.data.bars != null && _var.data.bars.bottomBarHeight != null ? -_var.data.bars.bottomBarHeight : -3;
            return _var.barScale(+d.value);
          }

          // Set bar color
          _var.barColor = function(d) {
            return d.color != null ? d.color : _var.barColorScale(+d.value);
          }

          // Set bottom bar y
          _var.bottomBarY = function(d) {
            return _var.data.bars != null && _var.data.bars.bottomBarHeight != null ? -_var.data.bars.bottomBarHeight : -3;
          }

          // Set bottom bar height
          _var.bottomBarHeight = function(d) {
            return _var.data.bars != null && _var.data.bars.bottomBarHeight != null ? _var.data.bars.bottomBarHeight : 3;
          }

          // Set bottom bar color
          _var.bottomBarColor = function(d) {
            return _var.data.bars != null && _var.data.bars.bottomBarColor != null ? _var.data.bars.bottomBarColor : "#999";
          }

          // Set shape path for node
          _var.pointPath = function(d) {

            // Get radius
            var r = 5;
            var dr = r*2;
            var x  = 0;
            var y  = _var.barY(d);

            return "M " + (x != null ? x : 0) + " " + (y != null ? y : 0) + " " +
                   "m -" + r + ", 0 " +
                   "a " + r + "," + r + " 0 1,0 " + ( r*2) + ",0 " +
                   "a " + r + "," + r + " 0 1,0 " + (-r*2) + ",0 ";

          }

          // Set bar color
          _var.draggableColor = function(d) {
            return _var.data.bars != null && _var.data.bars.draggableColor != null ? _var.data.bars.draggableColor : _var.barColor(d);
          }

          // Arrwos color function depending on the point color
          _var.arrowsColor = function(d) {
            var barColor = _var.barColor(d);
            return _var.data.bars != null && _var.data.bars.arrowsColor != null ? _var.data.bars.arrowsColor : (shared.helpers.colors.isDark(barColor) ? "#FFF" : "#333");
          }

          // Set shape path for node
          _var.arrowsPath = function(d) {

            // Get variables values to be used on the path construction
            var r = 2;
            var dr = r*2;
            var x  = 0;
            var y  = _var.barY(d);

            // Draw arrows path
            var path = "";

            // Arrow up
            path += "M " + (x != null ? x : 0) + " " + (((y-1) != null ? (y-1) : 0) - r) + " ";
            path += "l " + r + ", " + (dr*0.7) + " ";
            path += "l " + (-dr) + ", " + 0 + " " + "Z";

            // Arrow down
            path += "M " + ((x != null ? x : 0) - r) + " " + (((y+3) != null ? (y+3) : 0) - r) + " ";
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

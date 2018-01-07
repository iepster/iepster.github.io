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

          // Get zoom transform
          _var.getZoomTransform = function() {
            return _var.zoomTransform.k >= 1 ? _var.zoomTransform.k : 1;
          }

          _var.filterLabelsFromLatLon = function(d) {
            return d.lon > _var.mapBounds[0][0] && d.lon < _var.mapBounds[1][0] && d.lat < _var.mapBounds[0][1] && d.lat > _var.mapBounds[1][1];
          }

          _var.filterLabels = function(d, i) {
            var zoom = _var.getZoomTransform();
            if(_var.getZoomTransform() < 2) { return false; }
            else if(zoom >= 2  && zoom < 5  && d.is_capital === '1') { return true; }
            else if(zoom >= 5  && zoom < 7  && (d.is_capital === '1' || i < 5)) { return true; }
            else if(zoom >= 7  && zoom < 8  && (d.is_capital === '1' || i < 10)) { return true; }
            else if(zoom >= 8  && zoom < 10 && (d.is_capital === '1' || i < 15)) { return true; }
            else if(zoom >= 10 && zoom < 11 && (d.is_capital === '1' || i < 20)) { return true; }
            else if(zoom >= 11 && zoom < 12 && (d.is_capital === '1' || i < 25)) { return true; }
            else if(zoom >= 12 && zoom < 13 && (d.is_capital === '1' || i < 30)) { return true; }
            else if(zoom >= 13 && zoom < 14 && (d.is_capital === '1' || i < 35)) { return true; }
            else if(zoom >= 14 && zoom < 15 && (d.is_capital === '1' || i < 40)) { return true; }
            else if(zoom >= 15 && zoom < 16 && (d.is_capital === '1' || i < 45)) { return true; }
            else if(zoom >= 16 && zoom < 17 && (d.is_capital === '1' || i < 50)) { return true; }
            else if(zoom >= 17 && zoom < 18 && (d.is_capital === '1' || i < 55)) { return true; }
            else if(zoom >= 18 && zoom < 19 && (d.is_capital === '1' || i < 60)) { return true; }
            else if(zoom >= 19 && zoom < 20 && (d.is_capital === '1' || i < 65)) { return true; }
            else { return false; }
          }

          _var.filterStateLabelsAbbr = function() { return _var.getZoomTransform() < 8; }

          // Get label state size
          _var.labelStateSize = function(d) { return (12 / _var.getZoomTransform()) + "px"; }
          _var.labelSize = function(d) { return (10 / _var.getZoomTransform()) + "px"; }
          _var.labelStateDy = function(d) { return ((12 / _var.getZoomTransform())/2) + "px"; }
          _var.labelDy = function(d) { return ((10 / _var.getZoomTransform())/2) + "px"; }

          // Set shape value
          _var.shapeValue = function(d) {
            var obj = _var.heatData[d.properties[_var.data.heat != null && _var.data.heat.shapeId != null ? _var.data.heat.shapeId : "id"]];
            return obj == null ? null : +obj.value;
          }

          // Set shape color
          _var.shapeColor = function(d) {
            if(_var.mode === 'bars') {
              return _var.data.bars != null && _var.data.bars.mapColor != null ? _var.data.bars.mapColor : "#DDD";
            } else {
              var obj = _var.heatData[d.properties[_var.data.heat != null && _var.data.heat.shapeId != null ? _var.data.heat.shapeId : "id"]];
              return obj == null ? "#eee" : (obj.color != null ? obj.color : _var.heatScale(+obj.value));
            }
          }

          // Set shape opacity
          _var.shapeOpacity = function(d) {
            if(_var.mode === 'bars') {
              return _var.data.bars != null && _var.data.bars.mapOpacity != null ? +_var.data.bars.mapOpacity : 0.8;
            } else {
              return _var.data.heat != null && _var.data.heat.mapOpacity != null ? +_var.data.heat.mapOpacity : 1;
            }
          }

          // Set shape stroke width
          _var.shapeStrokeWidth = function(d) {
            if(_var.mode === 'bars') {
              return ((_var.data.bars != null && _var.data.bars.mapStrokeColor != null && !isNaN(+_var.data.bars.mapStrokeColor) ? _var.data.bars.mapStrokeColor : 1) / _var.zoomTransform.k) + "px";
            } else {
              return ((_var.data.heat != null && _var.data.heat.mapStrokeColor != null && !isNaN(+_var.data.heat.mapStrokeColor) ? _var.data.heat.mapStrokeColor : 1) / _var.zoomTransform.k) + "px";
            }
          }

          // Set shape stroke color
          _var.shapeStrokeColor = function(d) {
            if(_var.mode === 'bars') {
              return _var.data.bars != null && _var.data.bars.mapStrokeColor != null ? _var.data.bars.mapStrokeColor : "#FFF";
            } else {
              return _var.data.heat != null && _var.data.heat.mapStrokeColor != null ? _var.data.heat.mapStrokeColor : "#FFF";
            }
          }

          // Set pin y
          _var.pinY = function(d) {
            return _var.barY(d) - _var.pinRadius(d) + (1 / _var.getZoomTransform());
          }

          // Set pin radius
          _var.pinRadius = function(d) {
            return (_var.data.bars != null && _var.data.bars.pinRadius != null ? _var.data.bars.pinRadius : (2*_var.barWidth(d))) / _var.getZoomTransform();
          }

          // Set bar width
          _var.barWidth = function(d) {
            return (_var.data.bars != null && _var.data.bars.barWidth != null ? _var.data.bars.barWidth : 3) / _var.getZoomTransform();
          }

          // Set bar y
          _var.barY = function(d) {
            return - (_var.bottomBarHeight(d) + _var.barHeight(d));
          }

          // Set bottom bar height
          _var.barHeight = function(d) {
            var bottomBarHeight = _var.data.bars != null && _var.data.bars.bottomBarHeight != null ? -_var.data.bars.bottomBarHeight : -3;
            return (_var.barScale(+d.value)) / _var.getZoomTransform();
          }

          // Set bar color
          _var.barColor = function(d) {
            return d.color != null ? d.color : (_var.data.bars != null && _var.data.bars.barColor != null ? _var.data.bars.barColor : "#999");
          }

          // Set bottom bar y
          _var.bottomBarY = function(d) {
            return (_var.data.bars != null && _var.data.bars.bottomBarHeight != null ? -_var.data.bars.bottomBarHeight : -3) / _var.getZoomTransform();
          }

          // Set bottom bar height
          _var.bottomBarHeight = function(d) {
            return (_var.data.bars != null && _var.data.bars.bottomBarHeight != null ? _var.data.bars.bottomBarHeight : 3) / _var.getZoomTransform();
          }

          // Set bottom bar color
          _var.bottomBarColor = function(d) {
            return _var.data.bars != null && _var.data.bars.bottomBarColor != null ? _var.data.bars.bottomBarColor : "#999";
          }

          // Set bar color
          _var.draggableColor = function(d) {
            return _var.data.bars != null && _var.data.bars.draggableColor != null ? _var.data.bars.draggableColor : _var.barColor(d);
          }

          // Set shape path for node
          _var.pointPath = function(d) {

            // Get radius
            var isPin = _var.data.bars != null && _var.data.bars.barStyle != null && _var.data.bars.barStyle === 'pin';
            var r = 5 / _var.getZoomTransform();
            var dr = r*2;
            var x  = 0;
            var y  = isPin ? _var.pinY(d) : _var.barY(d);

            return "M " + (x != null ? x : 0) + " " + (y != null ? y : 0) + " " +
                   "m -" + r + ", 0 " +
                   "a " + r + "," + r + " 0 1,0 " + ( r*2) + ",0 " +
                   "a " + r + "," + r + " 0 1,0 " + (-r*2) + ",0 ";

          }

          // Arrwos color function depending on the point color
          _var.arrowsColor = function(d) {
            var barColor = _var.barColor(d);
            return _var.data.bars != null && _var.data.bars.arrowsColor != null ? _var.data.bars.arrowsColor : (shared.helpers.colors.isDark(barColor) ? "#FFF" : "#333");
          }

          // Set shape path for node
          _var.arrowsPath = function(d) {

            // Get variables values to be used on the path construction
            var isPin = _var.data.bars != null && _var.data.bars.barStyle != null && _var.data.bars.barStyle === 'pin';
            var r = 2 / _var.getZoomTransform();
            var dr = r*2;
            var x  = 0;
            var y  = isPin ? _var.pinY(d) : _var.barY(d);
            var up = 1 / _var.getZoomTransform();
            var down = 3 / _var.getZoomTransform();

            // Draw arrows path
            var path = "";

            // Arrow up
            path += "M " + (x != null ? x : 0) + " " + (((y-up) != null ? (y-up) : 0) - r) + " ";
            path += "l " + r + ", " + (dr*0.7) + " ";
            path += "l " + (-dr) + ", " + 0 + " " + "Z";

            // Arrow down
            path += "M " + ((x != null ? x : 0) - r) + " " + (((y+down) != null ? (y+down) : 0) - r) + " ";
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

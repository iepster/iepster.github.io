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

          // Set bottom bar y
          _var.barY = function(d) {
            return _var.bottomBarHeight(d) - _var.barHeight(d);;
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

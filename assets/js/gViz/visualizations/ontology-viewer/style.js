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

          // Get radius proportinal
          _var.nodePropRadius = function(d) {
            var k = _var.zoomTransform.k < 1 ? 1 : _var.zoomTransform.k;
            return _var.nodeScale(+_var._data.nodes[d.id]._value) * k;
          }

          // Get radius
          _var.nodeRadius = function(d) {
            var k = _var.zoomTransform.k < 1 ? 1 : _var.zoomTransform.k;
            return _var.nodeScale(+_var._data.nodes[d.id]._value);
          }

          // Get node text dy
          _var.nodeTextDy = function(d) {
            var k = _var.zoomTransform.k < 1 ? 1 : _var.zoomTransform.k;
            return "1.1em";
          }

          // Get node text size
          _var.nodeTextSize = function(d) {
            var k = _var.zoomTransform.k < 1 ? 1 : _var.zoomTransform.k;
            return _var.nodeTextScale(+_var._data.nodes[d.id]._value) / k;
          }

          // Get node text y
          _var.nodeTextY = function(d, obj) {
            var h = obj.getBBox().height;
            return isNaN(+d.y) ? _var.height/2 : (d.y - h/2);
          }

          // Get node text X
          _var.nodeTextX = function(d) {
            return (isNaN(d.x) ? _var.width/2  : d.x);
          }


          // Set node text color
          _var.nodeTextColor = function(d) {
            return shared.helpers.colors.isDark(d.color) ? "#FFF" : "#000";
          }

          // Set link path
          _var.linkPath = function(d) {

            var target = d.target;
            var source = d.source;
            var tightness = 1000;

            // Places the control point for the Bezier on the bisection of the
            // segment between the source antarget points, at a distance
            // equal to half the distance between the points.
            var dx = target.x - source.x;
            var dy = target.y - source.y;
            var dr = Math.sqrt(dx * dx + dy * dy);
            var qx = source.x + dx/2 - dy/tightness;
            var qy = source.y + dy/2 + dx/tightness;

            // Calculates the segment from the control point Q to the target
            // to use it as a direction to wich it will move "node_size" back
            // from the end point, to finish the edge aprox at the edge of the
            // node. Note there will be an angular error due to the segment not
            // having the same direction as the curve at that point.
            var dqx = target.x - qx;
            var dqy = target.y - qy;
            var qr = Math.sqrt(dqx * dqx + dqy * dqy);

            // Set offset
            var offset = _var.nodeRadius(target);

            // Update end and start of edge
            var tx = target.x - dqx/qr* offset;
            var ty = target.y - dqy/qr* offset;

            target = d.source;
            source = d.target;
            tightness = 1000;

            // Places the control point for the Bezier on the bisection of the
            // segment between the source antarget points, at a distance
            // equal to half the distance between the points.
            dx = target.x - source.x;
            dy = target.y - source.y;
            dr = Math.sqrt(dx * dx + dy * dy);
            qx = source.x + dx/2 - dy/tightness;
            qy = source.y + dy/2 + dx/tightness;

            // Calculates the segment from the control point Q to the target
            // to use it as a direction to wich it will move "node_size" back
            // from the end point, to finish the edge aprox at the edge of the
            // node. Note there will be an angular error due to the segment not
            // having the same direction as the curve at that point.
            dqx = target.x - qx;
            dqy = target.y - qy;
            qr = Math.sqrt(dqx * dqx + dqy * dqy);

            // Set offset
            offset = _var.nodeRadius(target);

            // Update end and start of edge
            var sx = target.x - dqx/qr* offset;
            var sy = target.y - dqy/qr* offset;

            return "M" + sx + "," + sy + "Q"+ qx + "," + qy + " " + tx + "," + ty;  // to "node_size" pixels before

          }

          // Set shape path for node
          _var.nodePath = function(d) {

            // Get radius
            var r = _var.nodeRadius(d);
            var dr = r*2;

            if(d.shape === 'square') {

              // Set rect shape
              return "M " + ((d.x != null ? d.x : 0) - r) + " " + ((d.y != null ? d.y : 0) - r) + " " +
                     "l " + dr + ", 0 " +
                     "l 0 , " + dr + " " +
                     "l " + (-dr) + ", 0 " + "Z";

            } else if(d.shape === 'rect') {

              // Set rect shape
              return "M " + ((d.x != null ? d.x : 0) - dr) + " " + ((d.y != null ? d.y : 0) - r) + " " +
                     "l " + (2*dr) + ", 0 " +
                     "l 0 , " + dr + " " +
                     "l " + (-2*dr) + ", 0 " + "Z";

            } else if(d.shape === 'diamond') {

              // Set diamond shape
              return "M " + (d.x != null ? d.x : 0) + " " + ((d.y != null ? d.y : 0) - r) + " " +
                     "l " + r + ", " + r + " " +
                     "l " + (-r) + ", " + r + " " +
                     "l " + (-r) + ", " + (-r) + " " + "Z";

            } else if(d.shape === 'triangle-up') {

              // Set triangle up shape
              return "M " + (d.x != null ? d.x : 0) + " " + ((d.y != null ? d.y : 0) - r) + " " +
                     "l " + r + ", " + dr + " " +
                     "l " + (-dr) + ", " + 0 + " " + "Z";

            } else if(d.shape === 'triangle-down') {

              // Set triangle down shape
              return "M " + ((d.x != null ? d.x : 0) - r) + " " + ((d.y != null ? d.y : 0) - r) + " " +
                     "l " + dr + ", 0 " +
                     "l " + (-r) + ", " + dr + " " + "Z";

            } else {

              // Set circle shape
              return "M " + (d.x != null ? d.x : 0) + " " + (d.y != null ? d.y : 0) + " " +
                     "m -" + r + ", 0 " +
                     "a " + r + "," + r + " 0 1,0 " + ( r*2) + ",0 " +
                     "a " + r + "," + r + " 0 1,0 " + (-r*2) + ",0 ";
            }

          }

          // Set stroke style function
          _var.strokeStyle = function(d) {
            if(d.strokeStyle === "dotted") { return (2 / _var.zoomTransform.k) + "," + (2 / _var.zoomTransform.k); }
            else if(d.strokeStyle === "dashed") { return (7 / _var.zoomTransform.k) + "," + (3 / _var.zoomTransform.k); }
            else { return "0,0"; }
          }

          // Set stroke style function
          _var.strokeStyleHtml = function(d) {
            if(d.strokeStyle === "dotted" || d.strokeStyle === "dashed" || d.strokeStyle === "solid" ) { return d.strokeStyle; }
            else { return "none"; }
          }

          // Set stroke style function
          _var.strokeColor = function(d) {
            if(d.strokeStyle === "dotted" || d.strokeStyle === "dashed" || d.strokeStyle === "solid" ) { return d.strokeColor; }
            else { return d.color; }
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

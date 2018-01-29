// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = null;

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

          // Zoom functions
          _var.zoom_actions = function(){

            // Set event transformation only vertically without zoom
            d3.event.transform.k = 1;
            d3.event.transform.y = _var.margin.top;
            d3.event.transform.x = d3.event.transform.x < -_var.calcWidth + _var.width + _var.margin.left ? -_var.calcWidth + _var.width + _var.margin.left  : d3.event.transform.x;
            d3.event.transform.x = d3.event.transform.x > _var.margin.left ? _var.margin.left : d3.event.transform.x;

            // Update bgClipRect
            _var.bgClipRect.attr('x', -d3.event.transform.x + _var.margin.left);

            // Transform outer g
            _var.g.attr("transform", d3.event.transform)

            // Set zoom transform
            _var.zoomTransform = d3.event.transform;

          }

          // Add zoom capabilities
          _var.zoom_handler = d3.zoom()
            .scaleExtent([1,1])
            .on("zoom", _var.zoom_actions)
            .on("start", function() { _var.wrap.classed('grabbing', true) })
            .on("end",   function() { _var.wrap.classed('grabbing', false) });

          // Bind zoom to svg
          _var.wrap
            .call(_var.zoom_handler)
            .call(_var.zoom_handler.transform, d3.zoomIdentity.translate(_var.zoomTransform.x, _var.zoomTransform.y).scale(_var.zoomTransform.k))
            .on("wheel.zoom", null)

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var'].forEach(function (key) {

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

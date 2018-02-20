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

            // Fix x transformation
            d3.event.transform.x = _var.margin.left;

            if((_var.height * d3.event.transform.k) + d3.event.transform.y < _var.height + _var.margin.top) {
              d3.event.transform.y = -(_var.height * d3.event.transform.k) + (_var.height + _var.margin.top);
            } else if(d3.event.transform.y > _var.margin.top) {
              d3.event.transform.y = _var.margin.top;
            }

            // Update x range
            _var.y.range([_var.calcHeight * d3.event.transform.k, 0]);

            // Bars
            _var.g.selectAll(".chart-elements")
              .attr("transform", "translate(0, " + d3.event.transform.y+")scale(1, " + d3.event.transform.k + ")");

            // Update Texts positions
            var textGroups = _var.g.selectAll(".element-text").attr("transform", function (d) { return `translate(0, ${_var.y(d.y)+d3.event.transform.y})`; })
            textGroups.selectAll("text.x-in-text")
              .attr("y", function(d) { return (_var.yIn(d.y) + _var.yIn.bandwidth()/2) * d3.event.transform.k; })
              .attr("dy", '0.35em')
              .text(function(d) { return d.name; })

            textGroups.selectAll("text.y-in-text")
              .attr("y", function(d) { return (_var.yIn(d.y) + _var.yIn.bandwidth()/2 - _var.barHeight/2) * d3.event.transform.k - 7; })
              .attr("dy", '0.35em')
              .text(function(d) { return d.name; })

            // Axis
            _var.y_axis
              .attr("transform", "translate(0," + d3.event.transform.y + ")")
              .call(_var.yAxis.scale(_var.y));

            // Set zoom transform
            _var.zoomTransform = d3.event.transform;

          }

          // Add zoom capabilities
          _var.zoom_handler = d3.zoom()
            .scaleExtent([1,3])
            .on("zoom", _var.zoom_actions)
            .on("start", function() { _var.wrap.classed('grabbing', true) })
            .on("end",   function() { _var.wrap.classed('grabbing', false) });

          // Bind zoom to svg
          _var.wrap
            .call(_var.zoom_handler)
            .call(_var.zoom_handler.transform, d3.zoomIdentity.translate(_var.zoomTransform.x, _var.zoomTransform.y).scale(_var.zoomTransform.k))

          // Disable zoom for desktop mode
          if(_var.screenMode === 'desktop') { _var.wrap.on("wheel.zoom", null); }

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

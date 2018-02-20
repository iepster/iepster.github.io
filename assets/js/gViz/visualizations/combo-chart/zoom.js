// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = null;
  var components = {};

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

            // Fix y transformation
            d3.event.transform.y = _var.margin.top;

            if((_var.width * d3.event.transform.k) + d3.event.transform.x < _var.width) {
              d3.event.transform.x = -(_var.width * d3.event.transform.k) + _var.width;
            } else if(d3.event.transform.x > 0) {
              d3.event.transform.x = 0;
            }

            // Update x range
            _var.x.range([0, _var.width * d3.event.transform.k]);

            // Bars
            _var.g.selectAll(".chart-elements")
              .attr("transform", "translate(" + d3.event.transform.x+",0)scale(" + d3.event.transform.k + ",1)");

            // Update Texts positions
            var textGroups = _var.g.selectAll(".element-text").attr("transform", function (d) { return `translate(${_var.x(d.x)+d3.event.transform.x},0)`; })
            textGroups.selectAll("text.x-in-text")
              .attr("x", function(d) { return (_var.xIn(d.x) + _var.xIn.bandwidth()/2) * d3.event.transform.k; })
              .text(function(d) { return d.name; })
              .each(function(d) { shared.helpers.text.wrapBySize(d3.select(this), _var.xIn.bandwidth() * _var.zoomTransform.k, _var.margin.bottom, _var.xMaxLines); })

            // Axis
            _var.x_axis
              .attr("transform", "translate(" + d3.event.transform.x+","+(_var.height)+")")
              .call(_var.xAxis.scale(_var.x));

            // Update Texts positions and wraps
            _var.x_axis.selectAll(".tick text")
              .text(function(d) { return _var.nodes[d].name; })
              .each(function(d) { shared.helpers.text.wrapBySize(d3.select(this), _var.x.bandwidth()*0.9, _var.margin.bottom, _var.xMaxLines); })

            // Set zoom transform
            _var.zoomTransform = d3.event.transform;

            // Lines and points
            _var.g.selectAll(".chart-line-elements .line").attr("d", _var.lineConstructor)
            _var.g.selectAll(".chart-line-elements .point").attr("d", _var.pointPath)

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
  ['_var','components'].forEach(function (key) {

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

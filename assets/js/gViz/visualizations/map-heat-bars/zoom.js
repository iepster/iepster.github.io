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

            // Set zoom transform
            _var.zoomTransform = d3.event.transform;

            // Transform outer g
            _var.g.attr("transform", d3.event.transform)

            // Update shapes
            _var.mapShapes.style('stroke-width', _var.shapeStrokeWidth)

            // Draw shadow
            shared.visualComponents.shadow()
              ._var(_var)
              .id(_var.shadowId)
              .stdDeviation(2 / _var.zoomTransform.k)
              .x(-2 / _var.zoomTransform.k)
              .y(2 / _var.zoomTransform.k)
              .wrap(_var.wrap)
              .run();

            // Update bottom bar attrs
            _var.g.selectAll('.bottom-bar')
              .attr('width', _var.barWidth)
              .attr('height', _var.bottomBarHeight)
              .attr('x', function(d) { return -_var.barWidth(d)/2; })
              .attr('y', _var.barY)

            // Update bar attrs
            _var.g.selectAll('.bar')
              .attr('width', _var.barWidth)
              .attr('height', _var.barHeight)
              .attr('x', function(d) { return -_var.barWidth(d)/2; })
              .attr('y', _var.barY)

            // Draw state abbrs
            var stateLabelsAbbr = _var.g.selectAll(".state-label-abbr").data(_var.hasLabels && _var.filterStateLabelsAbbr() ? _var.geoData.features : []);
            stateLabelsAbbr.exit().remove();
            stateLabelsAbbr = stateLabelsAbbr.enter().append("text").attr("class", "state-label-abbr").merge(stateLabelsAbbr);
            stateLabelsAbbr
              .attr('text-anchor', "middle")
              .attr('font-size', _var.labelStateSize)
              .attr('x', function(d) { return _var.path.centroid(d)[0]; })
              .attr('y', function(d) { return _var.path.centroid(d)[1]; })
              .attr('dy', _var.labelStateDy )
              .text(function(d) { return d.properties.abbr.toUpperCase(); })

            // Resize Labels
            var x = -_var.zoomTransform.x, y = -_var.zoomTransform.y, k = _var.zoomTransform.k;
            _var.mapBounds = [_var.projection.invert([x/k,y/k]), _var.projection.invert([(x+_var.width)/k,(y+_var.height)/k])];
            _var.mapLabels = d3.select(".labels-group").selectAll(".map-label").data((_var.hasLabels ? _var.labelsData.filter(_var.filterLabelsFromLatLon).filter(_var.filterLabels) : []), function(d) { return d.name + '-' + d.state_id; });
            _var.mapLabels.exit().remove();
            _var.mapLabels = _var.mapLabels.enter().append("text").attr("class", "map-label").merge(_var.mapLabels);
            _var.mapLabels
              .attr('text-anchor', "middle")
              .attr('font-size', _var.labelSize)
              .attr('x', function(d) { return _var.projection([+d.lon, +d.lat])[0]; })
              .attr('y', function(d) { return _var.projection([+d.lon, +d.lat])[1]; })
              .attr('dy', _var.labelDy )
              .text(function(d) { return d.name; })

            // Update circle attrs
            _var.g.selectAll('.bar-circle').attr('r', _var.pinRadius).attr('cy', _var.pinY)

          }

          // Add zoom capabilities
          var hasZoom = !(_var.data != null && _var.data.attrs != null && _var.data.attrs.zoom != null && _var.data.attrs.zoom === false);
          _var.zoom_handler = d3.zoom()
            .scaleExtent(hasZoom ? [1, 20] : [1,1])
            .on("zoom", _var.zoom_actions)
            .on("start", function() { _var.wrap.classed('grabbing', true) })
            .on("end",   function() { _var.wrap.classed('grabbing', false) })

          // Bind zoom to svg
          _var.wrap
            .call(_var.zoom_handler)
            .call(_var.zoom_handler.transform, d3.zoomIdentity.translate(_var.zoomTransform.x, _var.zoomTransform.y).scale(_var.zoomTransform.k))

          // Remove zoom if specified on the json
          var hasPan = !(_var.data != null && _var.data.attrs != null && _var.data.attrs.pan != null && _var.data.attrs.pan === false);
          if(!hasPan) {
            _var.wrap
              .on("mousedown.zoom", null)
              .on("touchstart.zoom", null)
              .on("touchmove.zoom", null)
              .on("touchend.zoom", null);
          }

          // Reset visualization zoom
          _var.container.d3.closest('.gViz-outer-wrapper').select("[data-action='reset']").on('click', function(d) {
            _var.wrap.transition().call(_var.zoom_handler.transform, d3.zoomIdentity);
          });

          // Bind zoom in
          _var.container.d3.closest('.gViz-outer-wrapper').select("[data-action='zoom-in']").on('click', function(d) {
            _var.zoom_handler.scaleBy(_var.wrap.transition(), 1.3);
          });

          // Bind zoom out
          _var.container.d3.closest('.gViz-outer-wrapper').select("[data-action='zoom-out']").on('click', function(d) {
            _var.zoom_handler.scaleBy(_var.wrap.transition(), 1/1.3);
          });

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

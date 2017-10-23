// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var       = null;
  var components = {};
  var data       = null;

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

          // Create projection
          _var.projection = d3.geoMercator()
            .scale(1)
            .translate([0, 0]);

          // Create the path
          _var.path = d3.geoPath().projection(_var.projection);

          // Using the path determine the bounds of the current map and use
          // these to determine better values for the scale and translation
          var b = _var.path.bounds(_var.geoData);
          var s = 0.95 / Math.max((b[1][0] - b[0][0]) / _var.width, (b[1][1] - b[0][1]) / _var.height);
          var t = [(_var.width - s * (b[1][0] + b[0][0])) / 2, (_var.height - s * (b[1][1] + b[0][1])) / 2];

          // Update projection
          _var.projection.scale(s).translate(t);

          // Set data array
          var _data = (data == null ? _var.data.data : data);

          // Element canvas
          var elements = _var.g.selectAll(".chart-elements").data(["chart-elements"]);
          elements.exit().remove();
          elements = elements.enter().append("g").attr("class", "chart-elements").merge(elements);

          // Create groups
          var shapesGroup = elements.selectAll(".shapes-group").data(['shapes-group']);
          shapesGroup.exit().remove();
          shapesGroup = shapesGroup.enter().append("g").attr("class", "shapes-group").merge(shapesGroup);

          // For each element in group
          shapesGroup
            .each(function (e, i) {

              // Draw shapes
              _var.mapShapes = d3.select(this).selectAll(".map-shape").data(_var.geoData.features);
              _var.mapShapes.exit().remove();
              _var.mapShapes = _var.mapShapes.enter().append("path").attr("class", "map-shape").style('fill', _var.shapeColor).merge(_var.mapShapes);
              _var.mapShapes.transition()
                .attr('d', _var.path)
                .style('fill', _var.shapeColor)
                .style('fill-opacity', _var.shapeOpacity)
                .style('stroke', _var.shapeStrokeColor)
                .style('stroke-width', (0.5 / _var.zoomTransform.k) + "px")

              _var.mapShapes.on('mouseover', function(e) {

                // Only for heat mode
                if(_var.mode === 'heat') {

                  // Set hovered node
                  _var.hovered  = e.id;

                  // Mouseover event
                  components.events()
                    ._var(_var)
                    .action("mouseover")
                    .components(components)
                    .node(e)
                    .run();

                }

              // Mouseout action
              }).on('mouseout', function(e) {

                // Only for heat mode
                if(_var.mode === 'heat') {

                  // Reset hovered node
                  _var.hovered  = null;

                  // Mouseout event
                  components.events()
                    ._var(_var)
                    .action("mouseout")
                    .components(components)
                    .node(e)
                    .run();

                }

              });
            });

          // Create groups
          var barsData = _var.mode === 'bars' && _var.data.data != null && _var.data.data.bars != null ? _var.data.data.bars : [];
          var barsGroup = elements.selectAll(".bars-group").data(barsData);
          barsGroup.exit().remove();
          barsGroup = barsGroup.enter().append("g").attr("class", "bars-group").merge(barsGroup);

          // For each element in group
          barsGroup
            .attr('transform', function(d) { return "translate("+_var.projection([d.lon, d.lat])[0]+","+_var.projection([d.lon, d.lat])[1]+")"; })
            .each(function (e, i) {

              // Draw bottom bars
              _var.bottomBars = d3.select(this).selectAll(".bottom-bar").data([e]);
              _var.bottomBars.exit().remove();
              _var.bottomBars = _var.bottomBars.enter().append("rect").attr("class", "bottom-bar").merge(_var.bottomBars);
              _var.bottomBars.transition()
                .attr('x', function(d) { return -_var.barWidth(d)/2; })
                .attr('y', _var.bottomBarY)
                .attr('width', _var.barWidth)
                .attr('height', _var.bottomBarHeight)
                .attr('fill', _var.bottomBarColor)

              // Draw bars
              _var.bars = d3.select(this).selectAll(".bar").data([e]);
              _var.bars.exit().remove();
              _var.bars = _var.bars.enter().append("rect").attr("class", "bar").merge(_var.bars);
              _var.bars.transition()
                .attr('x', function(d) { return -_var.barWidth(d)/2; })
                .attr('y', _var.barY)
                .attr('width', _var.barWidth)
                .attr('height', _var.barHeight)
                .attr('fill', _var.barColor)

            });

            // Hover action
            barsGroup.on('mouseover', function(e) {

              // Set hovered node
              _var.hovered  = e.id;

              // Mouseover event
              components.events()
                ._var(_var)
                .action("mouseover")
                .components(components)
                .node(e)
                .run();

            // Mouseout action
            }).on('mouseout', function(e) {

              // Reset hovered node
              _var.hovered  = null;

              // Mouseout event
              components.events()
                ._var(_var)
                .action("mouseout")
                .components(components)
                .node(e)
                .run();

            });

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'components','data'].forEach(function (key) {

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

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

          var update = function()  {
            barsGroup.attr("transform", function(d) {
              return "translate("
                + _var.map.latLngToLayerPoint(d).x + ","
                + _var.map.latLngToLayerPoint(d).y + ")";
            })
            .style("display", "block");
          };

          var hideBars = function() {
            barsGroup.style("display", "none");
          };

          // Set data array
          var _data = (data == null ? _var.data.data : data);

          // Element canvas
          var elements = _var.g.selectAll(".chart-elements").data(["chart-elements"]);
          elements.exit().remove();
          elements = elements.enter().append("g").attr("class", "chart-elements").merge(elements);

          // Create groups
          var barsData = _var.mode.bars === true && _var.data.data != null ? _var.data.data : [];
          var barsGroup = elements.selectAll(".bars-group").data(barsData);
          barsGroup.exit().remove();
          barsGroup = barsGroup.enter().append("g").attr("class", "bars-group").merge(barsGroup);

          // For each element in group
          barsGroup
            .attr('transform', function(d) { return "translate("+_var.map.latLngToLayerPoint(d).x+","+_var.map.latLngToLayerPoint(d).y+")"; })
            .each(function (e, i) {

              // Initialize flags
              var isDraggable = e.draggable != null && e.draggable === true;

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

              // Update bars attributes
              _var.bars.transition()
                .attr('x', function(d) { return -_var.barWidth(d)/2; })
                .attr('y', _var.barY)
                .attr('width', _var.barWidth)
                .attr('height', _var.barHeight)
                .attr('fill', _var.barColor)

              // Create points/arrows groups
              var pointEls = d3.select(this).selectAll(".point-element.element").data(isDraggable ? [e] : []);
              pointEls.exit().remove();
              pointEls = pointEls.enter().append("g").attr("class", "point-element element").merge(pointEls);
              pointEls.style('display', 'none').each(function(pg) {

                // Create point
                var points = d3.select(this).selectAll(".point.element").data([pg]);
                points.exit().remove();
                points = points.enter().append("path").attr("class", "point element").merge(points);
                points.transition().duration(200)
                  .attr("d", function(d) { return _var.pointPath(d); })
                  .attr("fill", _var.barColor)

                // Create point arrows for draggable lines
                var arrows = d3.select(this).selectAll(".arrow.element").data([pg]);
                arrows.exit().remove();
                arrows = arrows.enter().append("path").attr("class", "arrow element").merge(arrows);
                arrows.transition().duration(200)
                  .attr("d", function(d) { return _var.arrowsPath(d); })
                  .attr("fill", _var.arrowsColor)

                // Create point
                var bgPoints = d3.select(this).selectAll(".bg-point.element").data([pg]);
                bgPoints.exit().remove();
                bgPoints = bgPoints.enter().append("circle").attr("class", "bg-point element").merge(bgPoints);
                bgPoints.transition().duration(200)
                  .attr("cx", 0)
                  .attr("cy", _var.barY)
                  .attr("r", 5)
                  .attr("fill", "transparent")

              });

              if(isDraggable) {

                // Bind drag to points groups
                pointEls.call(d3.drag()
                  .on("start", _var.dragstarted)
                  .on("drag", _var.dragging)
                  .on("end", _var.dragended));

              }

            });

          // Hover action
          barsGroup
            .on('mouseover', function(e) {

              // Set hovered node
              _var.hovered  = e.id;

              // Mouseover event
              components.events()
                ._var(_var)
                .action("mouseover")
                .components(components)
                .node(e)
                .run();

              // Trigger onHover attribute function
              if(_var.onHover != null && typeof _var.onHover === "function") { _var.onHover(e); }

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

            // Click action
            }).on('click', function(e) {

              // Trigger onClick attribute function
              if(_var.onClick != null && typeof _var.onClick === "function") { _var.onClick(e); }

            });

            barsGroup.style("cursor", "pointer");

            _var.map.on("move", update);
            _var.map.on("resize", update);
            _var.map.on("moveend", update);
            _var.map.on("zoomstart", hideBars);
            _var.map.on("zoomend", update);

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

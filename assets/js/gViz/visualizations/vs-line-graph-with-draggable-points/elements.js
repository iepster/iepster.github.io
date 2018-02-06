// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var       = null;
  var components = null;
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

          // Set data array
          var _data = (data == null ? _var.data.data : data)

          // Element canvas
          var elements = _var.g.selectAll(".chart-elements").data(["chart-elements"]);
          elements.exit().remove();
          elements = elements.enter().append("g").attr("class", "chart-elements").merge(elements);

          // Create groups
          var groups = elements.selectAll(".element-group").data(_data, function(d) { return d.id; });
          groups.exit().remove();
          groups = groups.enter().append("g").attr("class", "element-group").merge(groups);
          groups.each(function(g) {

            // Initialize flags
            var isDraggable = g.draggable != null && g.draggable === true;

            // Create lines
            var lines = d3.select(this).selectAll(".line").data([g], function(d) { return d.id; });
            lines.exit().remove();
            lines = lines.enter().append("path").attr("class", "line").attr('data-id', function(d) { return d.id; }).merge(lines);
            lines.transition().duration(200)
              .attr("d", function (d) { return _var.lineConstructor(d.values); })
              .attr("fill", 'none')
              .attr("stroke-width", _var.lineWidth)
              .attr("stroke-dasharray", _var.lineStyle)
              .attr("stroke", _var.lineColor)

            // Create points/arrows groups
            var pointGroups = d3.select(this).selectAll(".point-group.element").data(g.pointSize === 0 && !isDraggable ? [] : g.values);
            pointGroups.exit().remove();
            pointGroups = pointGroups.enter().append("g").attr("class", "point-group element").merge(pointGroups);
            pointGroups.each(function(pg) {

              // Set parent id on points values
              pg._parentId = g.id;

              // Create point
              var points = d3.select(this).selectAll(".point.element").data(g.pointSize === 0 && !isDraggable ? [] : [pg]);
              points.exit().remove();
              points = points.enter().append("path").attr("class", "point element").merge(points);
              points.transition().duration(200)
                .attr("d", function(d) { return _var.pointPath(d, isDraggable); })
                .attr("fill", _var.pointColor)

              // Create point arrows for draggable lines
              var arrows = d3.select(this).selectAll(".arrow.element").data(isDraggable ? [pg] : []);
              arrows.exit().remove();
              arrows = arrows.enter().append("path").attr("class", "arrow element").merge(arrows);
              arrows.transition().duration(200)
                .attr("d", function(d) { return _var.arrowsPath(d); })
                .attr("fill", _var.arrowsColor)

              // Create point
              var bgPoints = d3.select(this).selectAll(".bg-point.element").data(isDraggable ? [pg] : []);
              bgPoints.exit().remove();
              bgPoints = bgPoints.enter().append("path").attr("class", "bg-point element").merge(bgPoints);
              bgPoints.transition().duration(200)
                .attr("d", function(d) { return _var.pointPath(d, isDraggable); })
                .attr("fill", "transparent")

            });

            // Event bindings
            pointGroups.on('mouseover', function(e) {

              // Set hovered node
              _var.hovered = e;

              // Mouseover event
              components.events()
                ._var(_var)
                .action("mouseover")
                .components(components)
                .node(e)
                .mouse(this)
                .isDraggable(isDraggable)
                .run();

              // Trigger onHover attribute function
              if(_var.nodeDragging !== true && _var.onHover != null && typeof _var.onHover === "function") { _var.onHover(e); }

            }).on('mouseout', function(e) {

              // Reset hovered node
              _var.hovered = null;

              // Mouseout event
              components.events()
                ._var(_var)
                .action("mouseout")
                .components(components)
                .mouse(this)
                .run();

            }).on('click', function(e) {

              // Trigger onClick attribute function
              if(_var.onClick != null && typeof _var.onClick === "function") { _var.onClick(e); }

            });

            if(isDraggable) {

              // Bind drag to points groups
              pointGroups.call(d3.drag()
                .on("start", _var.dragstarted)
                .on("drag", _var.dragging)
                .on("end", _var.dragended)
                .touchable(true));

            } else {

              pointGroups
                .on("mousedown.drag", null)
                .on("mousewheel.drag", null)
                .on("mousemove.drag", null)
                .on("DOMMouseScroll.drag", null)
                .on("dblclick.drag", null)
                .on("touchstart.drag", null)
                .on("touchmove.drag", null)
                .on("touchend.drag", null)
                .on('mousedown.drag', null);

            }

          });

          // Draw Background rect
          var bg_rect = elements.selectAll("rect.bg-rect").data(["bg-rect"]);
          bg_rect.exit().remove();
          bg_rect = bg_rect.enter().insert('rect', ':first-child').attr("class", "bg-rect").style('fill', 'transparent').merge(bg_rect);
          bg_rect
            .style('fill', 'transparent')
            .attr("x", 0).attr('y', 0)
            .attr('width', _var.width).attr("height", _var.height)

          // Bind mouse events
          elements
            .on('mouseover', function() {

              if(!d3.select(d3.event.target).classed('element')) {

                // Set hovered node
                _var.hovered = {};

                // Mouseover event
                components.events()
                  ._var(_var)
                  .action("mouseover")
                  .components(components)
                  .mouse(this)
                  .origin('background')
                  .run();

              }

            }).on('mousemove', function() {

              if(!d3.select(d3.event.target).classed('element')) {

                // Set hovered node
                _var.hovered = {};

                // Mouseover event
                components.events()
                  ._var(_var)
                  .action("mouseover")
                  .components(components)
                  .mouse(this)
                  .origin('background')
                  .run();

              }

            }).on('mouseout', function(e) {

              if(!d3.select(d3.event.target).classed('element')) {

                // Reset hovered node
                _var.hovered = null;

                // Mouseout event
                components.events()
                  ._var(_var)
                  .action("mouseout")
                  .components(components)
                  .run();

              }

            });

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','components','data'].forEach(function (key) {

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

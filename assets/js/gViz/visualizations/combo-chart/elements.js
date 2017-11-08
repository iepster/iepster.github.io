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
          var _data = (data == null ? _var.data.data : data);

          // Element canvas
          var elements = _var.g.selectAll(".chart-elements").data(["chart-elements"]);
          elements.exit().remove();
          elements = elements.enter().append("g").attr("class", "chart-elements").merge(elements);

          // Create groups
          var groups = elements.selectAll(".element-group").data(_data, function (d) { return d.x; });
          groups.exit().remove();
          groups = groups.enter().append("g").attr("class", "element-group").merge(groups);

          // For each element in group
          groups.transition().duration(200)
            .attr("transform", function (d) { return `translate(${_var.x(d.x)},0)`; })
            .each(function (e, i) {

              // Mouseover event
              components.bars()
                ._var(_var)
                .components(components)
                .nodeIndex(i)
                .nodeObj(this)
                .node(e)
                .run();

            });

            // Event bindings
            elements.selectAll('.bar, .stroke').on('mouseover', function(e) {

              // Set hovered node
              _var.hovered = e;

              // Mouseover event
              components.events()
                ._var(_var)
                .action("mouseover")
                .components(components)
                .node(e)
                .run();

            }).on('mouseout', function(e) {

              // Reset hovered node
              _var.hovered = null;

              // Mouseout event
              components.events()
                ._var(_var)
                .action("mouseout")
                .components(components)
                .run();

            });

          // Create line
          var lines = elements.selectAll(".line").data([_data.filter(function(d) { return d.yLine != null && !isNaN(+d.yLine); })]);
          lines.exit().remove();
          lines = lines.enter().append("path").attr("class", "line").merge(lines);
          lines.transition().duration(200)
            .attr("d", function (d) { return _var.lineConstructor(d); })
            .attr("fill", 'none')
            .attr("stroke-width", _var.lineWidth)
            .attr("stroke-dasharray", _var.lineStyle)
            .attr("stroke", _var.lineColor)

          // Create line points
          var points = elements.selectAll(".point").data(_data.filter(function(d) { return d.yLine != null && !isNaN(+d.yLine); }), function(d) { return d.x; });
          points.exit().remove();
          points = points.enter().append("path").attr("class", "point").merge(points);
          points.transition().duration(200)
            .attr("d", _var.pointPath)
            .attr("fill", _var.pointColor)

          // Event bindings
          points.on('mouseover', function(e) {

            // Set hovered node
            _var.hovered = e;

            // Mouseover event
            components.events()
              ._var(_var)
              .action("mouseover")
              .components(components)
              .node(e)
              .type('line')
              .run();

          }).on('mouseout', function(e) {

            // Reset hovered node
            _var.hovered = null;

            // Mouseout event
            components.events()
              ._var(_var)
              .action("mouseout")
              .components(components)
              .type('line')
              .run();

          });

          // Draw Background rect
          var bg_rect = _var.g.selectAll("rect.bg-rect").data(["bg-rect"]);
          bg_rect.exit().remove();
          bg_rect = bg_rect.enter().insert('rect', ':first-child').attr("class", "bg-rect").style('fill', 'transparent').merge(bg_rect);
          bg_rect.style('fill', 'transparent').attr("x", 0).attr('y', 0).attr('width', _var.width).attr("height", _var.height);

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

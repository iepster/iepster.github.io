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
          var _data = (data == null ? _var.values : data).sort(function(a,b) { return d3.descending(+a._values.z, +b._values.z); });

          // Element canvas
          var elements = _var.gE.selectAll(".chart-elements").data(["chart-elements"]);
          elements.exit().remove();
          elements = elements.enter().append("g").attr("class", "chart-elements").merge(elements);

          // Create groups
          var groups = elements.selectAll(".element-group").data(_data, function (d) { return d.id; });
          groups.exit().remove();
          groups = groups.enter().append("g").attr("class", "element-group").merge(groups);

          // For each element in group
          groups
            .style('opacity', function(g) { return _var.clicked == null || g.id === _var.clicked.id ? 1 : 0.1; })
            .transition().duration(200)
              .attr("transform", function (d) { return `translate(${_var.x(+d._values.x)},${_var.y(+d._values.y)})`; })
              .each(function (e, i) {

                // Draw Background rect
                var circle = d3.select(this).selectAll("circle.node-circle").data([e]);
                circle.exit().remove();
                circle = circle.enter().append('circle').attr("class", "node-circle").merge(circle);
                circle
                  .style('fill', function(d) { return d.color; })
                  .attr("x", 0)
                  .attr('y', 0)
                  .transition().duration(200)
                    .attr('r', function(d) { return _var.z(+d._values.z); });

              });

            // Event bindings
            groups.on('mouseover', function(e) {

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

            }).on('click', function(e) {

              if(_var.clicked == null || _var.clicked.id !== e.id) {

                // Set clicked node
                _var.clicked = e;

                // Insert track components
                components.track()
                  ._var(_var)
                  .components(components)
                  .node(e)
                  .run();

              } else if(e.id === _var.clicked.id) {

                // Set clicked node
                _var.clicked = null;

                // Remove track circles
                _var.gE.selectAll(".chart-track-elements").selectAll(".track-circle, .track-path").remove();

              }

            });

          // Draw Background rect
          var bg_rect = _var.g.selectAll("rect.bg-rect").data(["bg-rect"]);
          bg_rect.exit().remove();
          bg_rect = bg_rect.enter().insert('rect', ':first-child').attr("class", "bg-rect").style('fill', 'transparent').merge(bg_rect);
          bg_rect.style('fill', 'transparent').attr("x", 0).attr('y', 0).attr('width', _var.width).attr("height", _var.height);

          // Remove click on other elements click
          _var.g.on('click', function(d) {

            // Empty clicked node
            _var.clicked = null;

            // Remove track circles
            _var.gE.selectAll(".chart-track-elements").selectAll(".track-circle, .track-path").remove();

            // Mouseout event
            components.events()
              ._var(_var)
              .action("mouseout")
              .components(components)
              .run();

          });

          if(_var.clicked != null) {

            // Update track elements if exists
            components.track()
              ._var(_var)
              .components(components)
              .node(_var.clicked)
              .run();

          }

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

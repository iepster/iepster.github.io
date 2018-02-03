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
          var groups = elements.selectAll(".element-group").data(_data, function (d) { return d.id; });
          groups.exit().remove();
          groups = groups.enter().append("g").attr("class", "element-group").merge(groups);

          // For each element in group
          groups.transition().duration(200)
            .attr("transform", function (d) { return `translate(${+d.y >= 0 ? _var.xTop(d.x) : _var.xBottom(d.x)},0)`; })
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

          // Draw Background clip Path
          _var.bgClip = _var.defs.selectAll(".bg-clip").data(["bg-clip"]);
          _var.bgClip.exit().remove();
          _var.bgClip = _var.bgClip.enter().insert('clipPath', ':first-child').attr("class", "bg-clip").merge(_var.bgClip);
          _var.bgClip
            .attr("id", "clip-path-"+_var._id)
            .each(function() {

              // Draw Background rect
              _var.bgClipRect = d3.select(this).selectAll("rect.bg-rect").data(["bg-rect"]);
              _var.bgClipRect.exit().remove();
              _var.bgClipRect = _var.bgClipRect.enter().insert('rect', ':first-child').attr("class", "bg-rect").style('fill', 'transparent').merge(_var.bgClipRect);
              _var.bgClipRect
                .style('fill', 'transparent')
                .attr("x", 0)
                .attr('y', -_var.margin.top)
                .attr('width', _var.width + _var.margin.right + 1)
                .attr("height", _var.height + _var.margin.bottom + 2*_var.margin.top);

            });

            // Update x top select positions
            _var.container.outerWrapper.selectAll('.x-top-select')
              .style('top', (_var.container.dimensions.title + _var.container.dimensions.legend + _var.margin.top + 10) + 'px')

            // Update x bottom select positions
            _var.container.outerWrapper.selectAll('.x-bottom-select')
              .style('bottom', (_var.margin.bottom) + 'px')

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

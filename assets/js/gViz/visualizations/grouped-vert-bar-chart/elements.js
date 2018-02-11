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

          // Element canvas
          var textElements = _var.g.selectAll(".chart-text-elements").data(["chart-text-elements"]);
          textElements.exit().remove();
          textElements = textElements.enter().append("g").attr("class", "chart-text-elements").merge(textElements);

          // Create textGroups
          var textGroups = textElements.selectAll(".element-text").data(_data, function (d) { return d.x; });
          textGroups.exit().remove();
          textGroups = textGroups.enter().append("g").attr("class", "element-text").merge(textGroups);

          // For each element in group
          textGroups
            .attr("transform", function (d) { return `translate(${_var.x(d.x) + _var.zoomTransform.x},0)`; })
            .each(function (e, i) {

              // Draw Texts
              var textValuesObj = {};
              var textValues = e.values.filter(function(d) { var flag = textValuesObj[d.x] == null; textValuesObj[d.x] = true; return flag; });
              var texts = d3.select(this).selectAll("text.x-in-text").data((e.name == null || e.name === "" ? textValues : []), function(d) { return d.x; });
              texts.exit().remove();
              texts = texts.enter().append('text').attr("class", "x-in-text").merge(texts);
              texts
                .attr("x", function(d) { return (_var.xIn(d.x) + _var.xIn.bandwidth()/2) * _var.zoomTransform.k; })
                .attr('y', _var.height + 17)
                .attr('text-anchor', 'middle')
                .text(function(d) { return d.name; })
                .each(function(d) { shared.helpers.text.wrapBySize(d3.select(this), _var.xIn.bandwidth() * _var.zoomTransform.k, _var.margin.bottom, _var.xMaxLines); })

            });


          // Event bindings
          elements.selectAll('.bar, .stroke, .wrapper-stroke, .wrapper-bar').on('mouseover', function(e) {

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
                .attr("x", _var.margin.left)
                .attr('y', 0)
                .attr('width', (_var.width + _var.margin.right)  / _var.zoomTransform.k)
                .attr("height", _var.height + _var.margin.bottom + _var.margin.top);

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

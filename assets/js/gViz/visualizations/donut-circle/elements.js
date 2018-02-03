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
          var _data = _var.pie(data == null ? _var.data.data : data);

          // Element canvas
          var elements = _var.g.selectAll(".chart-elements").data(["chart-elements"]);
          elements.exit().remove();
          elements = elements.enter().append("g").attr("class", "chart-elements").merge(elements);

          // Create groups
          var groups = elements.selectAll(".element-group").data(_data, function (d) { return d.data.id; });
          groups.exit().remove();
          groups = groups.enter().append("g").attr("class", "element-group").merge(groups);

          // For each element in group
          groups.each(function (e, i) {

            // Draw Background rect
            var arc = d3.select(this).selectAll("path.node-arc").data([e]);
            arc.exit().remove();
            arc = arc.enter().append('path').attr("class", "node-arc").merge(arc);
            arc
              .style('fill', function(d) { return d.data._color; })
              .style('stroke', "none")
              .style('opacity', _var.arcOpacity)
              .transition()
                .attr("d", _var.arc)

            // Draw Background rect
            var line = d3.select(this).selectAll("path.node-line").data([e]);
            line.exit().remove();
            line = line.enter().append('line').attr("class", "node-line").merge(line);
            line
              .style('fill', 'none')
              .attr('stroke', function(d) { return d.data.lineColor != null ? d.data.lineColor : (d.data.color != null ? d.data.color : "#FFF"); })
              .style('stroke-width', '1px')
              .attr('transform', function(d) { return d.angle != null ? 'rotate('+d.angle+')' : ''; })
              .attr("x1", function(d) { return _var.arc.centroid(d)[0]; })
              .attr("y1", function(d) { return _var.arc.centroid(d)[1]; })
              .attr("x2", function(d) { return _var.arcLine.centroid(d)[0]; })
              .attr("y2", function(d) { return _var.arcLine.centroid(d)[1]; })


            // Calculate attrs
            var meanAngle = e.startAngle + Math.abs(e.endAngle - e.startAngle)/2;
            var attrs = {
              nameY: meanAngle <= Math.PI/2 || meanAngle >= (3*Math.PI)/2 ? -15 : 15,
              anchor: meanAngle <= Math.PI/3 || meanAngle >= (5*Math.PI)/3 || (meanAngle >= (2*Math.PI)/3 && meanAngle <= (4*Math.PI)/3) ? 'middle' : (meanAngle < Math.PI ? 'start' : 'end'),

              dy: (meanAngle <= Math.PI/3 || meanAngle >= (5*Math.PI)/3) ? '8px' : ((meanAngle >= (2*Math.PI)/3 && meanAngle <= (4*Math.PI)/3) ? '2px' : '12px'),
              x: meanAngle <= Math.PI/3 || meanAngle >= (5*Math.PI)/3 || (meanAngle >= (2*Math.PI)/3 && meanAngle <= (4*Math.PI)/3) ? 0 : (meanAngle < Math.PI ? -7 : 7),
            }

            // Update value Text
            var valueText = d3.select(this).selectAll('.value-text').data([e]);
            valueText.exit().remove();
            valueText = valueText.enter().append("text").attr("class", 'value-text').merge(valueText);
            valueText
              .attr('x', function(d) { return _var.arcLabels.centroid(d)[0] + attrs.x; })
              .attr('y', function(d) { return _var.arcLabels.centroid(d)[1]; })
              .attr('text-anchor', attrs.anchor)
              .attr('fill', function(d) { return d.data.percentageColor != null ? d.data.percentageColor : (d.data.color != null ? d.data.color : "#FFF"); })
              .attr('dy', attrs.dy)
              .text(function(d) { return d.data[_var.metric] != null ? _var.format(+d.data[_var.metric]) : "No value"; });

            // Update name Text
            var nameText = d3.select(this).selectAll('.name-text').data([e]);
            nameText.exit().remove();
            nameText = nameText.enter().append("text").attr("class", 'name-text').merge(nameText);
            nameText
              .attr('x', function(d) { return _var.arcLabels.centroid(d)[0] + attrs.x; })
              .attr('y', function(d) { return _var.arcLabels.centroid(d)[1] + attrs.nameY; })
              .attr('text-anchor', attrs.anchor)
              .attr('fill', function(d) { return d.data.nameColor != null ? d.data.nameColor : (d.data.color != null ? d.data.color : "#FFF"); })
              .attr('dy', attrs.dy)
              .text(function(d) { return d.data.name != null ? d.data.name : "No name"; });


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

          })

          // Set node
          var node = _var.data[_var.metric];

          // Draw center title
          var centerTitle = _var.g.selectAll("text.center-title").data(["center-title"]);
          centerTitle.exit().remove();
          centerTitle = centerTitle.enter().append('text').attr("class", "center-title").merge(centerTitle);
          centerTitle
            .style('fill', _var.data != null && node != null && node.color != null ? node.color : "#666" )
            .attr('x', 0)
            .attr('y', -7)
            .attr('text-anchor', 'middle')
            .text(_var.data != null && node != null && node.title != null ? node.title : "No Title")
            .style('opacity', 0)
            .transition()
              .style('opacity', 1)

          centerTitle.each(function(d) { shared.helpers.text.wrapBySize(d3.select(this), (_var.size - _var.radius), (_var.size - _var.radius), 10); })

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

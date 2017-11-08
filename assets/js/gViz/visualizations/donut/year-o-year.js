// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var      = undefined;
  var animation = 900;
  var container = null;

  // Validate attributes
  var validate = function(step) {
    switch (step) {
      case 'run': return true;
      default: return false;
    }
  };

  // Main function
  var main = function(step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'run':

          // Set arc radius
          _var.arc
            .outerRadius(_var.radius)
            .innerRadius(0);

          // Get angles
          var angles = [];
          _var.pieData.sort(function(a,b) { return d3.ascending(a.id, b.id); }).forEach(function(d) {
            _var.pie(d.values).forEach(function(v) {
              if(v.data.id === "currentYear" || v.data.id === "previousYear") { angles.push(v); }
            });
          });

          // Set year o year obj
          var obj = {
            id: 'year-o-year',
            name: "Year Over Year",
            value: angles[0].value - angles[1].value,
            angle: d3.mean(angles, function(d) { return d.endAngle; }),
            startAngle: d3.min(angles, function(d) { return d.endAngle; }),
            endAngle: d3.max(angles, function(d) { return d.endAngle; }),
            padAngle: 0,
            index: 0
          };

          // Set data
          var data = _var.yearOYear ? [obj] : [];

          // Create current and previous year arc
          var arc = container.selectAll(".year-over-year").data(data);
          arc.exit().remove();
          arc = arc.enter().append("path").attr("class", "year-over-year").merge(arc);
          arc
            .attr('d', _var.arc)
            .style('fill', "#FFF")
            .style('fill-opacity', 0.3)

          // Set border data
          var bData = _var.yearOYear ? [obj,obj] : [];

          // Create border lines
          var arcBorder = container.selectAll(".year-over-year-border").data(bData);
          arcBorder.exit().remove();
          arcBorder = arcBorder.enter().append("line").attr("class", "year-over-year-border").merge(arcBorder);
          arcBorder
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', function(d,i) { return _var.radius * Math.cos(-Math.PI/2 + (i === 0 ? d.startAngle : d.endAngle)); })
            .attr('y2', function(d,i) { return _var.radius * Math.sin(-Math.PI/2 + (i === 0 ? d.startAngle : d.endAngle)); })
            .style('fill', "none")
            .style('stroke', "#FFF")
            .style('stroke-width', "1px")

          // Create label
          var label = container.selectAll(".label-y-o-y").data(data);
          label.exit().remove();
          label = label.enter().append("text").attr("class", "label-y-o-y").merge(label);
          label
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", 5)
            .text("YoY")

          // Set arc radius
          _var.arc
            .outerRadius(_var.radius - 1)
            .innerRadius(_var.radius - 14);

          // Create label value
          var label = container.selectAll(".label-y-o-y-value").data(data);
          label.exit().remove();
          label = label.enter().append("text").attr("class", "label-y-o-y-value").merge(label);
          label
            .attr("transform", function(d) { return "translate(" + _var.arc.centroid(d) + ")"; })
            .attr("dy", ".3em")
            .attr("text-anchor", function(d) { return d.angle < Math.PI ? "end" : "start"; })
            .text(function(d) { return shared.helpers.number.localePercent(+d.value); });


          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','animation','container'].forEach(function(key) {

    // Attach variables to validation function
    validate[key] = function(_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return validate;
    };

    // Attach variables to main function
    return main[key] = function(_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return main;
    };
  });

  // Executa a funcao chamando o parametro de step
  main.run = _ => main('run');

  return main;
};

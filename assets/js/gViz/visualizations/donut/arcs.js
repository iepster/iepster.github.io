// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var      = undefined;
  var animation = 3600;
  var numAngles = 90;
  var components = null;
  var nodeObj   = null;
  var node      = null;


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

          // Build arcs function
          var buildArcs = function(obj, colorScale) {

            // Initialize number of intervals, angleInterval and data
            var angleInterval = 2*Math.PI / numAngles;
            var data = [];

            // Populate data setting arcs
            d3.range(numAngles)
              .filter(function(n) { return (2*Math.PI / numAngles)*n >= obj.startAngle && (2*Math.PI / numAngles)*n <= obj.endAngle; })
              .forEach(function(n) {
                if(!(_var.subdivisions && n%15 === 0)) {
                  var angle = ((2*Math.PI)/numAngles)*n + ((2*Math.PI)/numAngles)/2;
                  data.push({
                    data: { fill: colorScale(n), id: obj.data.id },
                    startAngle: angle,
                    endAngle: angle,
                    index: n,
                    padAngle: 0
                  });
                }
              });

            // Return data with arcs
            return data;

          }

          // Get parent selection
          var nodeSel = d3.select(nodeObj);

          // Set arc radius
          _var.arc
            .outerRadius(_var.radius - (node.id === 'currentYear' ? 15 : 25))
            .innerRadius(_var.radius - (node.id === 'currentYear' ? 21 : 31));

          // Create arcs groups
          var arc_group = nodeSel.selectAll(".arc-group").data(_var.pie(node.values), function (d) { return d.data.id; });
          arc_group.exit().remove();
          arc_group = arc_group.enter().append("g").attr("class", "arc-group").merge(arc_group);
          arc_group.each(function(a) {

            // Initialize color scale
            var colorScale = d3.scaleLinear().domain([0, numAngles]);

            // Set scale range
            if(a.data.id === "empty-data") { colorScale.range(a.data.colors.map(function(c) { return c.color; })); }
            else { colorScale.range(node.id === 'currentYear' ? a.data.colors.map(function(c) { return c.color; }) : ["#989e91", "#616a68"]); }

            // Get data and strokeWidth
            var data = buildArcs(a, colorScale);
            var strokeWidth = (((_var.radius - 25)*5)/60.6328125);

            // Create arc groups
            var arc = d3.select(this).selectAll(".arc").data(data);
            arc.exit().remove();
            arc = arc.enter().append("path").attr("class", "arc").merge(arc);
            arc
              .attr("data-id", a.data.id)
              .attr("d", _var.arc)
              .style("stroke", function(d) { return d.data.fill; })
              .style("stroke-width", function(d) { return (d.data.id === 'previousYear' ? (strokeWidth/2) : strokeWidth) + "px"; })
              .style('stroke-dasharray', function(d, i) { return d.data.id === 'previousYear' ? '1,2' : 'none'; });

          });

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','animation','components','nodeObj','node'].forEach(function(key) {

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

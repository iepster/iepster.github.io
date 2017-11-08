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
            .innerRadius(_var.radius - (_var.previousYear ? 35 : 25));

          // Get angles
          if(_var.avgReference != null && _var.avgReference != false && !isNaN(_var.avgReference)) {
            var obj = _var.pie([{ id: 'average', name: "Average", value: +_var.avgReference }, { value: 100 - +_var.avgReference }])[0];
            obj.angleRad = obj.endAngle;
            obj.angle = obj.endAngle * 180 / Math.PI;
            obj.startAngle = obj.endAngle - 0.015;
            obj.endAngle = obj.endAngle + 0.015;
            var data = [obj];
          } else { var data = []; }

          // Update average path
          var avgPath = container.selectAll('.avg-path').data(data);
          avgPath.exit().remove();
          avgPath = avgPath.enter().append("path").attr("class", 'avg-path').merge(avgPath);
          avgPath.attr('d', _var.arc)

          // Set arc radius
          _var.arc
            .outerRadius(_var.radius)
            .innerRadius(_var.radius - 12)

          // Get angles
          if(_var.avgReference != null && _var.avgReference != false && !isNaN(_var.avgReference)) {
            var obj = _var.pie([{ id: 'average', name: "Average", value: +_var.avgReference }, { value: 100 - +_var.avgReference }])[0];
            obj.angleRad = obj.endAngle;
            obj.angle = obj.endAngle * 180 / Math.PI;
            obj.startAngle = obj.endAngle - 0.25;
            obj.endAngle = obj.endAngle + 0.25;
            var data = [obj];
          } else { var data = []; }


          // Create current and previous year arc
          var avgPathArc = container.selectAll(".avg-path-arc").data(data);
          avgPathArc.exit().remove();
          avgPathArc = avgPathArc.enter().append("path").attr("class", "avg-path-arc").merge(avgPathArc);
          avgPathArc.attr('d', _var.arc)

          // Set arc radius
          _var.arc
            .outerRadius(_var.radius - 1)
            .innerRadius(_var.radius - 11)

          // Set text group
          var avgTextGroup = container.selectAll('.avg-text-g').data(data);
          avgTextGroup.exit().remove();
          avgTextGroup = avgTextGroup.enter().append("g").attr("class", 'avg-text-g').merge(avgTextGroup);
          avgTextGroup
            .attr('transform', function(d) { return 'translate(' + _var.arc.centroid(d) + ")"; })
            .each(function(e) {

            // Update average label
            var avgText = d3.select(this).selectAll('.avg-text').data(data);
            avgText.exit().remove();
            avgText = avgText.enter().append("text").attr("class", 'avg-text').merge(avgText);
            avgText
              .attr('text-anchor', 'middle')
              .attr('dy', '0.3em')
              .attr('transform', function(d) { return 'rotate('+d.angle+')'; })
              .text(function(d) { return shared.helpers.number.localePercent(+d.value); });

          });

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

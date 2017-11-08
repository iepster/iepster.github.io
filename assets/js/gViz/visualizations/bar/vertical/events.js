// Imports
var d3 = require("d3");
var shared = require("../../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var      = undefined;
  var animation = 900;
  var action    = "mouseover";
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

          switch (action) {

            case 'mouseover':

              // Get selection
              var nodeSel = d3.select(nodeObj);

              // Fade other groups
              _var.g.selectAll(".element-group").style('opacity', function(g) { return g == node ? 1 : 0.3; });

              // Show group-bg-rect
              nodeSel.selectAll("rect.group-bg-rect").style('fill-opacity', 0.2)

              // Labels
              var max = d3.max(node.values.map(function(d) { return +d.value; }));
              var min = d3.min(node.values.map(function(d) { return +d.value; }));
              var labelsArray = [];
              var paddingInner = (_var.x.bandwidth() * _var.x.paddingInner()/2);

              // Get previous and current year values
              node.values.forEach(function(d) {

                // Store previous and current years
                labelsArray.push({
                  id: d.id, value: shared.helpers.number.localePercent(d.value),
                  x: node.values.length === 1 ? _var.x.bandwidth()/2 : (_var.xIn(d.id) + (d.id === 'previousYear' ? _var.xIn.bandwidth() - paddingInner : paddingInner)),
                  y: _var.height-10,
                  anchor: d.id === 'previousYear' ? 'end' : (node.values.length === 1 ? 'middle' : 'start' )
                });

              });

              // Year over Year
              if(_var.yearOYear && node.values.length > 1) {
                var yoyValue = shared.helpers.number.localePercent(node.values[1].value - node.values[0].value);
                labelsArray.push({ id: 'yearOYear', value: yoyValue , x: _var.x.bandwidth()/2, y: _var.y(max) + (_var.y(min) - _var.y(max))/2 , anchor: 'middle' });
              }

              // Mean
              if(node.values.length > 1) {
                var meanValue = shared.helpers.number.localePercent(d3.mean(node.values, function(d) { return d.value; }));
                labelsArray.push({id:'mean', value: meanValue, x: _var.x.bandwidth()/2, y: 20, anchor:'middle'});
              }

              // X Axis
              labelsArray.push({ id:'name', value: node.name, x: _var.x.bandwidth()/2, y: _var.height + 17, anchor:'middle' });

              // Draw Labels
              var labels = nodeSel.selectAll("text.label").data(labelsArray, function(d) { return d.id; });
              labels.exit().remove();
              labels = labels.enter().append('text').attr("class", "label").merge(labels);
              labels
                .attr('x', function(d) { return d.x; })
                .attr('y', function(d) { return d.y; })
                .attr('dy', 0.3)
                .attr('text-anchor', function(d) { return d.anchor; })
                .text(function(d) { return d.value; })

              // Hide all axis names
              _var.x_axis.selectAll(".tick text").style('display','none');

              break;

            case 'mouseout':

              // Get selection
              var nodeSel = d3.select(nodeObj);

              // Reset groups opacity
              _var.g.selectAll(".element-group").style('opacity', 1);

              // Reset group-bg-rects opacity
              nodeSel.selectAll("rect.group-bg-rect").style('fill-opacity', 0);

              // Remove labels
              nodeSel.selectAll("text.label").remove();

              // Show all axis names
              _var.x_axis.selectAll(".tick text").style('display','block');

              break;

          }
         break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','animation','action','nodeObj','node'].forEach(function(key) {

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

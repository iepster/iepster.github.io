// Imports
var d3 = require("d3");
var shared = require("../../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var      = undefined;
  var animation = 900;
  var nodeObj   = null;
  var nodeIndex = 0;
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

          // Trim id
          node.id = node.id.trim();

          // Get parent selection
          var nodeSel = d3.select(nodeObj);
          var barWidth = _var.xIn.bandwidth() > 40 ? 40 : _var.xIn.bandwidth();

          // Update bar
          var bar = nodeSel.selectAll('.bar.element').data(node.values, function (d) { return d.id; });
          bar.exit().remove();
          bar = bar.enter().append("rect").attr("class", 'bar element').attr('height', 0).attr('y', _var.height).merge(bar);
          bar
            .attr('data-year', function(d) { return d.id; })
            .attr('x', function(d) { return _var.xIn(d.id) + _var.xIn.bandwidth()/2 - barWidth/2; })
            .attr('width', barWidth)
            .style('fill', function (d) { return `url(#${node.id}-${d.id})`; })
            .transition().duration(animation)
              .attr('y', function(d) { return _var.y(+d.value); })
              .attr('height', function(d) { return _var.height - _var.y(+d.value); })

          // Create gradient for each bar
          bar.each(function(b) {

            // Update gradients
            var grad = _var.wrap.selectAll(`#${node.id}-${b.id}.grad`).data([b], function (d) { return `${node.id}-${d.id}`; });
            grad.exit().remove();
            grad = grad.enter().append("linearGradient").attr('id', function(d) { return `${node.id}-${d.id}`; }).attr("class", 'grad').merge(grad);
            grad
              .attr("gradientUnits", "userSpaceOnUse")
              .attr("x1", function(d) { return _var.x(node.id); })
              .attr("y1", function(d) { return _var.y(+b.value); })
              .attr("x2", function(d) { return _var.x(node.id); })
              .attr("y2", function(d) { return _var.height; })
              .each(function(g) {

                // Update gradient stops
                var stop = d3.select(this).selectAll(`stop`).data(node.colors);
                stop.exit().remove();
                stop = stop.enter().append("stop").merge(stop);
                stop
                  .attr("offset", function(d) { return d.offset; })
                  .attr("stop-color", function(d) { return d.color; });

              });
          });

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','animation','nodeObj','nodeIndex','node'].forEach(function(key) {

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

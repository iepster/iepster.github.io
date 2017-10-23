// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var       = null;
  var animation  = 900;
  var components = {};
  var nodeObj    = null;
  var nodeIndex  = 0;
  var node       = null;

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

          // Get parent selection
          var nodeSel = d3.select(nodeObj);

          // Draw bars
          var bars = nodeSel.selectAll("rect.bar").data(node.y != null && !isNaN(+node.y) ? [node] : [], function(d) { return d.id; });
          bars.exit().remove();
          bars = bars.enter().append('rect').attr("class", "bar").merge(bars);
          bars
            .style('fill', function(d) { return "url(#gradient-" + shared.helpers.text.removeSpecial(d.id) + ")"; })
            .attr("x", 0)
            .attr('width', _var.barWidth)
            .attr('y', function(d) { return _var.getY(+d.y) + (_var.barWidth/2) * (+d.ybar > 0 ? -1 : 1); })
            .attr('height', function(d) { return _var.getHeight(+d.y) + _var.barWidth * (+d.ybar > 0 ? 1 : -1); })
            .each(function(g) {

              // Set gradient variables
              var fill = +g.y >= 0 ? 'fill' : 'gradient';
              var gradient = +g.y >= 0 ? 'gradient' : 'fill';

              // Set bars gradient
              shared.visualComponents.gradient()
                ._var(_var)
                .id("gradient-"+g.id)
                .colors([
                  { offset:"0%", color: g[fill] == null ? "#666" : g[fill] },
                  { offset:"100%", color: g[gradient] == null ? "#bbb" : g[gradient] }
                ])
                .direction('vertical')
                .gType('linear')
                .wrap(_var.defs)
                .run();

            });

          // Update Symbols
          var symbol = nodeSel.selectAll('.symbol.element').data([node,node]);
          symbol.exit().remove();
          symbol = symbol.enter().append("path").attr("class", 'symbol element').attr("d", "").style("opacity", 0).merge(symbol);
          symbol
            .transition()
            .style("opacity", 1)
            .attr("d", function(e, i) {
              var d = i === 0 ? _var.getY(+node.y) : (_var.getY(+node.y) + _var.getHeight(+node.y) - _var.barWidth);
              var x = _var.barWidth/2;
              return "M " + (x) + " " + (d) +
                     "L " + (x + _var.barWidth/2) + " " + (d + _var.barWidth/2) +
                     "L " + (x) + " " + (d + _var.barWidth) +
                     "L " + (x - _var.barWidth/2) + " " + (d + _var.barWidth/2) +
                     "Z ";
            })
            .style('fill', node.stroke == null ? "#333" : node.stroke)

          // Set symbol on the bottom
          symbol.classed('symbol-b', function(d, i) { return i !== 0; })

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','animation','components','nodeObj','nodeIndex','node'].forEach(function(key) {

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

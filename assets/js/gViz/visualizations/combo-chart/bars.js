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

          // Set bar width
          _var.barWidth = _var.x.bandwidth() > 50 ? 50 : _var.x.bandwidth();

          // Draw bars
          var bars = nodeSel.selectAll("rect.bar").data(node.yBar != null && !isNaN(+node.yBar) ? [node] : [], function(d) { return d.x; });
          bars.exit().remove();
          bars = bars.enter().append('rect').attr("class", "bar").merge(bars);
          bars
            .style('fill', function(d) { return "url(#gradient-" + shared.helpers.text.removeSpecial(d.x) + ")"; })
            .attr("x", function(d) { return _var.x.bandwidth()/2 - _var.barWidth/2; })
            .attr('width', _var.barWidth)
            .attr('y', function(d) { return _var.getY(+d.yBar); })
            .attr('height', function(d) { return _var.getHeight(+d.yBar); })
            .each(function(g) {

              // Set gradient variables
              var fill = +g.yBar >= 0 ? 'fill' : 'gradient';
              var gradient = +g.yBar >= 0 ? 'gradient' : 'fill';

              // Set bars gradient
              shared.visualComponents.gradient()
                ._var(_var)
                .id("gradient-"+g.x)
                .colors([
                  { offset:"0%", color: g[fill] == null ? "#666" : g[fill] },
                  { offset:"100%", color: g[gradient] == null ? "#bbb" : g[gradient] }
                ])
                .direction('vertical')
                .gType('linear')
                .wrap(_var.defs)
                .run();

            });

          // Draw strokes
          var strokes = nodeSel.selectAll("rect.stroke").data(node.yBar != null && !isNaN(+node.yBar) ? [node] : [], function(d) { return d.x; });
          strokes.exit().remove();
          strokes = strokes.enter().append('rect').attr("class", "stroke").merge(strokes);
          strokes
            .style('fill', function(d) { return d.stroke == null ? "#333" : d.stroke; })
            .attr("x", function(d) { return _var.x.bandwidth()/2 - _var.barWidth/2; })
            .attr('width', _var.barWidth)
            .attr('y', function(d) { return _var.getY(+d.yBar) + (+d.yBar >= 0 ? 0 : _var.getHeight(+d.yBar)); })
            .attr('height', 2)

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

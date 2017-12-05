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

          // Clean wrap gradients
          shared.visualComponents.gradient()
            .action('clean')
            .run();

          // Draw bars
          var bars = nodeSel.selectAll("rect.bar").data([node], function(d) { return d.x; });
          bars.exit().remove();
          bars = bars.enter().append('rect').attr("class", "bar").merge(bars);
          bars
            .style('fill', function(d) { return "url(#gradient-" + shared.helpers.text.removeSpecial(d.x+d.y) + ")"; })
            .attr("x", function(d) { return _var.x.bandwidth()/2 - _var.barWidth/2; })
            .attr('width', _var.barWidth)
            .attr('y', function(d) { return _var.getY(d); })
            .attr('height', function(d) { return _var.getHeight(d); })
            .each(function(g) {

              // Set gradient colors
              var fillColor = +g.y >= 0 ? _var.getColor(g, 'fill') : _var.getColor(g, 'gradient');
              var gradientColor = +g.y >= 0 ? _var.getColor(g, 'gradient') : _var.getColor(g, 'fill');

              // Set bars gradient
              shared.visualComponents.gradient()
                ._var(_var)
                .id("gradient-"+shared.helpers.text.removeSpecial(g.x+g.y))
                .colors([
                  { offset:"0%", color: fillColor },
                  { offset:"100%", color: gradientColor }
                ])
                .direction('vertical')
                .gType('linear')
                .wrap(_var.defs)
                .run();

            });

          // Draw strokes
          var strokes = nodeSel.selectAll("rect.stroke").data([node], function(d) { return d.x; });
          strokes.exit().remove();
          strokes = strokes.enter().append('rect').attr("class", "stroke").merge(strokes);
          strokes
            .style('fill', function(d) { return _var.getColor(d, "stroke"); })
            .attr("x", function(d) { return _var.x.bandwidth()/2 - _var.barWidth/2; })
            .attr('width', _var.barWidth)
            .attr('y', function(d) { return _var.y(+d.y); })
            .attr('height', 2)

          // Draw bar texts
          var label = (_var.x.bandwidth() - _var.barWidth)/2 > 12 ? [node] : [];
          var barLabels = nodeSel.selectAll("text.bar-label").data(label, function(d) { return d.x; });
          barLabels.exit().remove();
          barLabels = barLabels.enter().append('text').attr("class", "bar-label").merge(barLabels);
          barLabels
            .style('fill', function(d) { return _var.getColor(d, "stroke"); })
            .attr("y", function(d) { return _var.x.bandwidth()/2 + _var.barWidth + 7; })
            .attr('x', function(d) { return -_var.y(0) + (+d.y >= 0 ? 5 : -5); })
            .attr('transform', "rotate(-90)")
            .style('font-size', "11px")
            .style('text-anchor', function(d) { return +d.y >= 0 ? "start" : "end"; })
            .text(function(d) { return d.parsedName; })
            .each(function(d) { shared.helpers.text.wrapBySize(d3.select(this), _var.height/2 - 20, 20, 1); })

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

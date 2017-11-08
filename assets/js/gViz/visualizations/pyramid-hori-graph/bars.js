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

          // Set bar height
          _var.barHeight = _var.yIn.bandwidth() > 50 ? 50 : _var.yIn.bandwidth();

          // Set bar height
          var bh = _var.data.attrs != null && _var.data.attrs.barHeight != null && !isNaN(+_var.data.attrs.barHeight) ? +_var.data.attrs.barHeight : 50;
          _var.barHeight = _var.yIn.bandwidth() > bh ? bh : _var.yIn.bandwidth();

          // Left and Right
          ["xLeft","xRight"].forEach(function(s) {

            // Draw Left bars
            var bars = nodeSel.selectAll("rect.bar."+s).data(node.values, function(d) { return d; });
            bars.exit().remove();
            bars = bars.enter().append('rect').attr("class", "bar "+s).merge(bars);
            bars
              .attr('transform', 'translate(' + (s === 'xLeft' ? 0 : _var.width/2) + ',0)')
              .style('fill', function(d) { return "url(#gradient-" + shared.helpers.text.removeSpecial(s+d[s].color+d.y) + ")"; })
              .attr("x", s === 'xLeft' ? _var.getXLeft : _var.getXRight )
              .attr("width", s === 'xLeft' ? _var.getWidthLeft : _var.getWidthRight )
              .attr('y', function(d) { return _var.yIn(d.y) + _var.yIn.bandwidth()/2 - _var.barHeight/2; })
              .attr('height', _var.barHeight)
              .each(function(g) {

                // Set gradient colors
                var fC = (s === 'xLeft' && +g[s].x >= 0) || (s === 'xRight' && +g[s].x <= 0) ? _var.getColor(g[s], 'fill') : _var.getColor(g[s], 'gradient');
                var gC = (s === 'xLeft' && +g[s].x >= 0) || (s === 'xRight' && +g[s].x <= 0) ? _var.getColor(g[s], 'gradient') : _var.getColor(g[s], 'fill');

                // Set bars gradient
                shared.visualComponents.gradient()
                  ._var(_var)
                  .id("gradient-"+shared.helpers.text.removeSpecial(s+g[s].color+g.y))
                  .colors([
                    { offset:"0%", color: fC },
                    { offset:"100%", color: gC }
                  ])
                  .direction('horizontal')
                  .gType('linear')
                  .wrap(_var.defs)
                  .run();

              });

            // Draw strokes
            var strokes = nodeSel.selectAll("rect.stroke." + s).data(node.values, function(d) { return d; });
            strokes.exit().remove();
            strokes = strokes.enter().append('rect').attr("class", "stroke "+s).merge(strokes);
            strokes
              .style('fill', function(d) { return _var.getColor(d[s], "stroke"); })
              .attr('x', function(d) { return s === 'xLeft' ? _var.xLeft(+d[s].x) : _var.width/2 + _var.xRight(+d[s].x); })
              .attr('width', 2)
              .attr("y", function(d) { return _var.yIn(d.y) + _var.yIn.bandwidth()/2 - _var.barHeight/2; })
              .attr('height', _var.barHeight)

          });


          // Draw Texts
          var texts = nodeSel.selectAll("text.y-in-text").data(node.values, function(d) { return d.y; });
          texts.exit().remove();
          texts = texts.enter().append('text').attr("class", "y-in-text").merge(texts);
          texts
            .attr("y", function(d) { return _var.yIn(d.y) + _var.yIn.bandwidth()/2 - _var.barHeight/2 - 5; })
            .attr('x', _var.width/2)
            .attr('text-anchor', 'middle')
            .transition()
              .text(function(d) { return d.name; })

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

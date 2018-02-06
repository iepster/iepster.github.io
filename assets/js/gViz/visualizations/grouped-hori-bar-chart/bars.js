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

          // Draw grouping bar
          var wrapperBars = nodeSel.selectAll("rect.wrapper-bar").data(_var.hasWrapper(node.wrap) ? [node] : [], function(d) { return d; });
          wrapperBars.exit().remove();
          wrapperBars = wrapperBars.enter().append('rect').attr("class", "wrapper-bar").merge(wrapperBars);
          wrapperBars
            .style('fill', function(d) { return "url(#gradient-" + shared.helpers.text.removeSpecial(d.x + d.y) + ")"; })
            .attr("x", _var.getX)
            .attr('width', _var.getWidth)
            .attr('y', 0)
            .attr('height', _var.y.bandwidth())
            .each(function(g) {

              // Set wrapper gradient
              shared.visualComponents.gradient()
                ._var(_var)
                .id("gradient-"+shared.helpers.text.removeSpecial(g.x+g.y))
                .colors([
                  { offset:"0%", color: _var.data.colors[g.y] == null || _var.data.colors[g.y].fill == null ? "#666" : _var.data.colors[g.y].fill },
                  { offset:"100%", color:_var.data.colors[g.y] == null || _var.data.colors[g.y].gradient == null ? "#bbb" : _var.data.colors[g.y].gradient }
                ])
                .direction('horizontal')
                .gType('linear')
                .wrap(_var.defs)
                .run();

            });

          // Draw grouping bar stroke
          var wrapperStrokes = nodeSel.selectAll("rect.wrapper-stroke").data(_var.hasWrapper(node.wrap) ? [node] : [], function(d) { return d; });
          wrapperStrokes.exit().remove();
          wrapperStrokes = wrapperStrokes.enter().append('rect').attr("class", "wrapper-stroke").merge(wrapperStrokes);
          wrapperStrokes
            .style('fill', function(d) { return _var.getColor(d, "stroke"); })
            .attr("x", function(d) { return _var.x(d.x); })
            .attr('width', 2)
            .attr('y', 0)
            .attr('height', _var.y.bandwidth())

          // Set bar width
          _var.barHeight = _var.yIn.bandwidth() > _var.barHeight ? _var.barHeight : _var.yIn.bandwidth();

          // Draw bars
          var bars = nodeSel.selectAll("rect.bar").data(node.values, function(d) { return d; });
          bars.exit().remove();
          bars = bars.enter().append('rect').attr("class", "bar").merge(bars);
          bars
            .style('fill', function(d) { return "url(#gradient-" + shared.helpers.text.removeSpecial(d.x+d.y) + ")"; })
            .attr("x", _var.getX)
            .attr('width', _var.getWidth)
            .attr('y', function(d) { return _var.yIn(d.y) + _var.yIn.bandwidth()/2 - _var.barHeight/2; })
            .attr('height', _var.barHeight)
            .each(function(g) {

              // Set gradient colors
              var fillColor = +g.x >= 0 ? _var.getColor(g, 'gradient') : _var.getColor(g, 'fill');
              var gradientColor = +g.x >= 0 ? _var.getColor(g, 'fill') : _var.getColor(g, 'gradient');

              // Set bars gradient
              shared.visualComponents.gradient()
                ._var(_var)
                .id("gradient-"+shared.helpers.text.removeSpecial(g.x+g.y))
                .colors([
                  { offset:"0%", color: fillColor },
                  { offset:"100%", color: gradientColor }
                ])
                .direction('horizontal')
                .gType('linear')
                .wrap(_var.defs)
                .run();

            });

          // Draw strokes
          var strokes = nodeSel.selectAll("rect.stroke").data(node.values, function(d) { return d; });
          strokes.exit().remove();
          strokes = strokes.enter().append('rect').attr("class", "stroke").merge(strokes);
          strokes
            .style('fill', function(d) { return _var.getColor(d, "stroke"); })
            .attr('x', function(d) { return _var.x(+d.x); })
            .attr('width', 2)
            .attr("y", function(d) { return _var.yIn(d.y) + _var.yIn.bandwidth()/2 - _var.barHeight/2; })
            .attr('height', _var.barHeight)

          // Draw axis Texts
          var textValuesObj = {};
          var textValues = node.values.filter(function(d) { var flag = textValuesObj[d.y] == null; textValuesObj[d.y] = true; return flag; });
          var texts = nodeSel.selectAll("text.x-in-text").data(((node.name == null || node.name === "") && _var.hasInnerLabels === false ? textValues : []), function(d) { return d.y; });
          texts.exit().remove();
          texts = texts.enter().append('text').attr("class", "x-in-text").merge(texts);
          texts
            .attr("y", function(d) { return _var.yIn(d.y) + _var.yIn.bandwidth()/2; })
            .attr('x', -10)
            .attr('text-anchor', 'end')
            .transition()
              .text(function(d) { return d.name; })

          // Draw inner labels (text above bars)
          var innerLabels = nodeSel.selectAll("text.y-in-text").data((_var.hasInnerLabels === true ? node.values : []), function(d) { return d.y; });
          innerLabels.exit().remove();
          innerLabels = innerLabels.enter().append('text').attr("class", "y-in-text").merge(innerLabels);
          innerLabels
            .attr("y", function(d) { return _var.yIn(d.y) + _var.yIn.bandwidth()/2 - _var.barHeight/2 - 3; })
            .attr('x', 10)
            .attr('text-anchor', 'start')
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

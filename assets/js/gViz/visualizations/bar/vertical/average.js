// Imports
var d3 = require("d3");
var shared = require("../../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var      = undefined;
  var animation = 900;

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

          // Get attrs
          var elements = _var.g.selectAll(".chart-elements");
          var mean = d3.mean(_var.data.map(function(d) { return d.mean; }));
          var s = 5;
          var rs = 8;

          // Update average reference label path
          var avgRefLabelPath = elements.selectAll('.avg-reference-label').data(_var.avgReference ? ["avg"] : []);
          avgRefLabelPath.exit().remove();
          avgRefLabelPath = avgRefLabelPath.enter().append("path").attr("class", 'avg-reference-label').merge(avgRefLabelPath);
          avgRefLabelPath
            .attr('d', `M ${-_var.margin.left+rs} ${_var.y(mean)-rs} ${-rs} ${_var.y(mean)-rs} ${0} ${_var.y(mean)} ${-rs} ${_var.y(mean)+rs} ${-_var.margin.left+rs} ${_var.y(mean)+rs} Z`)

          // Update average reference label
          var avgRefLabel = elements.selectAll('.avg-reference-label-text').data(_var.avgReference ? ["avg"] : []);
          avgRefLabel.exit().remove();
          avgRefLabel = avgRefLabel.enter().append("text").attr("class", 'avg-reference-label-text').merge(avgRefLabel);
          avgRefLabel
            .attr('x', -_var.margin.left + rs * 1.6 )
            .attr('y', _var.y(mean) + rs/2)
            .text(shared.helpers.number.localePercent(mean));

          // Update average reference
          var avgReference = elements.selectAll('.avg-reference').data(_var.avgReference ? ["avg"] : []);
          avgReference.exit().remove();
          avgReference = avgReference.enter().append("path").attr("class", 'avg-reference').attr('d', `M ${0} ${_var.y(mean)-s} ${0} ${_var.y(mean)-s} ${0} ${_var.y(mean)+s} ${0} ${_var.y(mean)+s} Z`).merge(avgReference);
          avgReference
            .transition().duration(animation)
              .attr('d', `M ${0} ${_var.y(mean)-s} ${_var.width} ${_var.y(mean)-s} ${_var.width} ${_var.y(mean)+s} ${0} ${_var.y(mean)+s} Z`)
              .attr("fill", "url(#average-line-reference)")

          // Gradient data
          var data = [
            { offset: "0%", color: "rgba(255,255,255,0)" },
            { offset: "50%", color: "rgba(255,255,255,.7)" },
            { offset: "100%", color: "rgba(255,255,255,0)" }
          ]

          // Update gradients
          var grad = _var.wrap.selectAll(`#average-line-reference.grad`).data(_var.avgReference ? ["avg"] : []);
          grad.exit().remove();
          grad = grad.enter().append("linearGradient").attr('id', 'average-line-reference').attr("class", 'grad').merge(grad);
          grad
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", _var.y(mean) - s)
            .attr("x2", 0)
            .attr("y2", _var.y(mean) + s)
            .each(function(g) {

              // Update gradient stops
              var stop = d3.select(this).selectAll(`stop`).data(data);
              stop.exit().remove();
              stop = stop.enter().append("stop").merge(stop);
              stop
                .attr("offset", function(d) { return d.offset; })
                .attr("stop-color", function(d) { return d.color; });

            });

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','animation'].forEach(function(key) {

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

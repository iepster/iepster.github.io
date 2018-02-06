// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var      = undefined;
  var animation = 900;
  var components = {};

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

          // Get outer wrapper
          var outerWrapper = _var.container.d3.closest('.gViz-outer-wrapper');

          // Set margin left and display style
          outerWrapper.select('.legend-wrapper, .legend-wrapper-full')
            .style('display', _var.data == null || _var.data.legend == null || _var.data.legend.isVisible == null || _var.data.legend.isVisible === true ? 'block' : 'none')

          // Set scale for heat
          var scaleWrapper = outerWrapper.select('.legend-wrapper, .legend-wrapper-full').select('.scale-wrapper')

          // Empty scale wrapper
          scaleWrapper.html('');

          // Draw low scale text
          var lowText = scaleWrapper.selectAll(".low-name").data(["Low"]);
          lowText.exit().remove();
          lowText = lowText.enter().append('span').attr("class", "low-name").merge(lowText);
          lowText
            .style('float', 'left')
            .style('margin-right', '10px')
            .text(function(d) { return d; })

          // Draw scale rect for heat mode
          var scaleRectHeat = scaleWrapper.selectAll(".scale-rect-heat").data(_var.mode.heat === true ? [true] : []);
          scaleRectHeat.exit().remove();
          scaleRectHeat = scaleRectHeat.enter().append('span').attr("class", "scale-rect-heat").merge(scaleRectHeat);
          scaleRectHeat
            .style('float', 'left')
            .style('width', '15px')
            .style('height', '10px')
            .style('background', "linear-gradient(to right, "+_var.heatColors.join(',')+")")

          // Draw scale rects for bars mode
          var scaleRectBars = scaleWrapper.selectAll(".scale-rect-bars").data(_var.mode.bars === true ? _var.barsColors : []);
          scaleRectBars.exit().remove();
          scaleRectBars = scaleRectBars.enter().append('span').attr("class", "scale-rect-bars").merge(scaleRectBars);
          scaleRectBars
            .style('float', 'left')
            .style('width', '3px')
            .style('height', function(d,i) { return (4 + i*(6 / (_var.barsColors.length-1))) + 'px'; })
            .style('margin-top', function(d,i) { return (6 - i*(6 / (_var.barsColors.length-1))) + 'px'; })
            .style('margin-left', function(d, i) { return i === 0 ? '0px' : '2px'; })
            .style('background', function(d) { return d; })

          // Draw high scale text
          var highText = scaleWrapper.selectAll(".high-name").data(["High"]);
          highText.exit().remove();
          highText = highText.enter().append('span').attr("class", "high-name").merge(highText);
          highText
            .style('float', 'left')
            .style('margin-left', '10px')
            .text(function(d) { return d; })


          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','animation','components'].forEach(function(key) {

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

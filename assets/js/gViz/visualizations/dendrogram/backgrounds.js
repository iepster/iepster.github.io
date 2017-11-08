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
  var data      = ["bg"];
  var radius    = null;

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

          // Update gradients
          var bg = container.selectAll(`path.bg`).data(data);
          bg.exit().remove();
          bg = bg.enter().insert('path',':first-child').attr("class", 'bg').merge(bg);
          bg
            .style('fill', 'transparent')
            .attr('d', function(d) {
              var cx = 0, cy = 0, r = radius;
              return `M ${cx} ${cy} m ${-r}, 0 a ${r},${r} 0 1,0 ${(r * 2)},0 a ${r},${r} 0 1,0 ${-(r * 2)},0`;
            });

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','animation','container','data','radius'].forEach(function(key) {

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

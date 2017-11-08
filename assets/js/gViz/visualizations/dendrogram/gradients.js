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
  var id        = 'gradientID';
  var gData     = [];
  var type      = 'linearGradient';
  var x1        = 0;
  var y1        = 0;
  var x2        = 0;
  var y2        = 0;

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
          id = id.trim();

          // Update gradients
          var grad = container.selectAll(`#${id}`).data(gData);
          grad.exit().remove();
          grad = grad.enter().insert(type, ":first-child").attr('id', id).attr("class", 'grad').merge(grad);
          grad
            .each(function(g) {

              // Update gradient stops
              var stop = d3.select(this).selectAll(`stop`).data(g.colors);
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
  ['_var','animation','container','id','gData','type','x1','y1','x2','y2'].forEach(function(key) {

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

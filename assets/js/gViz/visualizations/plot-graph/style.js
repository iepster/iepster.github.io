// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var      = undefined;
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

          // Get color function
          _var.setColor = function(d) {

            if(d.colorType === 'image') {

              // Set image background
              shared.visualComponents.image()
                ._var(_var)
                .id("gradient-circle-bg-"+shared.helpers.text.removeSpecial(d.id))
                .imageUrl(d.img)
                .wrap(_var.defs)
                .run();

            } else if (d.colorType === 'gradient') {

              // Set gradient background
              shared.visualComponents.gradient()
                ._var(_var)
                .id("gradient-circle-bg-"+shared.helpers.text.removeSpecial(d.id))
                .colors([
                  { offset:"0%",   color: d.color[0] },
                  { offset:"49%",  color: d.color[0] },
                  { offset:"50%",  color: d.color[1] },
                  { offset:"100%", color: d.color[1] }
                ])
                .direction('horizontal')
                .gType('linear')
                .wrap(_var.defs)
                .run();

            }
          }

          // Get color function
          _var.getColor = function(d) {
            if(d.colorType === 'image') {
              return "url(#gradient-circle-bg-"+shared.helpers.text.removeSpecial(d.parentId)+")";
            } else if (d.colorType === 'gradient') {
              return "url(#gradient-circle-bg-"+shared.helpers.text.removeSpecial(d.parentId)+")";
            } else {
              return d.fadeColor != null ? d.fadeColor : d.color;
            }
          }


          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','components'].forEach(function(key) {

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

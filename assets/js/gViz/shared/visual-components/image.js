// Imports
var d3 = require("d3");
var helpers = require("../helpers/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var       = undefined;
  var id         = `vis-image-${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`;
  var action     = 'draw';
  var height     = 100;
  var imageUrl   = 'http://d2trtkcohkrm90.cloudfront.net/images/emoji/apple/ios-10/256/beer-mug.png';
  var wrap       = null;
  var width      = 100;

  // Validate attributes
  var validate = function(step) {
    switch (step) {
      case 'run': return wrap != null;
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

          switch (action) {

            case 'draw':

              // Remove special chars from id
              id = helpers.text.removeSpecial(id);

              // Update patterns
              var pattern = wrap.selectAll(`#${id}.image-pattern`).data([id]);
              pattern.exit().remove();
              pattern = pattern.enter().append("pattern").attr('id', function(d) { return `${id}`; }).attr("class", 'image-pattern').merge(pattern);
              pattern
                .attr("x", "0%")
                .attr("y", "0%")
                .attr("height", "100%")
                .attr("width", "100%")
                .attr("viewBox", "0 0 "+width+" "+height)
                .each(function(g) {

                  // Update pattern images
                  var image = d3.select(this).selectAll(`image`).data([imageUrl]);
                  image.exit().remove();
                  image = image.enter().append("image").merge(image);
                  image
                    .attr("x", "0%")
                    .attr("y", "0%")
                    .attr("height", height)
                    .attr("width", width)
                    .attr("xlink:href", imageUrl)

                });

              break;

            case 'clean':

              // Clean all gradients from wrap
              wrap.selectAll('.grad').remove();

              break;

          }
          break;
      }
    }
  };

  // Exposicao de variaveis globais
  ['_var','id','action','height', 'imageUrl','width','wrap'].forEach(function(key) {

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

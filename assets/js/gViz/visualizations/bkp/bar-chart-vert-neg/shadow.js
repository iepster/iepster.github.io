// Imports
let d3 = require("d3");
var shared = require("../../shared/_init.js");

// Module declaration
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;

  // Validate attributes
  var validate = function validate(step) {

    switch (step) {
      case 'run':
        return true;
      default:
        return false;
    }
  };

  // Main function
  var main = function main(step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'run':

          // Create/Update defs
          var defs = _var.wrap.selectAll("defs.shadow-defs").data(["shadow-defs"]);
          defs.exit().remove();
          defs = defs.enter().insert('defs',':first-child').attr("class", "shadow-defs").merge(defs);
          defs.each(function() {

            // Create filter with id #drop-shadow
            // height=130% so that the shadow is not clipped
            var filter = d3.select(this).selectAll(".shadow-filter").data(["shadow-filter"]);
            filter.exit().remove();
            filter = filter.enter().append('filter').attr("class", "shadow-filter").merge(filter);
            filter
              .attr("id", "drop-shadow")
              .attr("height", "1.5")
              .attr("width", "2")
              .attr("x", "-.55")
              .attr("y", "-.25")
              .each(function() {

                // SourceAlpha refers to opacity of graphic that this filter will be applied to
                // convolve that with a Gaussian with standard deviation 3 and store result
                // in blur
                var feGaussianBlur = d3.select(this).selectAll(".shadow-feGaussianBlur").data(["shadow-feGaussianBlur"]);
                feGaussianBlur.exit().remove();
                feGaussianBlur = feGaussianBlur.enter().append('feGaussianBlur').attr("class", "shadow-feGaussianBlur").merge(feGaussianBlur);
                feGaussianBlur
                  .attr("in", "SourceAlpha")
                  .attr("stdDeviation", 2.5)
                  .attr("result", "blur");

                // Source matrix
                var feColorMatrix = d3.select(this).selectAll(".shadow-feColorMatrix").data(["shadow-feColorMatrix"]);
                feColorMatrix.exit().remove();
                feColorMatrix = feColorMatrix.enter().append('feColorMatrix').attr("class", "shadow-feColorMatrix").merge(feColorMatrix);
                feColorMatrix
                  .attr("result", "bluralpha")
                  .attr("type", "matrix")
                  .attr("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.7 0 ")


                // Translate output of Gaussian blur to the right and downwards with 2px
                // store result in offsetBlur
                var feOffset = d3.select(this).selectAll(".shadow-feOffset").data(["shadow-feOffset"]);
                feOffset.exit().remove();
                feOffset = feOffset.enter().append('feOffset').attr("class", "shadow-feOffset").merge(feOffset);
                feOffset
                  .attr("in", "bluralpha")
                  .attr("dx", -1.55)
                  .attr("dy", 2)
                  .attr("result", "offsetBlur");

                // Overlay original SourceGraphic over translated blurred opacity by using
                // feMerge filter. Order of specifying inputs is important!
                var feMerge = d3.select(this).selectAll(".shadow-feMerge").data(["shadow-feMerge"]);
                feMerge.exit().remove();
                feMerge = feMerge.enter().append('feMerge').attr("class", "shadow-feMerge").merge(feMerge);
                feMerge.each(function() {

                  // Merge node 1
                  var feMergeNode1 = d3.select(this).selectAll(".shadow-feMergeNode1").data(["shadow-feMergeNode1"]);
                  feMergeNode1.exit().remove();
                  feMergeNode1 = feMergeNode1.enter().append('feMergeNode').attr("class", "shadow-feMergeNode1").merge(feMergeNode1);
                  feMergeNode1.attr("in", "offsetBlur");

                  // Merge node 2
                  var feMergeNode2 = d3.select(this).selectAll(".shadow-feMergeNode2").data(["shadow-feMergeNode2"]);
                  feMergeNode2.exit().remove();
                  feMergeNode2 = feMergeNode2.enter().append('feMergeNode').attr("class", "shadow-feMergeNode2").merge(feMergeNode2);
                  feMergeNode2.attr("in", "SourceGraphic");

                });
              });
          });


          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var'].forEach(function (key) {

    // Attach variables to validation function
    validate[key] = function (_) {
      if (!arguments.length) {
        eval('return ' + key);
      }
      eval(key + ' = _');
      return validate;
    };

    // Attach variables to main function
    return main[key] = function (_) {
      if (!arguments.length) {
        eval('return ' + key);
      }
      eval(key + ' = _');
      return main;
    };
  });

  // Executa a funcao chamando o parametro de step
  main.run = function (_) {
    return main('run');
  };

  return main;
};

function __range__(left, right, inclusive) {
  var range = [];
  var ascending = left < right;
  var end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) { range.push(i); }
  return range;
}

// Imports
let d3 = require("d3");
var shared = require("../../shared/_init.js");

// Module declaration
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var action = 'create';

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

          switch (action) {

            case 'create':

              // Create and Update ytarget line
              var yTarget = _var.g.selectAll(".target.y-target").data(_var.yTarget == null ? [] : [_var.yTarget]);
              yTarget.exit().remove();
              yTarget = yTarget.enter().append('line').attr("class", "target y-target").merge(yTarget);
              yTarget
                .attr("x1", -5)
                .attr("y1", _var.y(_var.yTarget))
                .attr("x2", _var.width)
                .attr("y2", _var.y(_var.yTarget));

              // Create and Update yTarget text
              var yTargetText = _var.g.selectAll(".target-text.y-target").data(_var.yTarget == null ? [] : [_var.yTarget]);
              yTargetText.exit().remove();
              yTargetText = yTargetText.enter().append('text').attr("class", "target-text y-target").merge(yTargetText);
              yTargetText
                .style("font-size", '10px')
                .attr("text-anchor", 'end')
                .attr("x", -10)
                .attr("y", _var.y(_var.yTarget) + 0.5)
                .attr("dy", "0.32em")
                .text(_var.yFormat(_var.yTarget))

              // Create and Update xtarget lines
              var xTarget = _var.g.selectAll(".target.x-target").data(_var.xTarget == null ? [] : [_var.xTarget]);
              xTarget.exit().remove();
              xTarget = xTarget.enter().append('line').attr("class", "target x-target").merge(xTarget);
              xTarget
                .attr("x1", _var.x(_var.xTarget))
                .attr("x2", _var.x(_var.xTarget))
                .attr("y2", _var.height + 5);

              break;
          }
          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'action'].forEach(function (key) {

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

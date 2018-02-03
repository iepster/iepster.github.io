// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var       = undefined;
  var action     = "show";
  var content    = "<p class='title'>Hi, I am a Title.</p><p class='text'>Hi, I am a content.</p>";
  var left       = 0;
  var top        = 0;
  var borderColor = "#333";

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

          switch (action) {

            // Build entire visualizations
            case 'show':

              // Update tooltip content
              var tooltip = d3.selectAll('.gViz-tooltip').data(["gViz-tooltip"]);
              tooltip.exit().remove();
              tooltip = tooltip.enter().append("div").attr("class", 'gViz-tooltip').merge(tooltip);
              tooltip
                .style("opacity", 0)
                .each(function() {

                  // Update tooltip content
                  var ctn = d3.select(this).selectAll('.content').data(["gViz-content"]);
                  ctn.exit().remove();
                  ctn = ctn.enter().append("div").attr("class", 'content').merge(ctn);
                  ctn
                    .style("border", "1px solid "+borderColor)
                    .html(content);

                  // Update tooltip content
                  var arrow = d3.select(this).selectAll('.arrow').data(["gViz-arrow"]);
                  arrow.exit().remove();
                  arrow = arrow.enter().append("div").attr("class", 'arrow').merge(arrow);
                  arrow
                    .style("color", borderColor)
                    .html("<span>▼</span>");

                });

                // Update tooltip position
                tooltip.transition().delay(100)
                  .on("end", function() {
                    d3.select(this)
                      .style("left", function() { return (left - this.getBoundingClientRect().width/2) + "px"; })
                      .style("top", function() { return (top - (this.getBoundingClientRect().height)) + "px"; })
                      .transition().duration(500)
                        .style("opacity", 1);
                  })

              break;

            // Build entire visualizations
            case 'hide':

              // Update tooltip content
              var tooltip = d3.selectAll('.gViz-tooltip').data(["gViz-tooltip"]);
              tooltip.exit().remove();
              tooltip = tooltip.enter().append("div").attr("class", 'gViz-tooltip').merge(tooltip);
              tooltip.transition().duration(250).style("opacity", 0).remove()

              break;

          }

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','action','content','left','top','borderColor'].forEach(function(key) {

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

// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var       = null;
  var animation  = 750;
  var action     = 'draw';
  var components = null;
  var nodes      = null;
  var links      = null;
  var source     = null;

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
            case 'draw':

              // Create a shared transition for anything we're animating
              var t = d3.transition()
                .duration(2000)
                .ease(d3.easeLinear);

              // Clip path for links
              var clipPath = _var.g.selectAll(`#clip-${_var._id}`).data(["chart-clipPath"]);
              clipPath.exit().remove();
              clipPath = clipPath.enter().append("clipPath").attr("id", `clip-${_var._id}`).merge(clipPath);
              clipPath.each(function(d) {

                // Clip rect
                var clipRect = d3.select(this).selectAll('.clip-rect').data(["chart-clipRect"]);
                clipRect.exit().remove();
                clipRect = clipRect.enter().append("rect").attr("class", `clip-rect`).merge(clipRect);
                clipRect.attr('x', 0).attr('y', 0).attr('width', 0).attr('height', _var.height)

              });

              // Update the links...
              var link = _var.g.selectAll('path.link').data(links, function (d) { return d.id; });

              // Enter any new links at the parent's previous position.
              var linkEnter = link.enter().insert('path', "g")
                .attr("class", "link")
                .attr('d', function (d) {
                  var o = { x: source.x0, y: source.y0, bbox: source.bbox, depth: source.depth };
                  return _var.diagonal(o,o);
                });

              // UPDATE
              var linkUpdate = linkEnter.merge(link);

              // Transition back to the parent element position
              linkUpdate
                .attr('d', function (d) { return _var.diagonal(d, d.parent); })
                .attr("clip-path", `url(#clip-${_var._id}`);

              // Remove any exiting links
              link.exit().remove()

              // Animate links
              d3.selectAll(`#clip-${_var._id} .clip-rect`).transition(t)
                .attr("width", function (d) { return _var.width; });

            break
          }
        break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','animation','components','action','links','nodes','source'].forEach(function(key) {

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

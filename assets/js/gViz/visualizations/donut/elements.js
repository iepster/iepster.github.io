// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var animation = 900;
  var components = null;

  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run': return true;
      default: return false;
    }
  };

  // Main function
  var main = function (step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'run':

          // Element canvas
          var elements = _var.g.selectAll(".chart-elements").data(["chart-elements"]);
          elements.exit().remove();
          elements = elements.enter().append("g").attr("class", "chart-elements").merge(elements);

          // Create current and previous year groups
          var groups = elements.selectAll(".element-group").data(_var.pieData.filter(function(d) { return _var[d.id]; }), function (d) { return d.id; });
          groups.exit().remove();
          groups = groups.enter().append("g").attr("class", "element-group").merge(groups);

          // For each element in group
          groups.each(function (e, i) {

            // Set arcs component
            components.arcs()
              ._var(_var)
              .components(components)
              .nodeObj(this)
              .node(e)
              .run();

            // Set labels
            components.labels()
              ._var(_var)
              .components(components)
              .nodeObj(this)
              .node(e)
              .run();

          });

          // Set average component
          components.average()
            ._var(_var)
            .container(elements)
            .run();

          // Set year over year component
          components.yearOYear()
            ._var(_var)
            .container(elements)
            .run();

          // Draw Background rect
          var bg_rect = _var.g.selectAll("rect.bg-rect").data(["bg-rect"]);
          bg_rect.exit().remove();
          bg_rect = bg_rect.enter().insert('rect', ':first-child').attr("class", "bg-rect").merge(bg_rect);
          bg_rect.attr("x", -_var.width).attr('y', -_var.height).attr('width', 2*_var.width).attr("height", 2*_var.height);

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'animation','components'].forEach(function (key) {

    // Attach variables to validation function
    validate[key] = function (_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return validate;
    };

    // Attach variables to main function
    return main[key] = function (_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return main;
    };
  });

  // Executa a funcao chamando o parametro de step
  main.run = _ => main('run');

  return main;
};

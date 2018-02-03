// Imports
var d3 = require("d3");
var shared = require("../../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var      = undefined;
  var animation = 900;
  var components = null;

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

          // Element canvas
          var elements = _var.g.selectAll(".chart-elements").data(["chart-elements"]);
          elements.exit().remove();
          elements = elements.enter().append("g").attr("class", "chart-elements").merge(elements);

          // Create line/area groups
          var groups = elements.selectAll(".element-group").data(_var.data, function (d) { return d.id; });
          groups.exit().remove();
          groups = groups.enter().append("g").attr("class", "element-group").merge(groups);

          // For each element in group
          groups
            .attr("transform", function(d) { return `translate(${_var.x(d.id)},0)`; })
            .each(function (e, i) {

              // Draw Background rect for groups
              var paddingInner = (_var.x.bandwidth() * _var.x.paddingInner()/2);
              var gbg_rect = d3.select(this).selectAll("rect.group-bg-rect").data(["group-bg-rect"]);
              gbg_rect.exit().remove();
              gbg_rect = gbg_rect.enter().insert('rect', ':first-child').attr("class", "group-bg-rect").merge(gbg_rect);
              gbg_rect
                .attr("x", -paddingInner )
                .attr('y', 0)
                .attr('width', _var.x.bandwidth() + paddingInner*2)
                .attr("height", _var.height);

              // Set bars component
              components.bars()
                ._var(_var)
                .nodeObj(this)
                .node(e)
                .nodeIndex(i)
                .run();

              // Set year over year component
              components.yearOYear()
                ._var(_var)
                .nodeObj(this)
                .node(e)
                .run();

          });

          // Set average component
          components.average()
            ._var(_var)
            .run();

          // Draw Background rect
          var bg_rect = _var.g.selectAll("rect.bg-rect").data(["bg-rect"]);
          bg_rect.exit().remove();
          bg_rect = bg_rect.enter().insert('rect', ':first-child').attr("class", "bg-rect").merge(bg_rect);
          bg_rect.attr("x", 0).attr('y', 0).attr('width', _var.width).attr("height", _var.height);

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

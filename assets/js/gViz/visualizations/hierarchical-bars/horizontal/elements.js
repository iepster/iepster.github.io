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
          var outGroups = elements.selectAll(".element-outer-group").data(_var.data, function (d) { return d.id; });
          outGroups.exit().remove();
          outGroups = outGroups.enter().append("g").attr("class", "element-outer-group").merge(outGroups);

          // For each group in outer group
          outGroups
            .attr("transform", function(d, i) { return `translate(${_var.offset},${_var.xOut(d.id)})`; })
            .each(function (o) {

              // Draw group name
              var labels = d3.select(this).selectAll("text.name").data([o], function(d) { return d.id; });
              labels.exit().remove();
              labels = labels.enter().append('text').attr("class", "name").merge(labels);
              labels
                .attr('x', -_var.offset/2 - 20)
                .attr('y', _var.axesSize / 2)
                .attr('text-anchor', 'middle')
                .each(function(t) {

                  // Tspans
                  d3.select(this).selectAll("tspan.name").remove();
                  var tspans = d3.select(this).selectAll("tspan.name").data(t.name.split(" "));
                  tspans.exit().remove();
                  tspans = tspans.enter().append('tspan').attr("class", "name").merge(tspans);
                  tspans
                    .attr('dy', function(d,i) { return 15 * i; })
                    .attr('x', -_var.offset/2 - 20)
                    .text(function(d) { return d; });

                });

              // Create line/area groups
              var groups = d3.select(this).selectAll(".element-group").data(o.children, function (d) { return d.id; });
              groups.exit().remove();
              groups = groups.enter().append("g").attr("class", "element-group").merge(groups);

              // For each element in group
              groups
                .attr("transform", function(d) { return `translate(0,${_var.x(d.id)})`; })
                .each(function (e, i) {

                  // Draw Background rect for groups
                  var paddingInner = (_var.x.bandwidth() * _var.x.paddingInner()/2);
                  var gbg_rect = d3.select(this).selectAll("rect.group-bg-rect").data(["group-bg-rect"]);
                  gbg_rect.exit().remove();
                  gbg_rect = gbg_rect.enter().insert('rect', ':first-child').attr("class", "group-bg-rect").merge(gbg_rect);
                  gbg_rect.attr("y", i === _var.data.length-1 ? 0 : -paddingInner ).attr('x', 0)
                    .attr('height', _var.x.bandwidth() + (i === _var.data.length-1 || i === 0 ? paddingInner : paddingInner*2))
                    .attr('width', _var.width - _var.offset)

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
          });

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

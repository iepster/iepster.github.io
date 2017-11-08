// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = null;
  var components = null;
  var parent = null;

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

          // Draw Background rect
          var bg_rect = _var.gB.selectAll("rect.bg-rect").data(["bg-rect"]);
          bg_rect.exit().remove();
          bg_rect = bg_rect.enter().insert('rect', ':first-child').attr("class", "bg-rect").style('fill', '#ccc').merge(bg_rect);
          bg_rect.style('fill', '#ccc').attr("x", 0).attr('y', 0).attr('width', _var.brushAttrs.width).attr("height", _var.brushAttrs.totalHeight);

          // Draw brush rect
          var brushRect = _var.gB.selectAll("rect.brush-rect").data(["brush-rect"]);
          brushRect.exit().remove();
          brushRect = brushRect.enter().append('rect').attr("class", "brush-rect").style('fill', '#FFF').merge(brushRect);
          brushRect.style('fill', '#FFF').attr("x", 1).attr('y', 1).attr('width', _var.brushAttrs.width-2).attr("height", _var.brushAttrs.height);

          // Add cells
          var cells = _var.gB.selectAll("g.node").data(_var.brushAttrs.hRoot.descendants().filter(function(d) { return d.depth !== 0; }));
          cells.exit().remove();
          cells = cells.enter().append('g')
            .attr("class", function(d) { return "node" + (d.children != null && d.children.length > 0 ? " node--internal" : " node--leaf"); })
            .merge(cells);

          // Update transform and add elements
          cells
            .attr("transform", function(d) { return "translate(" + d.x0 + "," + (d.y1 - _var.brushAttrs.height - 1) + ")";})
            .each(function(c) {

              // Set html object
              c.data.obj = this;

              // Draw cell rect
              var nodeRect = d3.select(this).selectAll("rect.node-rect").data([c]);
              nodeRect.exit().remove();
              nodeRect = nodeRect.enter().append('rect').attr("class", "node-rect").merge(nodeRect);
              nodeRect
                .attr("width", function(d) { return d.x1 - d.x0; })
                .attr("height", function(d) { return d.y1 - d.y0; })
                .style("fill", "#FFF")

              // Draw cell text
              var nodeText = d3.select(this).selectAll("text.node-text").data([c]);
              nodeText.exit().remove();
              nodeText = nodeText.enter().append('text').attr("class", "node-text").merge(nodeText);
              nodeText
                .attr('text-anchor', 'middle')
                .attr("x", function(d) { return (d.x1 - d.x0)/2; })
                .attr("y", function(d) { return (d.y1 - d.y0)/2 + 3; })
                .style('font-size', function(d) { return d.children == null || d.children.length === 0 ? "12px" : "12px"; })
                .text(function(d) { return d.data.name; })

            });

            cells.on('click', function(d) {

              // If the brush was created
              if(_var.brush != null) { _var.gB.select(".brush").call(_var.brush.move, [d.x0, d.x1]); }

            }).on('mouseover', function(d) {

              // If the brush was created
              if(_var.brush != null) {

                // Mark as hovered
                d3.select(this).classed('hovered', true);

                // // Get brush snap
                // _var.brushGetSnap([d.x0, d.x1]);

                // // Update elements
                // _var.brushUpdate()

              }

            }).on('mouseout', function(d) {

              // If the brush was created
              if(_var.brush != null) {

                // Mark as hovered
                d3.select(this).classed('hovered', false);

                // // Get brush snap
                // _var.brushGetSnap(_var.brushAttrs.pixelBounds);

                // // Update elements
                // _var.brushUpdate()

              }

            });

            function findNode(id, node) {

              // If the node is the one
              if(node.id === id) return node;

              // If the node is not the one
              var result = null;
              if(node.children != null) {
                node.children.forEach(function(c) {
                  var n = findNode(id, c);
                  if(n != null) { result = n; }
                });
              }
              return result
            }

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','components','parent'].forEach(function (key) {

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

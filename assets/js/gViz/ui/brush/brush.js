// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
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

            // Initialize brush
            _var.brush = d3.brushX()
              .extent([[0, 0], [_var.brushAttrs.width-1, _var.brushAttrs.height]])
              .on("start", brushstart)
              .on("brush", brushing)
              .on("end", brushended)

            // Initialize pixel bounds
            _var.brushAttrs.pixelBounds = [0, _var.brushAttrs.width];

            // Insert brush
            _var.brushText = _var.g.selectAll(".brush-text").data(["brush-text"]);
            _var.brushText.exit().remove();
            _var.brushText = _var.brushText.enter().append('text').attr("class", "brush-text").merge(_var.brushText);
            _var.brushText
              .attr("text-anchor", "middle")
              .attr("x", _var.brushAttrs.width/2)
              .attr("y", _var.brushAttrs.height/2 + 4)
              .style('fill', _var.checkAttr(_var.data.style.brush, 'color', null, '#ccc'))
              .text("Select the values extent here")

            // Insert brush
            var brushSel = _var.g.selectAll(".brush").data(["brush"]);
            brushSel.exit().remove();
            brushSel = brushSel.enter().append('g').attr("class", "brush").merge(brushSel);
            brushSel.call(_var.brush)
              .attr('transform', 'translate(0,1)')

            var brushRect = brushSel.selectAll('.selection');
            brushRect.style('fill', _var.checkAttr(_var.data.style.brush, 'brushBackgroundColor', null, '#ddd'))

            // Brush custom handles
            var handle = brushSel.selectAll(".handle--custom").data([{type: "w"}, {type: "e"}]);
            handle.exit().remove();
            handle = handle.enter().append("path").attr("class", "handle--custom").merge(handle);
            handle
              .attr("display", "none")
              .attr("fill-opacity", 0.8)
              .style('stroke', _var.checkAttr(_var.data.style.brush, 'arrowsColor', 'color', '#999'))
              .style('fill', _var.checkAttr(_var.data.style.brush, 'arrowsColor', 'color', '#999'))
              .attr("stroke-width", .5)
              .attr("cursor", "ew-resize")
              .attr("d", function(d) {
                var tH = _var.brushAttrs.height, h = 6, p = 3;
                return `M ${0},${-tH/2} ${0},${tH/2} Z M ${-h/2-p},${0} ${-p},${-h/2} ${-p},${h/2} Z M ${h/2+p},${0} ${p},${-h/2} ${p} ${h/2} Z`;
              });

            function brushstart() {}

            function brushing() {

              // Only transition after input.
              if (d3.event == null || d3.event.sourceEvent == null) return;

              // Ignore empty selections.
              if (d3.event == null || d3.event.selection == null) return;

              // Get brush bounds
              var d0 = d3.event.selection.map(_var.brushAttrs.scale.invert);

              // Update brush text
              if(_var.brushText != null) { _var.brushText.attr("x", d3.mean(d0)).text("III"); }

              // Update brush
              handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + d0[i] + "," + (_var.brushAttrs.height/2) + ")"; });

            }

            function brushended() {

              // Only transition after input.
              if (d3.event == null || d3.event.sourceEvent == null) return;

              // Reset selected
              var nodes = _var.g.selectAll(".node");
              nodes.selectAll(".node-rect").style("fill", _var.checkAttr(_var.data.style.nodes, 'backgroundColor', null, '#FFF'))
              nodes.selectAll(".node-text").style("fill", _var.checkAttr(_var.data.style.nodes, 'color', null, '#ccc'))
              nodes.classed('selected',false);

              // Ignore empty selections.
              if (d3.event == null || d3.event.selection == null) {

                // Get snap interval
                var d1 = _var.brushGetSnap(_var.brushAttrs.pixelBounds);

              } else {

                // Get snap interval
                var d1 = _var.brushGetSnap(d3.event.selection.map(_var.brushAttrs.scale.invert));

              }

              // Update brush text
              if(_var.brushText != null) { _var.brushText.attr("x", d3.mean(d1)).text("III"); }

              // Update pixelBounds
              _var.brushAttrs.pixelBounds = d1;

              // Mark selected
              markSelected(d1);

              // Snap to borders
              d3.select(this).transition().call(d3.event.target.move, d1);

              // Update brush
              handle.attr("display", null).transition()
                .attr("transform", function(d, i) { return "translate(" + d1[i] + "," + (_var.brushAttrs.height/2) + ")"; });

              // Update elements
              _var.brushUpdate();

            }

            // Update elements
            _var.brushUpdate = function () {

              // Trigger onHover attribute function
              if(_var.onSelect != null && typeof _var.onSelect === "function") { _var.onSelect(_var.brushAttrs.bounds); }

            }

            _var.brushGetSnap = function (d0) {

              // Fix bounds[0]
              if(d0[0] < 0) { d0[0] = 0; }
              if(d0[0] > _var.brushAttrs.width) { d0[0] = _var.brushAttrs.width; }

              // Fix bounds[1]
              if(d0[1] < 0) { d0[1] = 0; }
              if(d0[1] > _var.brushAttrs.width) { d0[1] = _var.brushAttrs.width; }

              // Set d1
              var d1 = d0;

              // Get leaves
              var leaves = _var.brushAttrs.hRoot.leaves();

              // Get bounds
              var bounds = [];
              var boundsIndex = [];
              leaves.forEach(function(n, i) {
                if((Math.abs(n.x0-d0[0]) <= 1 || n.x0 <= d0[0]) && (Math.abs(n.x1-d0[0]) <= 1 || n.x1 >= d0[0])) { bounds[0] = n; boundsIndex[0] = i; }
                if((Math.abs(n.x0-d0[1]) <= 1 || n.x0 <= d0[1]) && (Math.abs(n.x1-d0[1]) <= 1 || n.x1 >= d0[1])) { bounds[1] = n; boundsIndex[1] = i; }
              });

              if(bounds[0] != null && bounds[1] != null) {

                // Get snap
                _var.brushAttrs.bounds  = [];

                // Get snap and limits for bounds[0]
                if(bounds[0] != null) {
                  if(bounds[1] == null) { _var.brushAttrs.bounds = bounds[0].data.values; }
                  if(d0[0] <= (bounds[0].x1 + bounds[0].x0)/2) {
                    d1[0] = bounds[0].x0;
                    _var.brushAttrs.bounds[0] = bounds[0].data.values[0];
                  } else {
                    d1[0] = bounds[0].x1;
                    if(leaves[boundsIndex[0]+1] != null) { _var.brushAttrs.bounds[0] = leaves[boundsIndex[0]+1].data.values[0]; }
                  }
                }

                // Get snap and limits for bounds[1]
                if(bounds[1] != null) {
                  if(bounds[0] == null) { _var.brushAttrs.bounds = bounds[1].data.values; }
                  if(d0[1] <= (bounds[1].x1 + bounds[1].x0)/2) {
                    d1[1] = bounds[1].x0;
                    if(leaves[boundsIndex[1]-1] != null) { _var.brushAttrs.bounds[1] = leaves[boundsIndex[1]-1].data.values[1]; }
                  } else {
                    d1[1] = bounds[1].x1;
                    _var.brushAttrs.bounds[1] = bounds[1].data.values[1];
                  }
                }

                // Fix no interval for left side
                if(bounds[0] != null && bounds[0].x1 === d1[0] && Math.abs(d1[0] - d1[1]) <= 1 ) {
                  d1[0] = bounds[0].x0;
                  _var.brushAttrs.bounds[0] = bounds[0].data.values[0];
                }

                // Fix no interval for right side
                if(bounds[1] != null && bounds[1].x0 === d1[1] && Math.abs(d1[0] - d1[1]) <= 1 ) {
                  d1[1] = bounds[1].x1;
                  _var.brushAttrs.bounds[1] = bounds[1].data.values[1];
                }

              }

              return d1;

            }

            function markSelected(d1) {

              // Mark selected
              var parents = {};
              _var.brushAttrs.hRoot.descendants().forEach(function(n) {

                // Selected nodes
                var selected = (n.x0 <= d1[0] && n.x1 > d1[0]) || (n.x0 < d1[1] && n.x1 >= d1[1]) || (n.x0 >= d1[0] && n.x1 <= d1[1]);

                // Add object selected colors
                var obj = d3.select(n.data.obj);
                obj.selectAll(".node-rect")
                  .style("fill", _var.checkAttr(_var.data.style.nodes, (selected ? 'selectedBackgroundColor' : 'backgroundColor'), null, '#FFF'))
                obj.selectAll(".node-text")
                  .style("fill", _var.checkAttr(_var.data.style.nodes, (selected ? 'selectedColor' : 'color'), null, '#ccc'))
                obj.classed("selected", selected);

                // Reset selected colors
                if(n.parent != null && n.parent.data != null) {
                  var parentObj = d3.select(n.parent.data.obj);
                  parentObj.selectAll(".node-rect").style("fill", _var.checkAttr(_var.data.style.nodes, 'backgroundColor', null, '#FFF'))
                  parentObj.selectAll(".node-text").style("fill", _var.checkAttr(_var.data.style.nodes, 'color', null, '#ccc'))
                  parentObj.classed("selected", false);

                  if(selected) { parents[n.parent.data.id] = n.parent; }
                }

              });

              // Mark parents selected
              Object.keys(parents).forEach(function(p) {
                var obj = d3.select(parents[p].data.obj);
                obj.selectAll(".node-rect").style("fill", _var.checkAttr(_var.data.style.nodes, 'selectedBackgroundColor', null, '#FFF'))
                obj.selectAll(".node-text").style("fill", _var.checkAttr(_var.data.style.nodes, 'selectedColor', null, '#000'))
                obj.classed("selected", true);
              })

            }

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','components'].forEach(function (key) {

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

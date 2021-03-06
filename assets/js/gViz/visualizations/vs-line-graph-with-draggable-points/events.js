// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var        = null;
  var action      = 'mouseover';
  var components  = null;
  var node        = null;
  var mouse       = null;
  var origin      = 'node';
  var isDraggable = false;
  var propAttrs   = ['title','body'];

  // Validate attributes
  var validate = function (step) {

    switch (step) {
      case 'run': return _var.nodeDragging !== true;
      default: return false;
    }
  };

  // Main function
  var main = function (step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Run code
        case 'run':

          // Set groups and bisect element
          var groups = _var.g.selectAll(".chart-elements").selectAll(".element-group");
          var points = _var.g.selectAll(".chart-elements").selectAll(".element-group").selectAll('.point-group');
          var lines  = _var.g.selectAll(".chart-elements").selectAll(".element-group").selectAll('.line');
          var bisector = d3.bisector(function (d) { return d.parsedX; }).left;

          switch (action) {

            case 'mouseover':

              // Initialize area between object to store attrs
              var mousePos = d3.mouse(mouse);
              var area = {
                x: null,
                y0: _var.y.domain()[0], y0Diff:(_var.height-mousePos[1]), y0Change: false, y0After: null, y0Before: null,
                y1:_var.y.domain()[1], y1Diff:mousePos[1], y1Changed: false, y1After: null, y1Before: null,
                pointTop: null, pointBottom: null
              };
              var areaValues = [
                { top: 0, left: 0 },
                { top: 0, left: 0 },
                { top: 0, left: 0 },
                { top: 0, left: 0 },
                { top: 0, left: 0 },
                { top: 0, left: 0 }
              ];

              if(origin === 'node') {

                // Update Area attributes
                area.y1Changed = true;
                area.y0Changed = true;
                area.y1 = +node.y;
                area.y1Diff = mousePos[1] - _var.y(+node.y);
                area.pointTop = node;
                area.x = _var.x(node.parsedX);

                // Fade other groups
                groups.transition()
                  .style('opacity', function(g) { return g === node || g.id === node._parent.id ? 1 : 0.2; })

                // Add style to lines
                lines.transition()
                  .style("filter", function(g) { return g === node || g.id === node._parent.id ? "url(#"+_var.shadowId+")" : ""; })
                  .style('opacity', function(g) { return g === node || g.id === node._parent.id ? 1 : 0.2; })

                // Add style to points
                points.transition()
                  .style("filter", function(g) { return g === node ? "url(#"+_var.shadowId+")" : ""; })
                  .style('opacity', function(g) { return g.parsedX === node.parsedX || g === node || g._parent.id === node._parent.id ? 1 : 0.2; })

                // Get x and y values
                var x = _var.x(node.parsedX) + (_var.xIsDate || _var.xIsNumber ? 0 : _var.x.bandwidth()/2)
                var y = _var.y(+node.y);
                var z = _var.pointSize(node, isDraggable);

                // Get left and top positions
                var left = _var.wrap.node().getBoundingClientRect().left +_var.margin.left + x;
                var top  = _var.wrap.node().getBoundingClientRect().top + _var.margin.top + y - z;

                // Initialize tooltip obj function
                var _getTooltipObj = function(n) {

                  // Initialize tooltip object
                  var tooltipObj = {};

                  // Set parent n attributes to tooltip obj
                  Object.keys(n._parent).forEach(function(k) { tooltipObj[k] = n._parent[k]; });

                  // Set n attributes to tooltip obj
                  Object.keys(n).forEach(function(k) { tooltipObj[k] = n[k]; });

                  // Set x, y and z values with format
                  tooltipObj.x = _var.xFormat(n.x);
                  tooltipObj.y = _var.yFormat(n.y);
                  tooltipObj.color = _var.pointColor(n);

                  return tooltipObj;

                }

                // Propagate attributes for all values on tooltipValues
                propAttrs.forEach(function(attr) {
                  _var.data.tooltip["_"+attr] = [];
                  _var.data.tooltip[attr].forEach(function(d) { _var.data.tooltip["_"+attr].push(d); });
                });

                // Check for Propagate attr
                if(_var.data.tooltip != null && _var.data.tooltip.propagate != null && _var.data.tooltip[_var.data.tooltip.propagate] != null) {

                  // Store propagate attr
                  _var.data.tooltip[_var.data.tooltip.propagate] = [];

                  // Propagate tooltip over all series
                  _var.data.data.forEach(function(d) {
                    d.values.filter(function(v) { return v.parsedX === node.parsedX; }).forEach(function(v) {
                      _var.data.tooltip["_"+_var.data.tooltip.propagate].forEach(function(p) {
                        _var.data.tooltip[_var.data.tooltip.propagate].push(shared.helpers.text.replaceVariables(p, _getTooltipObj(v)));
                      });
                    });
                  });
                }

                // Set tooltip object
                var tooltipObj = _getTooltipObj(node);

                // Set tooltip header as title
                if(_var.data.tooltip.header != null) {
                  _var.data.tooltip.header.forEach(function(p) {
                    _var.data.tooltip.title.unshift(shared.helpers.text.replaceVariables(p, {}));
                  });
                }

                // Set tooltip component
                shared.visualComponents.tooltip()
                  ._var(_var)
                  .body(_var.data.tooltip != null && _var.data.tooltip.body != null ? _var.data.tooltip.body : "")
                  .borderColor(tooltipObj.color)
                  .hasImg(_var.data.tooltip != null && _var.data.tooltip.hasImg === true)
                  .left(left)
                  .muted(_var.data.tooltip != null && _var.data.tooltip.muted != null && _var.data.tooltip.muted === true)
                  .obj(tooltipObj)
                  .top(top)
                  .title(_var.data.tooltip != null && _var.data.tooltip.title != null ? _var.data.tooltip.title : "")
                  .run();

                // Reset propagation attrs
                propAttrs.forEach(function(attr) {
                  _var.data.tooltip[attr] = [];
                  _var.data.tooltip["_"+attr].forEach(function(d) { _var.data.tooltip[attr].push(d); });
                });

              } else if(origin === 'background') {

                // Get valid date
                var xValue = _var.x.invert(mousePos[0]);
                var tooltipValues = [];

                // Get values from each line group to use on the tooltip
                _var.data.data.forEach(function(lineGroup, i) {

                  // Get most close value to the mouse position
                  var bisectIndex = bisector(lineGroup.values, xValue);
                  if (bisectIndex > 0 && bisectIndex <= lineGroup.values.length - 1) {
                    var x0 = _var.x(lineGroup.values[bisectIndex - 1].parsedX);
                    var x1 = _var.x(lineGroup.values[bisectIndex].parsedX);
                    bisectIndex = mousePos[0] >= x0 + (_var.xTicksSize/2) ? bisectIndex : bisectIndex - 1;
                  }

                  if(lineGroup.values[bisectIndex]) {

                    // Get y position of the point and store area x
                    var yPos = _var.y(+lineGroup.values[bisectIndex].y);
                    area.x = _var.x(lineGroup.values[bisectIndex].parsedX);

                    // Point is above the mouse
                    if(yPos <= mousePos[1] && (mousePos[1] - yPos) <= area.y1Diff) {
                      area.pointTop = lineGroup.values[bisectIndex];
                      area.y1 = +lineGroup.values[bisectIndex].y;
                      area.y1Diff = mousePos[1] - yPos;
                      area.y1Changed = true;
                    }

                    // Point is below the mouse
                    if(yPos >= mousePos[1] && (yPos - mousePos[1]) <= area.y0Diff) {
                      area.pointBottom = lineGroup.values[bisectIndex];
                      area.y0 = +lineGroup.values[bisectIndex].y;
                      area.y0Diff = yPos - mousePos[1];
                      area.y0Changed = true;
                    }
                  }
                });

                // Trigger onHoverBetween attribute function
                if(area.y1Changed === true && area.y0Changed === true) {

                  // Fire event
                  if(_var.isHoveringBetween === false && _var.onHoverBetweenIn != null && typeof _var.onHoverBetweenIn === "function") { _var.onHoverBetweenIn(area); }
                  _var.isHoveringBetween = true;

                } else {
                  if(_var.isHoveringBetween != null && _var.isHoveringBetween === true &&_var.onHoverBetweenOut != null && typeof _var.onHoverBetweenOut === "function") { _var.onHoverBetweenOut(area); }
                  _var.isHoveringBetween = false;
                }
              }

              // Create and update area between lines
              _var.areaBetween = _var.g.selectAll(".area-between").data(area.y1Changed === true && area.y0Changed === true ? [area] : []);
              _var.areaBetween.exit().remove();
              _var.areaBetween = _var.areaBetween.enter().insert('path', ':first-child').attr("class", "area-between").merge(_var.areaBetween);

              if(area.y1Changed === true && area.y0Changed === true) {

                // Get area path points
                areaValues[0] = { top: _var.y(area.y1), left: (area.x - _var.xTicksSize/2) < 0 ? 0 : (area.x - _var.xTicksSize/2) };
                areaValues[1] = { top: _var.y(area.y1), left: area.x };
                areaValues[2] = { top: _var.y(area.y1), left: (area.x + _var.xTicksSize/2) > _var.width ? _var.width : (area.x + _var.xTicksSize/2) };
                areaValues[3] = { top: _var.y(area.y0), left: (area.x - _var.xTicksSize/2) < 0 ? 0 : (area.x - _var.xTicksSize/2) };
                areaValues[4] = { top: _var.y(area.y0), left: area.x };
                areaValues[5] = { top: _var.y(area.y0), left: (area.x + _var.xTicksSize/2) > _var.width ? _var.width : (area.x + _var.xTicksSize/2) };

                // Draw area
                var areaX = (area.x - _var.xTicksSize/2) < 0 ? 0 : (area.x - _var.xTicksSize/2);
                _var.areaBetween
                  .attr('d', "M "+areaValues[0].left+","+areaValues[0].top+" L "+areaValues[1].left+","+areaValues[1].top+" "+areaValues[2].left+","+areaValues[2].top+" "+areaValues[5].left+","+areaValues[5].top+" "+areaValues[4].left+","+areaValues[4].top+" "+areaValues[3].left+","+areaValues[3].top+" Z")
                  .style('fill', _var.pointColor(area.pointTop))
                  .style('fill-opacity', 0.1)
                  .style('display', 'block')

              }

              break;

            case 'mouseout':

              // Fade other groups
              groups.transition().style('opacity', 1)

              // Add style to lines
              lines.transition()
                .style("filter", "")
                .style('opacity', 1);

              // Add style to points
              points.transition()
                .style("filter", '')
                .style('opacity', 1);

              // Remove area
              _var.g.selectAll(".area-between").style('display', 'none');

              // Set bars component
              shared.visualComponents.tooltip()
                ._var(_var)
                .action("hide")
                .run();

              break;

          }

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','action','components','isDraggable','node','mouse','origin'].forEach(function (key) {

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

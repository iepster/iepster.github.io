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

              if(origin === 'node') {

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
                var mousePos = d3.mouse(mouse);
                var xValue = _var.x.invert(mousePos[0]);
                var tooltipValues = [];
                var area = {
                  x: null,
                  y0: _var.y.domain()[0], y0Diff:(_var.height-mousePos[1]), y1:_var.y.domain()[1], y1Diff:mousePos[1], y1Changed: false,
                  point: null
                };

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

                    // Get y position of the point
                    var yPos = _var.y(+lineGroup.values[bisectIndex].y);

                    // Point is above the mouse
                    if(yPos <= mousePos[1] && (mousePos[1] - yPos) <= area.y1Diff) {
                      area.point = lineGroup.values[bisectIndex];
                      area.y1 = +lineGroup.values[bisectIndex].y;
                      area.y1Diff = mousePos[1] - yPos;
                      area.y1Changed = true;
                    }

                    // Point is below the mouse
                    if(yPos >= mousePos[1] && (yPos - mousePos[1]) <= area.y0Diff) {
                      area.y0 = +lineGroup.values[bisectIndex].y;
                      area.y0Diff = yPos - mousePos[1];
                    }

                    area.x = _var.x(lineGroup.values[bisectIndex].parsedX);

                    // Initialize tooltip object
                    var tooltipObj = {};

                    // Set parent n attributes to tooltip obj
                    Object.keys(lineGroup).forEach(function(k) { tooltipObj[k] = lineGroup[k]; });

                    // Set n attributes to tooltip obj
                    Object.keys(lineGroup.values[bisectIndex]).forEach(function(k) { tooltipObj[k] = lineGroup.values[bisectIndex][k]; });

                    // Set x, color and z values with format
                    tooltipObj.x = _var.xFormat(lineGroup.values[bisectIndex].x);
                    tooltipObj.y = _var.yFormat(lineGroup.values[bisectIndex].y);
                    tooltipObj.color = _var.pointColor(lineGroup.values[bisectIndex]);

                    // Store tooltipObj
                    tooltipValues.push(tooltipObj);

                  }

                });

                // Create and update area between lines
                _var.areaBetween = _var.g.selectAll(".area-between").data(area.y1Changed === true ? [area] : []);
                _var.areaBetween.exit().remove();
                _var.areaBetween = _var.areaBetween.enter().insert('rect', ':first-child').attr("class", "area-between").merge(_var.areaBetween);

                if(area.y1Changed === true) {

                  // Draw area
                  _var.areaBetween
                    .attr('x', (area.x - _var.xTicksSize/2) < 0 ? 0 : (area.x - _var.xTicksSize/2))
                    .attr('y', _var.y(area.y1))
                    .attr('width', _var.xTicksSize-3)
                    .attr('height', _var.y(area.y0) - _var.y(area.y1))
                    .style('fill', _var.pointColor(area.point))
                    .style('fill-opacity', 0.1)
                    .style('display', 'block')

                  // Trigger onHoverBetween attribute function
                  if(_var.onHoverBetween != null && typeof _var.onHoverBetween === "function") { _var.onHoverBetween(area); }
                }

                // Get left and top positions
                var left = _var.wrap.node().getBoundingClientRect().left + _var.margin.left + d3.mouse(mouse)[0];
                var top  = _var.wrap.node().getBoundingClientRect().top + _var.margin.top;

                // Propagate attributes for all values on tooltipValues
                propAttrs.forEach(function(attr) {

                  // Backup attr to be used on the propagation function
                  _var.data.tooltip["_"+attr] = [];
                  _var.data.tooltip[attr].forEach(function(d) { _var.data.tooltip["_"+attr].push(d); });

                  // Store propagation attrs
                  _var.data.tooltip[attr] = [];

                  // Propagate tooltip over all series
                  tooltipValues.forEach(function(d) {
                    _var.data.tooltip["_"+attr].forEach(function(p) {
                      _var.data.tooltip[attr].push(shared.helpers.text.replaceVariables(p, d));
                    });
                  });

                });

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
                  .borderColor("#999")
                  .hasImg(_var.data.tooltip != null && _var.data.tooltip.hasImg === true)
                  .left(left)
                  .muted(_var.data.tooltip != null && _var.data.tooltip.muted != null && _var.data.tooltip.muted === true)
                  .obj({ color: "#999" })
                  .top(top)
                  .title(_var.data.tooltip != null && _var.data.tooltip.title != null ? _var.data.tooltip.title : "")
                  .run();

                // Reset propagation attrs
                propAttrs.forEach(function(attr) {
                  _var.data.tooltip[attr] = [];
                  _var.data.tooltip["_"+attr].forEach(function(d) { _var.data.tooltip[attr].push(d); });
                })

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

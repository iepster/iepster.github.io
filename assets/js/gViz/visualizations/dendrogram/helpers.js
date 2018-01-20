// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
'use strict';

  // Get attributes values
  var _var = undefined;
  var duration = 500;
  var components = null;
  var parent = null;

  // Validate attributes
  var validate = function validate(step) {
    switch (step) {
      case 'run': return true;
      default: return false;
    }
  };

  // Main function
  var main = function main(step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'run':

          _var.getPointInLine = function(p0, p1, dt) {
            var d = Math.sqrt(Math.pow((p1[0] - p0[0]), 2) + Math.pow((p1[1] - p0[1]), 2));
            var t = dt / d;
            return [((1-t)*p0[0] + t*p1[0]), ((1-t)*p0[1] + t*p1[1])];
          }

          _var.getSatelites = function(node, radius=5) {

            // Initialize variables
            var elements = [];
            node.maxSatLvl = 0;

            // Get satelites
            if(_var.sumLevel != null && node.depth === _var.sumLevel-1 && node._nodes && node._nodes.length >= 1) { elements = node._nodes; }
            else if(node.children && node.children.length >= 1) { elements = node.children; }
            else if(node._children && node._children.length >= 1) { elements = node._children; }

            // if(node.data.id === 'solids') { console.log(elements); }

            // Set satelite points
            elements = elements.sort(function(a,b) { return d3.descending(+a.data.values.cYear, +b.data.values.cYear); });

            // Set satelite points
            elements.forEach(function(c,i) {

              // Get sat attrs
              c.satAttrs = {}
              c.satAttrs.index = i;
              c.satAttrs.count = elements.length < 8 ? elements.length : 8;
              c.satAttrs.lvl = parseInt(i/c.satAttrs.count);
              c.satAttrs.s = _var.attrs.satelites.s + radius * c.satAttrs.lvl;
              c.satAttrs.a = (Math.PI/c.satAttrs.count) * (parseInt(i/c.satAttrs.count)%2);
              c.satAttrs.x = c.satAttrs.s * Math.cos(2 * Math.PI * i / c.satAttrs.count - 1.5707963268 + c.satAttrs.a);
              c.satAttrs.y = c.satAttrs.s * Math.sin(2 * Math.PI * i / c.satAttrs.count - 1.5707963268 + c.satAttrs.a);
              c.satAttrs.textLeg = _var.getPointInLine([0,0],[c.satAttrs.x,c.satAttrs.y], 55);
              c.satAttrs.pathLeg = _var.getPointInLine([0,0],[c.satAttrs.x,c.satAttrs.y], 45);

              // Update max level
              if(node.maxSatLvl < c.satAttrs.lvl) { node.maxSatLvl = c.satAttrs.lvl; }
            });

            return elements;

          }

          _var.drawPath = function(dx, dy, sx, sy, xDiff, yDiff, xOff, size) {
            size = d3.min([size, 10]);
            if(sx < dx) {
              return  ` M ${sy} ${sx}` + ` ${sy - yDiff*xOff + size } ${sx}` +
                      ` Q ${sy - yDiff*xOff} ${sx} ${sy - yDiff*xOff} ${sx + size}` +
                      ` L ${sy - yDiff*xOff} ${sx + xDiff - size}` +
                      ` Q ${sy - yDiff*xOff} ${sx + xDiff} ${sy - yDiff*xOff - size} ${sx + xDiff}` +
                      ` L ${dy} ${dx}`;
            } else {
              return  ` M ${sy} ${sx}` + ` ${sy - yDiff*xOff + size } ${sx}` +
                      ` Q ${sy - yDiff*xOff} ${sx} ${sy - yDiff*xOff} ${sx - size}` +
                      ` L ${sy - yDiff*xOff} ${sx - xDiff + size}` +
                      ` Q ${sy - yDiff*xOff} ${sx - xDiff} ${sy - yDiff*xOff - size} ${sx - xDiff}` +
                      ` L ${dy} ${dx}`;
            }
          }

          // Creates a curved (diagonal) path from parent (d) to the child (s) nodes
          _var.diagonal = function (s, d) {

            // Set variables
            var dy = d.y + _var.attrs.size.w;
            var dx = d.x;
            var sy = s.y - _var.attrs.size.w;
            var sx = s.x;
            var xOff = 0.5;
            var yDiff = Math.abs(sy - dy);
            var xDiff = Math.abs(sx - dx);
            var size = d3.min([yDiff, xDiff]) * 0.25;

            // Get disposition from parent
            if(d.children && d.children.length > 1) {

              // Set variables
              var ddx = parseFloat(`${dx}`);
              var ddy = parseFloat(`${dy}`);
              var ssx = d3.mean(d3.extent(d.children, function(c) { return c.x; }));
              var ssy = dy + (sy - dy)/2;
              yDiff = Math.abs(ssy - ddy);
              xDiff = Math.abs(ssx - ddx);
              size = d3.min([yDiff, xDiff]) * 0.25;

              // Set previous path
              var path = _var.drawPath(ddx, ddy, ssx, ssy, xDiff, yDiff, xOff, size);

              // Get mean
              dx = d3.mean(d3.extent(d.children, function(c) { return c.x; }));
              dy = dy + (sy - dy)/2;

              // Initialize vars
              var disp = { up: 0, down: 0 };
              var index = 0;

              // Get s index
              d.children.forEach(function(c, i) {
                if(dx > c.x) {
                  disp.up += 1;
                  if(c == s) { index = i - disp.down; }
                } else if (dx < c.x) {
                  disp.down += 1;
                  if(c == s) { index = i - disp.up; }
                }
              });

              // Update size
              if(sx < dx) {
                var bin = 0.1 / disp.up
                xOff = 0.45;// + (disp.up - index) * bin;
              } else if (sx > dx) {
                var bin = 0.1 / disp.down
                xOff = 0.45;// + index * bin;
              }

              // Set variables
              yDiff = Math.abs(sy - dy);
              xDiff = Math.abs(sx - dx);
              size = d3.min([yDiff, xDiff]) * 0.25;

              return path + _var.drawPath(dx, dy, sx, sy, xDiff, yDiff, xOff, size);

            }

            return _var.drawPath(dx, dy, sx, sy, xDiff, yDiff, xOff, size);

          };

          // Collapse the node and all it's children
          _var.collapse = function (d) {
            if (d.children) {
              d._children = d.children;
              d._children.forEach(_var.collapse);
              d.children = null;
            }
          };

          // Map graph nodes
          _var.mapGraph = function (d) {

            // Set color
            if(d.isSum) { d.data.color = "#FFF"; }
            else { d.data.color = d.data.color != null ? d.data.color : _var.colors.scale(d.data.values[_var.mainValue]); }

            if (d.children) {

              // Set _uniques from leafs
              if(_var.sumLevel != null && d.depth === _var.sumLevel) { d.children.forEach(function(c) { _var.attrs._uniques[c.data.id] = c; }); }

              // Recursive
              d.children.forEach(function (c) { _var.mapGraph(c); });

              // Collapse nodes
              if(d.data.collapsed != null && d.data.collapsed === true) { _var.collapse(d); }

            }

            // Update parent
            if(_var.sumLevel != null && d.depth === _var.sumLevel-1) {

              // Set sum element
              var sum = d.copy();
              Object.keys(sum).forEach(function(key) { sum[key] = null; });
              sum.children = [];
              sum.data = { id: `sum-${d.data.id}`, name: "" };
              sum.depth = _var.sumLevel;
              sum.height = 3;
              sum.parent = d;
              sum.x0 = 0;
              sum.y0 = 0;
              sum.isSum = true;

              // Update d and sum children
              sum.children = Object.keys(_var.attrs._uniques).map(function(key) { return _var.attrs._uniques[key]; });
              sum._nodes = d.children;
              d._nodes = d.children;
              sum.data.name = `x${d.children ? d.children.length : 0}`;
              d.children = [sum];

            }

          }

          // Get depths
          _var.getMaxDepth = function (d) {

            // Update maxDepth
            if(_var.attrs.maxDepth < (d.depth + 1)) { _var.attrs.maxDepth = (d.depth + 1); }

            // Update depths
            if(_var.attrs.depths[`${d.depth}`] == null) { _var.attrs.depths[`${d.depth}`] = { count: 0, acc: 0 }; }
            _var.attrs.depths[`${d.depth}`].count += 1;

            if (d.children && !(d.data.collapsed != null && d.data.collapsed === true)) {
              d.children.forEach(function (c) {
                _var.getMaxDepth(c);
              });
            }
          }

          // Get attrs from nodes
          _var.getAttrs = function (d) {

            // Set bbox
            if (d.bbox == null) { d.bbox = { width: _var.attrs.size.w, height: _var.attrs.size.h }; }
            d.acc = 0;

            // Recursive iteration
            if (d.children != null) {

              // Get sizes from children
              var bbox_array = d.children.map(function (c) { return _var.getAttrs(c); });
              var width = d3.max(bbox_array.map(function (a) { return a._width; }));
              var height = d3.sum(bbox_array.map(function (a) { return a._height; }));

              if(_var.sumLevel != null && d.depth === _var.sumLevel) {
                var h = Object.keys(_var.attrs._uniques).length * ( _var.attrs.size.h + _var.attrs.offset.x);
                height = h / _var.attrs.depths[`${d.depth}`].count;
              }

              // Set sizes
              d.bbox._width = d.bbox.width > width ? d.bbox.width + 6 * _var.attrs.offset.y : width;
              d.bbox._height = d.bbox.height > height ? d.bbox.height + _var.attrs.offset.x : height;

            } else if (d._children != null || (d.data.collapsed != null && d.data.collapsed === true)) {

              d.bbox._width = d.bbox.width + 6 * _var.attrs.offset.y;
              d.bbox._height = d.bbox.height + _var.attrs.offset.x;

            } else {

              d.bbox._width = d.bbox.width + 6 * _var.attrs.offset.y;
              d.bbox._height = d.bbox.height * 2 + 6 + _var.attrs.offset.x;

            }

            return d.bbox;
          };

          // Reset sizes based on tree
          _var.resetSizes = function () {

            // Reset attrs
            _var.attrs.depths = {};

            // Get Max depth
            _var.getMaxDepth(_var.root);

            // Get attrs from nodes
            _var.getAttrs(_var.root);

            // Set sumLevel depths and fix Max Depth
            if(_var.sumLevel != null) {
              _var.attrs.depths[`${_var.sumLevel+1}`] = { count: Object.keys(_var.attrs._uniques).length, acc: 0 };
              _var.attrs.maxDepth = _var.attrs.maxDepth > (_var.sumLevel+2) ? _var.sumLevel+2 : _var.attrs.maxDepth;
            }

            _var.height = _var.root.bbox._height < _var.height ? _var.height : _var.root.bbox._height;

            // Declares a tree layout and assigns the size
            _var.treemap = d3.tree().size([_var.height, _var.width]);

            // Update outer dimensions
            _var.wrap
              .attr("width", _var.width + _var.margin.left + _var.margin.right)
              .attr("height", _var.height + _var.margin.top + _var.margin.bottom);

          };

          break;
      }
    }

    return _var;
  };

  // Expose global variables
  ['_var','duration','components','parent'].forEach(function(key) {

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

  // Execute the specific called function
  main.run = _ => main('run');

  return main;
};

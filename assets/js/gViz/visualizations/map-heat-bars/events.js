// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var       = null;
  var action     = 'mouseover';
  var components = null;
  var node       = null;
  var _node      = null;
  var nodeSel    = null;
  var source     = 'node';

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

        // Run code
        case 'run':

          // Set shapes and bars
          var shapes = _var.g.select('.chart-elements').selectAll('.map-shape');
          var bars   = _var.g.select('.chart-elements').selectAll('.bar, .bottom-bar, .bar-circle');
          var pointEls = _var.g.select('.chart-elements').selectAll('.point-element');
          var points = _var.g.select('.chart-elements').selectAll('.point');

          // Store node
          _node = node;

          // Get hashed node
          if(node != null && _var.mode === 'heat') {
            node = _var.heatData[node.properties[_var.data.heat != null && _var.data.heat.shapeId != null ? _var.data.heat.shapeId : "id"]];
          }

          switch (action) {

            case 'mouseover':

              // If the node exists
              if(node != null) {

                // Fade bars
                bars.transition()
                  .style('opacity', function(g) { return g.id === node.id ? 1 : 0.2; })
                  .style("filter", function(g) { return g === node ? "url(#"+_var.shadowId+")" : ""; })

                // Fade map shapes
                shapes.transition()
                  .style('opacity', function(g) { return g === _node || _var.mode !== 'heat' ? _var.shapeOpacity(g) : 0.2; })
                  .style("filter", function(g) { return g === _node && _var.mode === 'heat' ? "url(#"+_var.shadowId+")" : ""; })

                // Show / Hide point groups
                if(_var.nodeDragging == null || _var.nodeDragging === false) {
                  pointEls.style('display', function(g) { return g.id === node.id && node.draggable != null && node.draggable === true ? 'block' : 'none'; })
                }

                // Fade points
                points.transition().style("filter", function(g) { return g === node ? "url(#"+_var.shadowId+")" : ""; })

                // CHeck if it's a pin
                var isPin = _var.data.bars != null && _var.data.bars.barStyle != null && _var.data.bars.barStyle === 'pin';
                var isDraggable = node.draggable != null && node.draggable === true;

                if(source != null && source === 'shape') {

                  var x = (_var.zoomTransform.x) + d3.mouse(nodeSel)[0] * _var.zoomTransform.k;
                  var y = (_var.zoomTransform.y) + d3.mouse(nodeSel)[1] * _var.zoomTransform.k;

                  // Get left and top positions
                  var left = _var.wrap.node().getBoundingClientRect().left + x;
                  var top  = _var.wrap.node().getBoundingClientRect().top + y - 15;

                } else {

                  // Get x and y values
                  var x = (_var.zoomTransform.x) + _var.projection([node.lon, node.lat])[0] * _var.zoomTransform.k;
                  var y = (_var.zoomTransform.y) + _var.projection([node.lon, node.lat])[1] * _var.zoomTransform.k;

                  // Get left and top positions
                  var left = _var.wrap.node().getBoundingClientRect().left + x;
                  var top  = _var.wrap.node().getBoundingClientRect().top + y - (_var.barHeight(node)*_var.zoomTransform.k) - (isPin ? (_var.pinRadius(node)*_var.zoomTransform.k) : 0) - (isDraggable ? 5 : 0) - 5;

                }

                // Initialize tooltip object
                var tooltipObj = { properties: {} };

                // Set color
                tooltipObj.color = _var.mode === 'bars' ? _var.barColor(node) : _var.shapeColor(_node);

                // Set node attributes to tooltip obj
                Object.keys(node).forEach(function(k) { tooltipObj[k] = node[k]; });

                // Store shape properties for heat mode
                if(_var.mode === 'heat') { Object.keys(_node.properties).forEach(function(k) { tooltipObj.properties[k] = _node.properties[k]; }); }

                // Set bars component
                var tooltip = _var.data.tooltip == null ? {} : _var.data.tooltip;
                shared.visualComponents.tooltip()
                  ._var(_var)
                  .body(tooltip[_var.mode] != null && tooltip[_var.mode].body != null ? tooltip[_var.mode].body : "")
                  .borderColor(tooltip.borderColor != null ? tooltip.borderColor : (_var.mode === 'bars' ? _var.barColor(node) : _var.shapeColor(_node)))
                  .backgroundColor(tooltip.backgroundColor != null ? tooltip.backgroundColor : null)
                  .hasImg(tooltip[_var.mode] != null && tooltip[_var.mode].hasImg === true)
                  .left(left)
                  .muted(tooltip[_var.mode] != null && tooltip[_var.mode].muted != null && tooltip[_var.mode].muted === true)
                  .obj(tooltipObj)
                  .title(tooltip[_var.mode] != null && tooltip[_var.mode].title != null ? tooltip[_var.mode].title : "")
                  .top(top)
                  .run();

                // Initialize tooltipTable object
                var tooltipTableObj = { properties: {} };

                // Set color
                tooltipTableObj.color = _var.mode === 'bars' ? _var.barColor(node) : _var.shapeColor(_node);

                // Set node attributes to tooltipTable obj
                Object.keys(node).forEach(function(k) { tooltipTableObj[k] = node[k]; });

                // Store shape properties for heat mode
                if(_var.mode === 'heat') { Object.keys(_node.properties).forEach(function(k) { tooltipTableObj.properties[k] = _node.properties[k]; }); }

                // Set tooltip components
                var tooltipTable = _var.data.tooltipTable == null ? {} : _var.data.tooltipTable;
                var tooltipTablePosition = tooltipTable.position != null && ['top-right','bottom-right','top-left','bottom-left'].indexOf(tooltipTable.position) !== -1 ? tooltipTable.position : 'bottom-left';

                // Show tooltip
                shared.visualComponents.tooltipTable()
                  ._var(_var)
                  .body(tooltipTable[_var.mode] != null && tooltipTable[_var.mode].body != null ? tooltipTable[_var.mode].body : "")
                  .borderColor(tooltipTable.borderColor != null ? tooltipTable.borderColor : (_var.mode === 'bars' ? _var.barColor(node) : _var.shapeColor(_node)))
                  .backgroundColor(tooltipTable.backgroundColor != null ? tooltipTable.backgroundColor : null)
                  .hasImg(tooltipTable[_var.mode] != null && tooltipTable[_var.mode].hasImg === true)
                  .muted(tooltipTable[_var.mode] != null && tooltipTable[_var.mode].muted != null && tooltipTable[_var.mode].muted === true)
                  .obj(tooltipTableObj)
                  .target(_var.container.d3.closest('.gViz-outer-wrapper').select('.gViz-map-table-tooltip'))
                  .title(tooltipTable[_var.mode] != null && tooltipTable[_var.mode].title != null ? tooltipTable[_var.mode].title : "")
                  .top(tooltipTablePosition === 'top-left' || tooltipTablePosition === 'top-right' ? 10 : null)
                  .right(tooltipTablePosition === 'bottom-right' || tooltipTablePosition === 'top-right' ? 10 : null)
                  .bottom(tooltipTablePosition === 'bottom-left' || tooltipTablePosition === 'bottom-right' ? 10 : null)
                  .left(tooltipTablePosition === 'bottom-left' || tooltipTablePosition === 'top-left' ? 10 : null)
                  .run();

              }

              break;

            case 'mouseout':

              // Reset opacity and filter
              bars.transition().style('opacity', 1).style("filter", "")
              shapes.transition().style('opacity', _var.shapeOpacity).style("filter", "")
              if(_var.nodeDragging == null || _var.nodeDragging === false) { pointEls.style('display', 'none'); }
              points.transition().style("filter", "")

              // Hide tooltip
              shared.visualComponents.tooltip()
                ._var(_var)
                .action("hide")
                .run();

              // Hide tooltipTable
              shared.visualComponents.tooltipTable()
                ._var(_var)
                .action("hide")
                .target(_var.container.d3.closest('.gViz-outer-wrapper').select('.gViz-map-table-tooltip'))
                .run();

              break;

          }

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','action','components','node','nodeSel','source'].forEach(function (key) {

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

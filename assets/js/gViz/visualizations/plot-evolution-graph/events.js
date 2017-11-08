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

          // Set groups
          var groups = _var.gE.selectAll(".chart-elements").selectAll(".element-group");
          var circles = _var.gE.selectAll(".chart-elements").selectAll(".element-group").selectAll('circle');

          switch (action) {

            case 'mouseover':

              // Fade other groups
              groups.transition().style('opacity', function(g) { return g === node || (_var.clicked != null && _var.clicked.id === g.id) ? 1 : 0.1; })

              // Add filter
              circles.transition().style("filter", function(g) { return g === node ? "url(#"+_var.shadowId+")" : ""; })

              // Get x and y values
              var x = _var.x(+node._values.x);
              var y = _var.y(+node._values.y);
              var z = _var.z(+node._values.z);

              // Get left and top positions
              var left = _var.wrap.node().getBoundingClientRect().left +_var.margin.left + x;
              var top  = _var.wrap.node().getBoundingClientRect().top + _var.margin.top + y - z;

              // Initialize tooltip object
              var tooltipObj = {};

              // Set node attributes to tooltip obj
              Object.keys(node).forEach(function(k) { tooltipObj[k] = node[k]; });

              // Set x, y and z values with format
              tooltipObj.x = _var.xFormat(+node._values.x);
              tooltipObj.y = _var.yFormat(+node._values.y);
              tooltipObj.z = _var.zFormat(+node._values.z);

              // Set bars component
              shared.visualComponents.tooltip()
                ._var(_var)
                .body(_var.data.tooltip != null && _var.data.tooltip.body != null ? _var.data.tooltip.body : "")
                .borderColor(node.color)
                .hasImg(_var.data.tooltip != null && _var.data.tooltip.hasImg === true)
                .left(left)
                .muted(_var.data.tooltip != null && _var.data.tooltip.muted != null && _var.data.tooltip.muted === true)
                .obj(tooltipObj)
                .top(top)
                .title(_var.data.tooltip != null && _var.data.tooltip.title != null ? _var.data.tooltip.title : "")
                .run();

              // Set axis guide
              shared.visualComponents.axisGuide()
                ._var(_var)
                .color(node.color)
                .height(_var.height)
                .left(left)
                .top(top)
                .value({ x: _var.xFormat(node._values.x), y: _var.yFormat(+node._values.y)})
                .x(x)
                .y(y)
                .z(z)
                .run();

              break;

            case 'mouseout':

              // Reset other groups opacity
              groups.transition().style('opacity', function(d) { return _var.clicked == null || _var.clicked.id === d.id ? 1 : 0.1; });

              // Remove filter
              circles.transition().style("filter", "")

              // Put smaller elements on the front
              groups.sort(function(a,b) { return d3.descending(+a._values.z, +b._values.z); })

              // Set bars component
              shared.visualComponents.tooltip()
                ._var(_var)
                .action("hide")
                .run();

              // Set bars component
              shared.visualComponents.axisGuide()
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
  ['_var','action','components','node'].forEach(function (key) {

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

// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = null;
  var action = 'mouseover';
  var components = null;
  var node = null;
  var x = null;
  var y = null;

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
          switch (action) {
            case 'mouseenter':

              // Get left and top positions
              var left = _var.wrap.node().getBoundingClientRect().left + _var.margin.left + x;
              var top = _var.wrap.node().getBoundingClientRect().top + _var.margin.top + y;

              // Initialize tooltip object
              var tooltipObj = { link: {} };

              // Set node attributes to tooltip obj
              Object.keys(node).forEach(function (k) {
                tooltipObj.link[k] = node[k];
                tooltipObj[k] = node[k];
              });

              tooltipObj.link.value = _var.valueFormat(tooltipObj.link.value);

              // Set tooltip component
              shared.visualComponents.tooltip()
                ._var(_var)
                .body(_var.data.tooltip != null && _var.data.tooltip.body != null ? _var.data.tooltip.body : "")
                .borderColor(node.color)
                .hasImg(_var.data.tooltip != null && _var.data.tooltip.hasImg === true)
                .left(left)
                .muted(_var.data.tooltip != null && _var.data.tooltip.muted != null && _var.data.tooltip.muted === true)
                .obj(tooltipObj)
                .top(top)
                .borderColor('#8BC4C9')
                .color('#8BC4C9')
                .title(_var.data.tooltip != null && _var.data.tooltip.title != null ? _var.data.tooltip.title : "")
                .run();
              break;

            case 'mouseleave':

              // Set bars component
              shared.visualComponents.tooltip()
                ._var(_var)
                .action("hide")
                .run();
              break;

            case 'click':

              // Fade other groups
              groups.style('opacity', function (g) {
                return g === node || (_var.clicked != null && (_var.clicked.id === g.id || _var.clicked.parentId === g.parentId)) ? 1 : 0.1;
              })
              break;
          }
          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'action', 'components', 'node', 'x', 'y'].forEach(function (key) {

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

// Imports
var d3 = require("d3");
var common = require("../common");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var attrs = undefined;
  var _var = undefined;

  // Validate attributes
  let validate = function (step) {
    switch (step) {
      case 'run': return true;
      default: return false;
    }
  };

  // Main function
  let main = function (step) {

    // Validate attributes if necessary
    if (validate(step)) {
      switch (step) {

        // Build entire visualizations
        case 'run':

          //calculated properties
          var calc = {}
          calc.chartLeftMargin = attrs.marginLeft;
          calc.chartTopMargin = attrs.marginTop;
          calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
          calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
          calc.centerPointX = calc.chartWidth / 2;
          calc.centerPointY = calc.chartHeight / 2;
          calc.circleRadius = d3.min([calc.chartWidth, calc.chartHeight]) / 2;
          calc.pieInnerRadius = calc.chartWidth / 6;
          calc.pieOuterRadius = calc.chartWidth / 4;
          calc.labelPosMargin = calc.chartWidth / 10;
          calc.donutHalfRadius = (calc.pieOuterRadius - calc.pieInnerRadius) / 2;
          calc.chartNameWrapWidth = calc.pieInnerRadius * 1.5;
          calc.lineEndPosY = (calc.circleRadius + calc.pieOuterRadius) * 0.43;
          calc.LabelPosY = calc.lineEndPosY + 10;
          attrs.data.values = attrs.data.values.sort(function (a, b) {
            return parseFloat(b.value) - parseFloat(a.value);
          });


          //=======================  LAYOUTS   =========================
          var layouts = {};
          layouts.pie = d3.pie().value(function (d) { return Math.round(d.value); }).sort(null);

          //=======================  ARCS   =========================
          var arcs = {};
          arcs.pie = d3.arc().outerRadius(calc.pieOuterRadius).innerRadius(calc.pieInnerRadius)

          // =======================  ASSIGN ALL PROPS   =========================
          _var.calc = calc;
          _var.arcs = arcs;
          _var.layouts = layouts;
          break;
      }
    }
    return _var;
  };

  // Expose global variables
  ['_id', '_var', 'attrs'].forEach(function (key) {

    // Attach variables to validation function
    validate[key] = function (_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return validate;
    };
    // Attach variables to main function
    return main[key] = function (_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return main;
    };
  });

  // Execute the specific called function
  main.run = _ => main('run');

  return main;
};

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
          calc.circleRadius = d3.min([calc.chartWidth, calc.chartHeight]) / 2 * 1.15;
          calc.chartNamePosY = calc.circleRadius / 2 * 0.85 + 20;
          calc.minText = '$' + attrs.data.rangeMin;
          calc.maxText = '$' + attrs.data.rangeMax;
          calc.percentPosY = calc.circleRadius / 2 * 0.85 - 12;
          calc.miniPiePosY = -calc.circleRadius / 2 * 0.85;
          calc.miniPiePosX = -40;

          //=====================  ARCS   ==================
          var arcs = {};
          arcs.pie = d3.arc().outerRadius(attrs.miniPieOuterRadius).innerRadius(attrs.miniPieInneradius)
          arcs.salesDonutPie = d3.arc().outerRadius(40).innerRadius(25);

          //=====================  LAYOUTS   ==================
          var layouts = {};
          layouts.pie = d3.pie().sort(null).value(function (d) { return d.value; })
          layouts.salesDonutPie = d3.pie().value(function (d) { return d; }).sort(null);

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

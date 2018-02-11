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

          //=======================  TRANSFORM & GROUP DATA   =========================
          attrs.data.attributes.forEach(function (attribute) {
            attribute.values.forEach(function (value) {
              var legends = attrs.data.legends.filter(function (legend) { return legend.id == value.legendId })
              value.legend = legends[0];
            })
          })

          //=======================  DINAMIC PROPS   =========================

          //calculated properties
          var calc = {}
          calc.chartLeftMargin = attrs.marginLeft;
          calc.chartTopMargin = attrs.marginTop;
          calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
          calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
          calc.centerPointX = calc.chartWidth / 2;
          calc.centerPointY = calc.chartHeight / 2;
          calc.circleRadius = d3.min([calc.chartWidth, calc.chartHeight]) / 2;
          calc.chartNamePosY = -calc.circleRadius / 2 + 10;
          calc.headerTextWrapLength = 100;
          calc.titleHeaderposY = -calc.circleRadius + 30;
          calc.barChartWrapperPosY = calc.chartHeight * 0.83;
          calc.barChartWrapperWidth = calc.chartWidth * 0.6;
          calc.eachBarGroupWidth = calc.barChartWrapperWidth / attrs.data.attributes.length;
          calc.eachBarWidth = calc.eachBarGroupWidth * 0.5 / attrs.data.legends.length;
          calc.barChartWrapperHeight = calc.chartHeight / 3;
          calc.barsPosX = -calc.eachBarGroupWidth / 4;
          calc.eachDashLineHeight = calc.barChartWrapperHeight / attrs.dashLineCount;
          calc.linesPosX = -2 * calc.barsPosX;
          calc.axisTextPosX = calc.chartWidth * 0.085;
          calc.eachLegendWidth = calc.barChartWrapperWidth / 3;
          calc.barChartWrapperPosX = calc.eachBarGroupWidth / 2;
          calc.legendRectPosX = -calc.eachLegendWidth + 20;

          //=======================  SCALES   =========================
          var scales = {};
          scales.barScale = d3.scaleLinear().domain([0, 100]).range([0, calc.barChartWrapperHeight])

          // =======================  ASSIGN ALL PROPS   =========================
          _var.calc = calc;
          _var.scales = scales;
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

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
          calc.chartNamePosY = calc.chartHeight / 3;
          calc.maxValue = d3.max(attrs.data.values.map(function (v) {
            return v.value
          }))
          calc.chartHalfHeight = calc.chartHeight / 2;
          calc.legendPosX = calc.circleRadius * 2 + 20;
          calc.legendPosY = calc.chartHeight * 0.6;
          calc.legendTextPosX = attrs.eachLegendHeight + 2
          calc.legendTextPosY = attrs.eachLegendHeight - 4
          calc.imagePosX = calc.centerPointX * 1.18;
          calc.imagePosY = calc.centerPointY * 1.64;
          calc.imageWidth = calc.chartWidth * 0.22;
          calc.imageHeight = calc.chartHeight * 0.22;

          //=======================  EXTEND & TRANSFORM DATA   =========================
          calc.featuresWithoutAlaskaAndHavai = attrs.data.map.features.filter(function (d) { return d.properties.abbr != 'ak' && d.properties.abbr != 'hi'; });

          calc.featuresWithoutAlaskaAndHavai.forEach(function (d) {
            var state = attrs.data.values.filter(function (state) {
              return state.abbr == d.properties.abbr;
            });
            if (state.length) {
              d.properties.value = state[0].value;
            }
          })

          //=======================  SCALES   =========================
          var scales = {};
          //this scale chooses one value from arr
          scales.colorIndex = d3.scaleQuantize().domain([0, calc.maxValue]).range(attrs.colorRanges);

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

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
          calc.chartNamePosY = calc.circleRadius / 2 + 20;
          calc.chartNamePosX = calc.circleRadius * 0.35;
          calc.chartAttrsPosY = calc.circleRadius / 5;
          calc.chartAttrsPercPosY = 13 - calc.circleRadius / 2;
          calc.eachAttributSpaceWidth = calc.chartWidth / (attrs.data.attributes.length) - 10;
          calc.attributeCircleRadius = calc.circleRadius / 6;
          calc.attrsDividerPosX = calc.chartWidth * 0.65 / (attrs.data.attributes.length + 1);
          if (attrs.data.attributes.length == 4) {
            calc.attrsDividerPosX = calc.chartWidth * 0.52 / (attrs.data.attributes.length + 1);
          }
          calc.dividerGroupOffset = calc.chartWidth * 0.2;
          if (attrs.data.attributes.length == 4) {
            calc.dividerGroupOffset = calc.chartWidth * 0.15;
          }
          calc.attrsGroupDividerHeight = calc.circleRadius / 3;
          calc.attrNamesWrapLength = calc.chartWidth / 5;
          calc.attrGroupPosY = calc.chartHeight * 0.55;
          calc.attrGroupTextPosY = -calc.attrsGroupDividerHeight / 2.4;
          calc.attrGroupTextPosX = +calc.eachAttributSpaceWidth / 20;
          calc.attrsPercPosX = calc.eachAttributSpaceWidth / 9;
          calc.attrsCirclePosY = -calc.attributeCircleRadius - calc.attrsGroupDividerHeight * 0
          calc.imagePosX = calc.centerPointX * 0.38;
          calc.imagePosY = calc.centerPointY * 0.34;
          calc.imageWidth = calc.chartWidth * 0.15;
          calc.imageHeight = calc.chartHeight * 0.15;
          calc.analysIconWidth = calc.chartWidth * 0.3;
          calc.analysIconHeight = calc.chartHeight * 0.3;
          calc.analysIconPosX = -calc.chartWidth / 2.5;
          calc.analysIconPosY = calc.chartWidth / 10;

          // =======================  ASSIGN ALL PROPS   =========================
          _var.calc = calc;


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

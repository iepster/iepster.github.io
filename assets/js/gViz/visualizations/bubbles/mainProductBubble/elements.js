// Imports
var d3 = require("d3");
var shared = require("../../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var attrs = undefined;
  var calc = undefined;
  var centerPoint = undefined;
  var chart = undefined;
  var wrap = shared.helpers.text.wrap;

  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run': {
        if (!attrs) console.log('not valid - attrs');
        if (!calc) console.log('not valid - calc');
        if (!centerPoint) console.log('not valid -centerPoint');
        if (!chart) console.log('not valid -chart');
        if (!attrs) console.log('not valid -attrs');
        return true;
      };
      default: return false;
    }
  };

  // Main function
  var main = function (step) {

    // Validate attributes if necessary
    if (validate(step)) {
      switch (step) {

        // Build entire visualizations
        case 'run':

          //background circle
          var backgroundCircle = centerPoint.selectAll('.background-circle').data(['background-circle']);
          backgroundCircle.exit().remove();
          backgroundCircle = backgroundCircle.enter().append('circle').merge(backgroundCircle);
          backgroundCircle.attr('class', 'background-circle').attr('fill', attrs.circleFill).attr('stroke', attrs.circleStroke).attr('stroke-width', attrs.circleStrokeWidth).attr('r', calc.circleRadius)

          //header title
          var headerTitle = chart.selectAll('.header-title').data(['header-title']);
          headerTitle.exit().remove()
          headerTitle = headerTitle.enter().append('text').merge(headerTitle);
          headerTitle.attr('class', 'header-title').text(attrs.data.title).attr('text-anchor', 'middle').attr('fill', attrs.headerTitleFill).attr('x', calc.chartTitlePosX).attr('y', calc.chartTitlePosY).attr('font-size', attrs.headerTitleFontSize)

          //chart name
          var chartName = centerPoint.selectAll('.chart-name').data(['chart-name']);
          chartName.exit().remove();
          chartName = chartName.enter().append('text').merge(chartName);
          chartName.attr('class', 'chart-name').text(attrs.data.name).attr('y', calc.chartNamePosY).attr('text-anchor', 'middle').attr('fill', attrs.chartNameFill).attr('font-size', attrs.chartNameFontSize)

          var centerImage = chart.selectAll('.center-image').data(['center-image']);
          centerImage.exit().remove();
          centerImage = centerImage.enter().append("svg:image").merge(centerImage);
          centerImage.attr('class', 'center-image').attr('width', calc.imageWidth).attr('height', calc.imageHeight).attr('x', calc.imagePosX).attr('y', calc.imagePosY).attr("xlink:href", attrs.data.image)

          // =======================  ASSIGN NEEDED PROPS   =========================
          break;
      }
    }
    return _var;
  };

  ['_var', 'calc', 'attrs', 'svg', 'chart', 'centerPoint'].forEach(function (key) {

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

  main.run = _ => main('run');
  return main;
};

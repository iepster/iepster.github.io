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
          var backgroundCircle = centerPoint.selectAll('.background-circle').data(['background-circle'])
          backgroundCircle.exit().remove();
          backgroundCircle = backgroundCircle.enter().append('circle').merge(backgroundCircle);
          backgroundCircle.attr('class', 'background-circle').attr('fill', 'white').attr('stroke', attrs.circleStroke).attr('stroke-width', attrs.circleStrokeWidth).attr('r', calc.circleRadius)

          //header title
          var headerTitle = chart.selectAll('.header-title').data(['header-title'])
          headerTitle.exit().remove()
          headerTitle = headerTitle.enter().append('text').merge(headerTitle);
          headerTitle.attr('transform', 'translate(' + calc.chartTitlePosX + ',0)').attr('class', 'header-title').text(attrs.data.title).attr('text-anchor', 'middle').attr('fill', attrs.headerTitleFill).attr('x', calc.chartTitlePosX).attr('y', calc.chartTitlePosY).attr('dy', '0.3em').attr('font-weight', 'bold').attr('font-size', attrs.headerTitleFontSize).call(wrap, 200)

          //chart name
          var chartName = centerPoint.selectAll('.chart-name').data(['chart-name']);
          chartName.exit().remove();
          chartName = chartName.enter().append('text').merge(chartName);
          chartName.attr('class', 'chart-name').text(attrs.data.name).attr('y', calc.chartNamePosY).attr('text-anchor', 'middle').attr('fill', attrs.chartNameFill).attr('font-size', attrs.chartNameFontSize)

          //chart value
          var chartValue = centerPoint.selectAll('.chart-value').data(['chart-value'])
          chartValue.exit().remove();
          chartValue.enter().append('text').merge(chartValue);
          chartValue.attr('class', 'chart-value').text(attrs.data.value).attr('y', calc.chartValuePosY).attr('text-anchor', 'middle').attr('fill', attrs.chartNameFill).attr('font-size', attrs.chartNameFontSize)

          //main image
          var mainImage = chart.selectAll('.main-image').data(['main-image']);
          mainImage.exit().remove();
          mainImage = mainImage.enter().append("svg:image").merge(mainImage);
          mainImage.attr('class', 'main-image').attr('width', calc.imageWidth).attr('height', calc.imageHeight).attr('x', calc.imagePosX).attr('y', calc.imagePosY).attr("xlink:href", attrs.data.image)

          //percents
          var valueTexts = centerPoint.selectAll('.value-text').data(['value-text']);
          valueTexts.exit().remove();
          valueTexts = valueTexts.enter().append('text').merge(valueTexts);
          valueTexts.attr('class', 'value-text').text(attrs.data.valueText).attr('text-anchor', 'middle').attr('y', calc.valueTextPosY).attr('fill', attrs.numberFlagColor).attr('font-size', attrs.valuTextFontSize)

          //number flag
          var numberFlag = chart.selectAll('.number-flag').data(['number-flag']);
          numberFlag.exit().remove();
          numberFlag = numberFlag.enter().append('g').merge(numberFlag);
          numberFlag.attr('class', 'number-flag').attr('transform', 'translate(' + calc.numberFlagGroupPosX + ',' + calc.numberFlagGroupPosY + ')')

          //number flag circle back
          var numberBackCircle = numberFlag.selectAll('.number-back-circle').data(['number-back-circle']);
          numberBackCircle.exit().remove();
          numberBackCircle = numberBackCircle.enter().append('circle').merge(numberBackCircle);
          numberBackCircle.attr('class', 'number-back-circle').attr('r', attrs.numberFlagCircleRadius).attr('fill', attrs.numberFlagColor).style('display', attrs.lineDirection == 'NONE' ? 'none' : 'inline').attr('opacity', 0.7)

          //number flag circle text
          var numberCircleText = numberFlag.selectAll('.number-circle-text').data(['.number-circle-text']);
          numberCircleText.exit().remove();
          numberCircleText = numberCircleText.enter().append('text').merge(numberCircleText);
          numberCircleText.text(attrs.data.number).attr('text-anchor', 'middle').attr('font-size', attrs.numberFlagFontSize).attr('font-weight', 'bold').attr('fill', 'white').attr('class', 'number-circle-text').attr('y', attrs.numberFlagPosY).style('display', attrs.lineDirection == 'NONE' ? 'none' : 'inline')

          //number flag circle arc lines - left
          var leftNumberFlagArcLines = chart.selectAll('.left-number-flag-arc-lines').data(['left-number-flag-arc-lines']);
          leftNumberFlagArcLines.exit().remove();
          leftNumberFlagArcLines = leftNumberFlagArcLines.enter().insert('path').merge(leftNumberFlagArcLines);
          leftNumberFlagArcLines.attr('d', 'M 101 98  L 130 85 C 140 105 140 105 155 120 L 100 160 ').attr('fill', 'none').attr('stroke-width', 2.5).attr('stroke', attrs.linesFill).attr('transform', `translate(-130,120)`).style('display', attrs.lineDirection == 'LEFT' ? 'inline' : 'none')

          //number flag circle arc lines - right
          var rightNumberFlagArcLines = chart.selectAll('.left-number-flag-arc-lines').data(['left-number-flag-arc-lines']);
          rightNumberFlagArcLines.exit().remove();
          rightNumberFlagArcLines = rightNumberFlagArcLines.enter().insert('path').merge(rightNumberFlagArcLines);
          rightNumberFlagArcLines.attr('d', 'M 76 110 L 130 85 C 140 105 140 105 155 120 L 70 185 ').attr('fill', 'none').attr('stroke-width', 2.5).attr('stroke', attrs.linesFill).attr('transform', `translate(-50,330) rotate(-55)`).style('display', attrs.lineDirection == 'RIGHT' ? 'inline' : 'none')

          //number2 flag circle back
          var numberBackCircle2 = numberFlag.selectAll('.number-back-circle2').data(['number-back-circle2']);
          numberBackCircle2.exit().remove();
          numberBackCircle2 = numberBackCircle2.enter().append('circle').merge(numberBackCircle2);
          numberBackCircle2.attr('class', 'number-back-circle2').attr('r', attrs.numberFlagCircleRadius * 1.2).attr('fill', attrs.numberFlagColor).attr('fill-opacity', 0.6).attr('transform', attrs.lineDirection == 'LEFT' ? 'translate(-100,170)' : `translate(30,305)`).style('display', attrs.lineDirection == 'NONE' ? 'none' : 'inline')

          //number flag circle text
          var numberCircleText2 = numberFlag.selectAll('.number-circle-text2').data(['.number-circle-text2']);
          numberCircleText2.exit().remove();
          numberCircleText2 = numberCircleText2.enter().append('text').merge(numberCircleText2);
          numberCircleText2.text(attrs.data.number2).attr('text-anchor', 'middle').attr('font-size', attrs.numberFlagFontSize).attr('font-weight', 'bold').attr('fill', 'white').attr('class', 'number-circle-text2').attr('y', attrs.numberFlagPosY).attr('transform', attrs.lineDirection == 'LEFT' ? 'translate(-100,170)' : `translate(30,305)`)

          //number3 flag circle back
          var numberBackCircle3 = numberFlag.selectAll('.number-back-circle3').data(['number-back-circle3']);
          numberBackCircle3.exit().remove();
          numberBackCircle3 = numberBackCircle3.enter().append('circle').merge(numberBackCircle3);
          numberBackCircle3.attr('class', 'number-back-circle3').attr('r', attrs.numberFlagCircleRadius).attr('fill', attrs.numberFlagColor).attr('fill-opacity', 0.8).attr('transform', attrs.lineDirection == 'LEFT' ? 'translate(-90,240)' : `translate(100,350)`).style('display', attrs.lineDirection == 'NONE' ? 'none' : 'inline')

          //number flag circle text
          var numberCircleText3 = numberFlag.selectAll('.number-circle-text3').data(['.number-circle-text3']);
          numberCircleText3.exit().remove();
          numberCircleText3 = numberCircleText3.enter().append('text').merge(numberCircleText3);
          numberCircleText3.text(attrs.data.number3).attr('text-anchor', 'middle').attr('font-size', attrs.numberFlagFontSize).attr('font-weight', 'bold').attr('fill', 'white').attr('class', 'number-circle-text2').attr('y', attrs.numberFlagPosY).attr('transform', attrs.lineDirection == 'LEFT' ? 'translate(-90,240)' : `translate(100,350)`)

          // =======================  ASSIGN NEEDED PROPS   =========================
          _var.headerTitle = headerTitle;
          _var.leftNumberFlagArcLines = leftNumberFlagArcLines;
          _var.rightNumberFlagArcLines = rightNumberFlagArcLines;
          _var.numberBackCircle2 = numberBackCircle2;
          _var.numberCircleText2 = numberCircleText2;
          _var.numberBackCircle3 = numberBackCircle3;
          _var.numberCircleText3 = numberCircleText3;

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

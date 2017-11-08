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
  var scales = undefined;
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
        if (!scales) console.log('not valid -scales');
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

          // background circle
          var backgroundCircle = centerPoint.selectAll('.background-circle').data(['background-circle']);
          backgroundCircle.exit().remove();
          backgroundCircle = backgroundCircle.enter().append('circle').merge(backgroundCircle);
          backgroundCircle.attr('class', 'background-circle').attr('fill', attrs.circleFill).attr('opacity', 0.8).attr('stroke', attrs.circleStroke).attr('stroke-width', attrs.circleStrokeWidth).attr('r', calc.circleRadius)

          //header title
          var headerTitle = centerPoint.selectAll('.header-title').data(['header-title']);
          headerTitle.exit().remove();
          headerTitle = headerTitle.enter().append('text').merge(headerTitle);
          headerTitle.attr('class', 'header-title').text(attrs.data.title).attr('text-anchor', 'middle').attr('fill', attrs.headerTitleFill).attr('x', calc.centerPointX).attr('y', calc.titleHeaderposY).attr('dy', '0.2em').attr('font-size', attrs.headerTitleFontSize).call(wrap, calc.headerTextWrapLength);

          //chart name
          var chartName = centerPoint.selectAll('.chart-name').data(['chart-name']);
          chartName.exit().remove();
          chartName = chartName.enter().append('text').merge(chartName);
          chartName.attr('class', 'chart-name').text(attrs.data.name).attr('y', calc.chartNamePosY).attr('text-anchor', 'middle').attr('fill', attrs.chartNameFill).attr('font-size', attrs.chartNameFontSize)

          // bar chart wrapper 
          var barChartWrapper = chart.selectAll('.bar-chart-wrapper').data(['bar-chart-wrapper']);
          barChartWrapper.exit().remove();
          barChartWrapper = barChartWrapper.enter().append('g').merge(barChartWrapper);
          barChartWrapper.attr('class', 'bar-chart-wrapper').attr('transform', 'translate(' + calc.barChartWrapperPosX + ',' + calc.barChartWrapperPosY + ')')

          //attribute groups
          var attrGroups = barChartWrapper.selectAll('.attribute-group').data(attrs.data.attributes);
          attrGroups.exit().remove();
          attrGroups = attrGroups.enter().append('g').merge(attrGroups);
          attrGroups.attr('class', 'attribute-group').attr('transform', function (d, i) { var x = (i + 1) * calc.eachBarGroupWidth; return 'translate(' + x + ',' + 0 + ')' })

          //=======================  DRAWING LEFT AXES   =========================
          //axis text
          var attrGroups = barChartWrapper.selectAll('.attribute-group').data(attrs.data.attributes);
          attrGroups.exit().remove();
          attrGroups = attrGroups.enter().append('g').merge(attrGroups);

          //axis text top
          var axisText = barChartWrapper.selectAll('.axisText').data(['axisText']);
          axisText.exit().remove();
          axisText = axisText.enter().append('text').merge(axisText);
          axisText.attr('class', 'axisText').text('100%').attr('fill', attrs.axesTextFill).attr('text-anchor', 'end').attr('x', calc.axisTextPosX).attr('y', - attrs.barsPosY - calc.barChartWrapperHeight).attr('font-size', attrs.leftAxisTextFontSize)

          //axis text bottom
          var axisTextBottom = barChartWrapper.selectAll('.axisTextBottom').data(['axisTextBottom']);
          axisTextBottom.exit().remove();
          axisTextBottom = axisTextBottom.enter().append('text').merge(axisTextBottom);
          axisTextBottom.text('0%').attr('class', 'axisTextBottom').attr('text-anchor', 'end').attr('fill', attrs.axesTextFill).attr('x', calc.axisTextPosX).attr('y', - attrs.barsPosY).attr('font-size', attrs.leftAxisTextFontSize)

          //=======================  DRAWING BOTTOM AXES   =========================
          attrGroups.each(function (d) {
            var group = d3.select(this);
            if (d.symbol == 'circle') {

              //circle
              var groupCircle = group.selectAll('.group-circle').data(['group-circle'])
              groupCircle.exit().remove();
              groupCircle = groupCircle.enter().append('circle').merge(groupCircle);
              groupCircle.attr('r', attrs.attributeCircleRadius).attr('fill', d.symbolColor).attr('cy', attrs.attrsCirclePosY).attr('stroke', 'white').attr('class', 'group-circle')
            } else {

              //axis text
              var groupedText = group.selectAll('.group-text').data(['group-text'])
              groupedText.exit().remove();
              groupedText = groupedText.enter().append('text').merge(groupedText);
              groupedText.text(d.symbol).attr('fill', attrs.attrsSymbolFill).attr('text-anchor', 'middle').attr('font-size', attrs.attrsSymbolFontSize)
            }
          })

          //=======================  DRAWING BARS   =========================

          //bars
          var bars = attrGroups.selectAll('.bar').data(function (d) { return d.values; });
          bars.exit().remove();
          bars = bars.enter().append('rect').merge(bars);
          bars.attr('class', 'bar').attr('width', calc.eachBarWidth).attr('height', function (d) { var result = scales.barScale(d.value); return result; }).attr('y', function (d) { return -scales.barScale(d.value) - attrs.barsPosY; }).attr('x', function (d, i) { return i * calc.eachBarWidth + calc.barsPosX; }).attr('fill', function (d, i) { return d.legend.color; })

          //=======================  DRAWING WHITE DASHES   =========================

          for (var i = 0; i <= attrs.dashLineCount; i++) {

            //dash lines
            var dashLines = barChartWrapper.selectAll('.dashline' + i).data(['dashline' + i]);
            dashLines.exit().remove();
            dashLines = dashLines.enter().append('rect').merge(dashLines);
            dashLines.attr('width', calc.barChartWrapperWidth).attr('height', 0.1).attr('fill', 'none').attr('y', -i * calc.eachDashLineHeight - attrs.barsPosY).attr('x', calc.linesPosX).attr('stroke', 'white').attr('stroke-width', 0.5).attr('stroke-dasharray', '2 5')
          }

          //=======================  LEGENDS   =========================

          //legends
          var legends = barChartWrapper.selectAll('.legend').data(attrs.data.legends);
          legends.exit().remove();
          legends = legends.enter().append('g').merge(legends);
          legends.attr('class', 'legend').attr('transform', function (v, i) { return 'translate(' + calc.eachLegendWidth * (i + 2.35) + ',' + (- attrs.barsPosY - calc.barChartWrapperHeight - 6) + ')' })
            .each(function (d) {
              var group = d3.select(this);

              //legend group rectangle
              var groupRect = group.selectAll('.group-rect').data(['group-rect']);
              groupRect.exit().remove();
              groupRect = groupRect.enter().append('rect').merge(groupRect);
              groupRect.attr('class', 'group-rect').attr('width', attrs.legendRectWidth).attr('height', attrs.legendRectWidth).attr('fill', d.color).attr('y', attrs.legendRectPosY).attr('x', calc.legendRectPosX)

              //legend group text 
              var legendGroupText = group.selectAll('.legend-group-text').data(['legend-group-text'])
              legendGroupText.exit().remove();
              legendGroupText = legendGroupText.enter().append('text').merge(legendGroupText);
              legendGroupText.attr('class', 'legend-group-text').text(d.label).attr('fill', attrs.legendTextFill).attr('x', attrs.legendTextPosX).attr('text-anchor', 'end').attr('font-size', attrs.legendTextFontSize)

            })

          //=======================  SALES MIX MINI CIRCLE   =========================

          //sales mix mini circle wrapper
          var attributeSalesMixWrapper = chart.selectAll('.attributeSalesMixWrapper').data(['attributeSalesMixWrapper']);
          attributeSalesMixWrapper.exit().remove();
          attributeSalesMixWrapper = attributeSalesMixWrapper.enter().append('g').merge(attributeSalesMixWrapper);
          attributeSalesMixWrapper.attr('class', 'attributeSalesMixWrapper').attr('transform', 'translate(' + calc.chartWidth * 0.4 + ',' + calc.chartHeight * 1.03 + ')')

          //transition groups
          var transitionGroup = attributeSalesMixWrapper.selectAll('.transition-group').data(['transition-group']);
          transitionGroup.exit().remove();
          transitionGroup = transitionGroup.enter().append('g').merge(transitionGroup);
          transitionGroup.attr('class', 'transition-group')

          //sales mix mini circle
          var miniCircle = transitionGroup.selectAll('.mini-circle').data(['mini-circle']);
          miniCircle.exit().remove();
          miniCircle = miniCircle.enter().append('circle').merge(miniCircle);
          miniCircle.attr('fill', 'white').attr('r', attrs.salesMixMiniCircleRadius).attr('class', 'mini-circle')

          //sales mix mini circle text
          var miniCircleText = transitionGroup.selectAll('.miniCircleText').data(['mini-circle-text'])
          miniCircleText.exit().remove();
          miniCircleText = miniCircleText.enter().append('text').merge(miniCircleText);
          miniCircleText.attr('class', 'miniCircleText').text(attrs.data.name).attr('text-anchor', 'middle').attr('dy', '0.1em').attr('y', attrs.salesMixMiniCircleTextPosY).attr('fill', attrs.salesMixMiniCircleTextFill).attr('font-weight', 'bold').call(wrap, attrs.salesMixMiniCircleRadius * 1.5)

          //mini circle percent text
          var miniCirclePercent = transitionGroup.selectAll('.mini-circle-percent').data(['mini-circle-percent'])
          miniCirclePercent.exit().remove();
          miniCirclePercent = miniCirclePercent.enter().append('text').merge(miniCirclePercent);
          miniCirclePercent.attr('class', 'mini-circle-percent').text(attrs.data.value || '23 %').attr('text-anchor', 'middle').attr('dy', '1.4em').attr('font-size', attrs.salesMixMiniCircleValueFontSize).attr('fill', attrs.salesMixMiniCircleValueFill)

          // =======================  ASSIGN NEEDED PROPS   =========================
          _var.transitionGroup = transitionGroup;
          break;
      }
    }
    return _var;
  };

  ['_var', 'calc', 'attrs', 'svg', 'chart', 'centerPoint', 'scales'].forEach(function (key) {
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

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
          var centerCircle = centerPoint.selectAll('.background-circle').data(['background-circle'])
          centerCircle.exit().remove();
          centerCircle = centerCircle.enter().append('circle').merge(centerCircle);
          centerCircle.attr('class', 'background-circle').attr('fill', 'white').attr('stroke', attrs.circleStroke).attr('stroke-width', attrs.circleStrokeWidth).attr('r', calc.circleRadius)

          //header title
          var headerTitle = chart.selectAll('.header-title').data(['header-title'])
          headerTitle.exit().remove()
          headerTitle = headerTitle.enter().append('g').merge(headerTitle)
          headerTitle.attr('transform', 'translate(' + calc.centerPointX + ',' + attrs.headerTitleCirclePadding + ')').append('text').attr('class', 'header-title').text(attrs.data.title).attr('text-anchor', 'middle').attr('fill', attrs.headerTitleFill).attr('x', calc.centerPointX).attr('font-weight', 'bold').attr('font-size', attrs.headerTitleFontSize).attr('dy', '0.1em').call(wrap, calc.circleRadius).attr('pointer-events', 'none')

          //chart name
          var chartName = centerPoint.selectAll('.chart-name').data(['chart-name']);
          chartName.exit().remove();
          chartName = chartName.enter().append('text').merge(chartName);
          chartName.attr('class', 'chart-name').text(attrs.data.name).attr('y', calc.chartNamePosY).attr('x', calc.chartNamePosX).attr('text-anchor', 'end').attr('fill', attrs.chartNameFill).attr('font-size', attrs.chartNameFontSize)

          //analysis arrow
          var analysisArrow = centerPoint.selectAll('.analysis-arrow').data(['analysis-arrow'])
          analysisArrow.exit().remove();
          analysisArrow = analysisArrow.enter().append("svg:image").merge(analysisArrow);
          analysisArrow.attr('class', 'analysis-arrow').attr('width', calc.imageWidth).attr('height', calc.imageHeight).attr('x', calc.imagePosX).attr('y', calc.imagePosY).attr("xlink:href", attrs.data.image)

          //analysis wrapper
          var analysisWrapper = chart.selectAll('.analysis-wrapper').data(['analysis-wrapper']);
          analysisWrapper.exit().remove();
          analysisWrapper = analysisWrapper.enter().append('g').merge(analysisWrapper);
          analysisWrapper.attr('transform', 'translate(' + calc.analysIconPosX + ',' + calc.analysIconPosY + ')').attr('class', 'analysis-wrapper').attr('pointer-events', 'none');

          //lines
          var lines = analysisWrapper.selectAll('.lines').data(['lines']);
          lines.exit().remove();
          lines = lines.enter().append("svg:image").merge(lines);
          lines.attr('class', 'lines').attr('width', calc.analysIconWidth).attr('height', calc.analysIconHeight).attr('x', 20).attr('y', 40).attr("xlink:href", attrs.data.attrLineUrl)

          //analysis icon wrapper
          var analysIcoWrapper = analysisWrapper.selectAll('.analysis-icon-wrapper').data(['analysis-icon-wrapper']);
          analysIcoWrapper.exit().remove();
          analysIcoWrapper = analysIcoWrapper.enter().append("svg:image").merge(analysIcoWrapper);
          analysIcoWrapper.attr('class', 'analysis-icon-wrapper').attr('width', calc.analysIconWidth).attr('height', calc.analysIconHeight).attr("xlink:href", attrs.data.attrAnalysIco)

          //analysis icon circle
          var analysisIcoCircle = analysisWrapper.selectAll('.analysis-icon-circle').data(['analysis-icon-circle']);
          analysisIcoCircle.exit().remove();
          analysisIcoCircle = analysisIcoCircle.enter().append('circle').merge(analysisIcoCircle);
          analysisIcoCircle.attr('class', 'analysis-icon-circle').attr('r', 20).attr('fill', attrs.analysisWrapperSmallCircleFill).attr('cy', calc.analysIconHeight + 30).attr('cx', 20);

          //attribute groups
          var attributeGroups = chart.selectAll('.attributes').data(attrs.data.attributes);
          attributeGroups.exit().remove();
          attributeGroups = attributeGroups.enter().append('g').merge(attributeGroups);
          attributeGroups.attr('class', 'attributes').attr('transform', function (d, i) { var x = i * calc.eachAttributSpaceWidth + calc.dividerGroupOffset; return 'translate(' + x + ',' + calc.attrGroupPosY + ')' })

          //group symbols and texts
          attributeGroups.each(function (d, i, arr) {
            var group = d3.select(this);
            if (d.symbol == 'circle') {

              //group circle
              var groupCircle = group.selectAll('.group-circle').data(['group-circle']);
              groupCircle.exit().remove();
              groupCircle = groupCircle.enter().append('circle').merge(groupCircle);
              groupCircle.attr('class', 'group-circle').attr('r', calc.attributeCircleRadius).attr('fill', d.color).attr('cy', calc.attrsCirclePosY)
            } else {

              //group texts
              var groupText = group.selectAll('.group-text').data(['group-text']);
              groupText.exit().remove();
              groupText = groupText.enter().append('text').merge(groupText);
              groupText.text(d.symbol).attr('class', 'group-text').attr('fill', attrs.attrsSymbolFill).attr('text-anchor', 'middle').attr('font-size', attrs.attrsSymbolFontSize).attr('y', calc.attrGroupTextPosY).attr("dominant-baseline", "central")
                .attr('x', function () {
                  var result = calc.attrGroupTextPosX;
                  if (d.symbol.length > 3) result += calc.chartWidth * 0.03;
                  return result;
                })
                .style("font-size", function () {
                  var result = 20;
                  if (d.symbol.length < 2) result = 43;
                  else if (d.symbol.length < 4) result = 34;
                  else if (d.symbol.length < 7) result = 26;
                  else result = 10;
                  return result + 'px';
                })
            }
            if (i < arr.length - 1) {

              //group rects
              var groupRect = group.selectAll('.group-rect').data(['group-rect']);
              groupRect.exit().remove();
              groupRect = groupRect.enter().append('rect').merge(groupRect);
              groupRect.attr('class', 'group-rect').attr('width', attrs.dividerWidth).attr('height', calc.attrsGroupDividerHeight).attr('fill', attrs.attrsGroupDividerFill).attr('x', calc.attrsDividerPosX).attr('y', -calc.attrsGroupDividerHeight)
            }
          })

          //attribute names
          var attributeNames = attributeGroups.selectAll('.attribute-name').data(d => [d])
          attributeNames.exit().remove();
          attributeNames = attributeNames.enter().append('text').merge(attributeNames);
          attributeNames.attr('class', 'attribute-name').attr('y', calc.chartAttrsPosY).attr('dy', '-0.4em').attr('text-anchor', 'middle').attr('fill', attrs.attrsNameFill).attr('font-size', attrs.attrsNameFontSize).text(function (d) { return d.name }).call(wrap, calc.attrNamesWrapLength);

          //attribute percents
          var attributePercents = attributeGroups.selectAll('.attribute-percent').data(d => [d])
          attributePercents.exit().remove();
          attributePercents = attributePercents.enter().append('text').merge(attributePercents);
          attributePercents.attr('class', 'attribute-percent').attr('y', calc.chartAttrsPercPosY).attr('x', calc.attrsPercPosX).attr('text-anchor', 'middle').attr('fill', attrs.attrsPercFill).attr('font-size', attrs.attrsPercentFontSize).text(function (d) { return d.percent + '%'; })

          // =======================  ASSIGN NEEDED PROPS   =========================
          _var.chartName = chartName;
          _var.headerTitle = headerTitle;
          _var.analysisWrapper = analysisWrapper;
          _var.analysisArrow = analysisArrow;
          _var.attributeNames = attributeNames;
          _var.attributePercents = attributePercents;
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

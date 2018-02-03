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

          //background circle
          var backgroundCircle = centerPoint.selectAll('.background-circle').data(['background-circle']);
          backgroundCircle.exit().remove();
          backgroundCircle = backgroundCircle.enter().append('circle').merge(backgroundCircle);
          backgroundCircle.attr('class', 'background-circle').attr('fill', 'url(#rectangularPattern)').attr('stroke', attrs.circleStroke).attr('stroke-width', attrs.circleStrokeWidth).attr('r', calc.circleRadius)

          //header title
          var headerTitle = chart.selectAll('.header-title').data(['header-title']);
          headerTitle.exit().remove()
          headerTitle = headerTitle.enter().append('text').merge(headerTitle);
          headerTitle.attr('class', 'header-title').text(attrs.data.title).attr('text-anchor', 'middle').attr('fill', attrs.headerTitleFill).attr('x', calc.centerPointX).attr('y', attrs.headerTitleCirclePadding).attr('font-weight', 'bold').attr('font-size', attrs.headerTitleFontSize)

          //chart name
          var chartName = centerPoint.selectAll('.chart-name').data(['chart-name']);
          chartName.exit().remove();
          chartName = chartName.enter().append('text').merge(chartName);
          chartName.attr('class', 'chart-name').text(attrs.data.name).attr('text-anchor', 'middle').attr('fill', attrs.chartNameFill).attr('y', calc.chartNamePosY).attr('font-size', attrs.chartNameFontSize)

          //map wrapper
          var mapWrapper = chart.selectAll('.map-wrapper').data(['map-wrapper']);
          mapWrapper.exit().remove();
          mapWrapper = mapWrapper.enter().append('g').merge(mapWrapper);
          mapWrapper.attr('class', 'map-wrapper').attr('transform', 'translate(300,140)')

          //scales  
          var scale = 300;
          var offset = [410, 248];

          //projections
          var projection = d3.geoMercator().scale(scale).translate(offset);

          //paths
          var path = d3.geoPath().projection(projection);
          var arr = [];

          //map path drawing
          var mapPaths = mapWrapper.selectAll('.map-path').data(calc.featuresWithoutAlaskaAndHavai);
          mapPaths.exit().remove();
          mapPaths = mapPaths.enter().append('path').merge(mapPaths);
          mapPaths.attr('class', 'map-path').attr('d', path).style('stroke', '#fff').style('stroke-width', '1px').style('fill', function (d) { return scales.colorIndex(d.properties.value) });

          //short chart name
          var shortChartName = chart.selectAll('.short-chart-name').data(['short-chart-name']);
          shortChartName.exit().remove();
          shortChartName = shortChartName.enter().append('text').merge(shortChartName);
          shortChartName.attr('class', 'short-chart-name').text(attrs.data.name).attr('text-anchor', 'start').attr('fill', attrs.shortChartNameFill).attr('x', calc.legendPosX).attr('y', calc.legendPosY - attrs.eachLegendHeight * attrs.colorRanges.length).attr('font-weight', 'bold').attr('font-size', attrs.insightTitleFontSize)

          //legends
          var legends = chart.selectAll('.legend').data(attrs.colorRanges)
          legends.exit().remove();
          legends = legends.enter().append('g').merge(legends);
          legends.attr('class', 'legend').attr('transform', function (d, i) { var y = calc.legendPosY - i * attrs.eachLegendHeight; return 'translate(' + calc.legendPosX + ',' + y + ')'; })

          //rect legends
          var rectLegend = legends.selectAll('.rect-legend').data(d => [d]);
          rectLegend.exit().remove();
          rectLegend = rectLegend.enter().append('rect').merge(rectLegend);
          rectLegend.attr('class', 'rect-legend').attr('width', attrs.eachLegendHeight).attr('height', attrs.eachLegendHeight).attr('fill', function (d) { return d; })

          //rect legend texts
          var rectLegendTexts = legends.selectAll('.rect-legend-texts').data(d => [d])
          rectLegendTexts.exit().remove();
          rectLegendTexts = rectLegendTexts.enter().append('text').merge(rectLegendTexts);
          rectLegendTexts.attr('class', 'rect-legend-texts').text(function (d) { var min = d3.min(scales.colorIndex.invertExtent(d)); var text = Math.floor(min); return text + '%'; }).attr('x', calc.legendTextPosX).attr('y', calc.legendTextPosY).attr('fill', attrs.legendTextFill).attr('font-size', attrs.legendTextFontSize)

          // // path where insight will transition
          // var transitionPath = d3.selectAll('.transition-path').data(['transition-path']);
          // transitionPath.exit().remove();
          // transitionPath = transitionPath.enter().append('path').merge(transitionPath);
          // transitionPath.attr('d', 'M 145 120 C 365 105 470 420 150 510 ').attr('stroke', 'black').attr('fill', 'black').attr('stroke-width', 5).attr('class', 'transition-path');

          //=======================  DRAWING INSIGHTS CONNECTED CIRCLE  =========================
          //insights wrapper
          var insightsWrapper = chart.selectAll('.insights-wrapper').data([attrs.data.insights]);
          insightsWrapper.exit().remove();
          insightsWrapper = insightsWrapper.enter().append('g').merge(insightsWrapper);
          insightsWrapper.attr('class', 'insights-wrapper').attr('pointer-events', 'none')
          // .attr('transform', 'translate(' + calc.chartWidth * 0.7 + ',' + calc.chartWidth * 0.87 + ') ')

          var connectorLine = insightsWrapper.selectAll('.connector-line').data(['connector-line']);
          connectorLine.exit().remove();
          connectorLine = connectorLine.enter().append('line').merge(connectorLine);
          connectorLine.attr('class', 'connector-line')
            .attr('x1', -70)
            .attr('x2', 0)
            .attr('y1', 10)
            .attr('y2', -45)
            .attr('stroke-width', 2.5)
            .attr('stroke', '#9D91AA')

          //insight lines wrapper
          var insightLinesWrapper = insightsWrapper.selectAll('.insight-lines-wrapper').data(d => [d])
          insightLinesWrapper.exit().remove();
          insightLinesWrapper = insightLinesWrapper.enter().append('g').merge(insightLinesWrapper);
          insightLinesWrapper.attr('class', 'insight-lines-wrapper').attr('fill', 'none').attr('transform', 'rotate(-50) ')

          //profile image
          var profileImage = chart.selectAll('.profile-image').data(['profile-image'])
          profileImage.exit().remove();
          profileImage = profileImage.enter().append("svg:image").merge(profileImage);
          profileImage.attr('class', 'profile-image').attr('width', calc.imageWidth).attr('height', calc.imageHeight).attr('x', calc.imagePosX).attr('y', calc.imagePosY).attr("xlink:href", attrs.data.image)

          //insight lines
          insightLinesWrapper.each(function (d) {
            var wrapper = d3.select(this);

            //predefined start and end point
            var start = {
              x: 10,
              y: 10
            }
            var end = {
              x: 60,
              y: 10
            }

            //arc configs
            var controlPointDiffX = 14;
            var pullPointY = 12;
            var controllPoints = " C " + (start.x + controlPointDiffX) + " " + (start.y + pullPointY) + ", " + (end.x - controlPointDiffX) + " " + (end.y + pullPointY) + ", ";
            var arc = 'M' + start.x + " " + start.y + controllPoints + end.x + ' ' + end.y;

            //line point calculations and configs
            var lineDeviations = 15;
            var lineLength = 45
            var lineCoordinates = {
              first: {
                connectedCircleRadius: 6,
                start: {
                  x: start.x,
                  y: start.y
                },
                end: {
                  x: start.x - lineDeviations,
                  y: start.y + lineLength
                }
              },
              last: {
                connectedCircleRadius: 9,
                start: {
                  x: end.x,
                  y: end.y
                },
                end: {
                  x: end.x + lineDeviations,
                  y: end.y + lineLength
                }
              },
              middle: {
                connectedCircleRadius: 11,
                start: {
                  x: (start.x + end.x) / 2,
                  y: end.y + pullPointY - 2
                },
                end: {
                  x: (start.x + end.x) / 2,
                  y: end.y + lineLength * 1.5
                }
              }
            };
            var firstLine = "M" + lineCoordinates.first.start.x + ' ' + lineCoordinates.first.start.y + ' L ' + (lineCoordinates.first.end.x) + " " + (lineCoordinates.first.end.y)
            var lastLine = "M" + lineCoordinates.last.start.x + ' ' + lineCoordinates.last.start.y + ' L ' + (lineCoordinates.last.end.x) + " " + (lineCoordinates.last.end.y)
            var middleLine = "M" + lineCoordinates.middle.start.x + ' ' + lineCoordinates.middle.start.y + ' L ' + (lineCoordinates.middle.end.x) + " " + (lineCoordinates.middle.end.y)

            //connect everything
            var result = arc + firstLine + middleLine + lastLine;

            //insight Lines
            var insightWrapperLines = wrapper.selectAll('.insight-wrapper-lines').data(['insight-wrapper-lines'])
            insightWrapperLines.exit().remove();
            insightWrapperLines = insightWrapperLines.enter().append('path').merge(insightWrapperLines);
            insightWrapperLines.attr('d', result).attr('class', 'insight-wrapper-lines').attr('stroke', attrs.insightLineFill).attr('stroke-width', attrs.insightLineStrokeWidth)

            //add circles at the end of lines
            var keys = Object.keys(lineCoordinates);
            keys.forEach(function (lineCoordKey) {
              var lineCoord = lineCoordinates[lineCoordKey];

              //line circles
              var lineCircles = wrapper.selectAll('.wrapper-circles' + lineCoordKey).data(['wrapper-circles' + lineCoordKey]);
              lineCircles.exit().remove();
              lineCircles = lineCircles.enter().append('circle').merge(lineCircles);
              lineCircles.attr('class', 'wrapper-circles' + lineCoordKey).attr('cx', lineCoord.end.x).attr('cy', lineCoord.end.y).attr('r', lineCoord.connectedCircleRadius).attr('fill', attrs.insightCircleFill).attr('stroke', 'none')
            })

            //add texts
            var insightTextWrapper = wrapper.selectAll('.insight-text-wrapper').data(d => [d])
            insightTextWrapper.exit().remove();
            insightTextWrapper = insightTextWrapper.enter().append('g').merge(insightTextWrapper);
            insightTextWrapper.attr('class', 'insight-text-wrapper');

            //last text
            var lastText = insightTextWrapper.selectAll('.last-text').data(['last-text']);
            lastText.exit().remove();
            lastText = lastText.enter().append('text').merge(lastText);
            lastText.attr('class', 'last-text').text(d.endPos.value).attr('x', lineCoordinates.last.end.x + 30).attr('y', -20).attr('fill', attrs.insightValueTextFill).attr('transform', 'rotate(50)')

            //insight title
            var insightTitle = insightTextWrapper.selectAll('.insight-title').data(d => [d]);
            insightTitle.exit().remove();
            insightTitle = insightTitle.enter().append('text').merge(insightTitle);
            insightTitle.text(d.endPos.title).attr('class', 'insight-title').attr('x', lastText.attr('x')).attr('y', -5).attr('fill', attrs.insightTitleFill).attr('font-size', attrs.insightTitleFontSize).attr('font-weight', 'bold').attr('transform', 'rotate(50)')

            //middle text 
            var middleText = insightTextWrapper.selectAll('.middle-text').data(d => [d]);
            middleText.exit().remove();
            middleText = middleText.enter().append('text').merge(middleText);
            middleText.attr('class', 'middle-text').text(d.midPos.value).attr('x', lineCoordinates.middle.end.x + 60).attr('y', 25).attr('fill', attrs.insightValueTextFill).attr('transform', 'rotate(50)')

            //middle text title
            var middleTextTitle = insightTextWrapper.selectAll('.middle-text-title').data(d => [d]);
            middleTextTitle.exit().remove();
            middleTextTitle.enter().append('text').merge(middleTextTitle);
            middleTextTitle.attr('class', 'middle-text-title').text(d.midPos.title).attr('x', middleText.attr('x')).attr('y', +middleText.attr('y') + 15).attr('fill', attrs.insightTitleFill).attr('font-weight', 'bold').attr('font-size', attrs.insightTitleFontSize).attr('transform', 'rotate(50)')

            //first title
            var firstTitle = insightTextWrapper.selectAll('.first-text-title').data(d => [d]);
            firstTitle.exit().remove();
            firstTitle = firstTitle.enter().append('text').merge(firstTitle);
            firstTitle.attr('class', 'first-text-title').text(d.startPos.title).attr('x', lineCoordinates.first.end.x + 45).attr('y', 60).attr('fill', attrs.insightTitleFill).attr('font-size', attrs.insightTitleFontSize).attr('font-weight', 'bold').attr('transform', 'rotate(50)')

            // insight array items
            var items = insightTextWrapper.selectAll('first-insight-array-item').data(d.startPos.values);
            items.exit().remove();
            items = items.enter().append('g').merge(items);
            items.attr('transform', 'translate(-70,40) rotate(50)').attr('class', 'first-insight-array-item')
            var prevPosX = 0;

            // items texts
            var texts = items.selectAll('.items-text').data(d => [d])
            texts.enter().remove();
            texts = texts.enter().append('text').merge(texts);
            texts.attr('class', 'items-text').text(function (d) { return d.name; }).attr('fill', attrs.insightValueTextFill).attr('font-size', attrs.firstLineTextFontSize)
              .each(function (d) {
                var text = d3.select(this);
                var bbox = text.node().getBBox();
                prevPosX += bbox.width + 15;
                d.currPos = prevPosX;
                d.width = bbox.width + 10;
                d.height = bbox.height + 5;
              })
              .attr('x', function (d) {
                return d.currPos;
              }).attr('font-weight', 'bold')



            // text background rects
            var textBgRects = items.selectAll('.bg-rects').data(d => [d])
            textBgRects.exit().remove();
            textBgRects = textBgRects.enter().insert('rect', "text").merge(textBgRects);
            textBgRects.attr('class', 'bg-rects').attr('width', function (d) { return d.width; }).attr('height', function (d) { return d.height; }).attr('fill', 'white').attr('x', function (d) { return d.currPos - 2; }).attr('y', -14)
          })

          // =======================  ASSIGN NEEDED PROPS   =========================
          _var.headerTitle = headerTitle;
          _var.chartName = chartName;
          _var.insightsWrapper = insightsWrapper;
          _var.profileImage = profileImage;
          _var.legends = legends;
          _var.shortChartName = shortChartName;
          _var.connectorLine = connectorLine;
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

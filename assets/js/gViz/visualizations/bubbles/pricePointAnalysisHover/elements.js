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
  var arcs = undefined;
  var layouts = undefined;
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
        if (!arcs) console.log('not valid -arcs');
        if (!layouts) console.log('not valid -layouts');
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
          backgroundCircle.attr('class', 'background-circle').attr('fill', attrs.circleFill).attr('stroke', attrs.circleStroke).attr('stroke-width', attrs.circleStrokeWidth).attr('r', calc.circleRadius)

          //chart name
          var chartName = centerPoint.selectAll('.chart-name').data(['chart-name']);
          chartName.exit().remove();
          chartName = chartName.enter().append('text').merge(chartName);
          chartName.attr('class', 'chart-name').text(attrs.data.name).attr('text-anchor', 'middle').attr("dominant-baseline", "central").attr('font-size', attrs.chartNameFontSize).attr('font-weight', 'bold').attr('dy', '-0.1em').attr('y', -calc.chartWidth / 30).attr('fill', attrs.chartNameFill).call(wrap, calc.chartNameWrapWidth)

          //donut paths
          var salesMixDonutPaths = centerPoint.selectAll('.salesMixDonutChart').data(layouts.pie(attrs.data.values))
          salesMixDonutPaths.exit().remove();
          salesMixDonutPaths = salesMixDonutPaths.enter().append('path').merge(salesMixDonutPaths);
          salesMixDonutPaths.attr('class', 'salesMixDonutChart').attr('fill', 'white').attr('opacity', function (d, i, dataArr) { return 1 - (i / dataArr.length); }).attr('d', arcs.pie)

          //sales mix lines
          var salesMixLines = centerPoint.selectAll('line.salesMixLabelLine').data(layouts.pie(attrs.data.values))
          salesMixLines.exit().remove();
          salesMixLines = salesMixLines.enter().append('line').merge(salesMixLines);
          salesMixLines.attr('class', 'salesMixLabelLine').attr('x1', 0).attr('x2', 0).attr('y1', -calc.pieOuterRadius + calc.donutHalfRadius).attr('y2', -calc.lineEndPosY).attr('stroke', 'white').attr('transform', function (d) { return 'rotate(' + (d.startAngle + d.endAngle) / 2 * (180 / Math.PI) + ')'; });

          //price point label
          var pricePointLabel = centerPoint.selectAll('text.PricePointLabel').data(layouts.pie(attrs.data.values))
          pricePointLabel.exit().remove();
          pricePointLabel = pricePointLabel.enter().append('text').merge(pricePointLabel);
          pricePointLabel.attr('fill', attrs.priceRangeFill).attr('font-size', '11px').attr('class', 'PricePointLabel').attr('font-size', 15).text(function (d) { return d.data.priceRange; }).attr('text-anchor', function (d) { return 'middle'; })
            .attr('transform', function (d, i, arr) {
              var c = arcs.pie.centroid(d),
                x = c[0],
                y = c[1],
                // pythagorean theorem for hypotenuse
                h = Math.sqrt(x * x + y * y);
              if (i === arr.length - 1) {
                return 'translate(' + 15 +
                  ',' + (y / h * (calc.LabelPosY)) + ')';
              }
              return 'translate(' + (x / h * (calc.LabelPosY)) +
                ',' + (y / h * (calc.LabelPosY + 10)) + ')';

            })
            .attr('dy', function (d, i) {
              if (i === 0) {
                return -20;
              }
              if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 &&
                (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5) {
                return 20;
              } else {
                return -10;
              }
            })


          //sales mix labels
          var salesMixLabel = centerPoint.selectAll('text.salesMixLabel').data(layouts.pie(attrs.data.values))
          salesMixLabel.exit().remove();
          salesMixLabel = salesMixLabel.enter().append('text').merge(salesMixLabel);
          salesMixLabel.attr('fill', 'white').attr('font-size', '20px').attr('class', 'salesMixLabel').text(function (d) { return d.data.value + '%'; }).attr('text-anchor', function (d) { return (d.endAngle + d.startAngle) / 2 > Math.PI ? 'end' : 'start'; })
            .attr('transform', function (d, i, arr) {
              var c = arcs.pie.centroid(d),
                x = c[0],
                y = c[1],
                // pythagorean theorem for hypotenuse
                h = Math.sqrt(x * x + y * y);
              if (i === arr.length - 1) {
                return 'translate(' + 10 +
                  ',' + (y / h * (calc.lineEndPosY)) + ')';
              }
              return 'translate(' + (x / h * (calc.lineEndPosY)) +
                ',' + (y / h * (calc.lineEndPosY)) + ')';

            })
            .attr('dy', function (d) {
              if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 &&
                (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5) {
                return 12;
              } else {
                return 0;
              }
            })

          // =======================  ASSIGN NEEDED PROPS   =========================
          // nothing to assign :)
          break;
      }
    }
    return _var;
  };

  ['_var', 'calc', 'attrs', 'svg', 'chart', 'centerPoint', 'layouts', 'arcs'].forEach(function (key) {

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

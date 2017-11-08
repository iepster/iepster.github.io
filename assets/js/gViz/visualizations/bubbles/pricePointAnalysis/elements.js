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
          backgroundCircle.attr('class', 'background-circle').attr('fill', 'white').attr('stroke', attrs.circleStroke).attr('stroke-width', attrs.circleStrokeWidth).attr('r', calc.circleRadius)

          //header title
          var headerTitle = chart.selectAll('.header-title').data(['header-title'])
          headerTitle.exit().remove()
          headerTitle = headerTitle.enter().append('text').merge(headerTitle);
          headerTitle.attr('x', 450).attr('transform', 'translate(' + calc.circleRadius * 2 + ',0)').attr('class', 'header-title').attr('text-anchor', 'middle').text(attrs.data.title).attr('text-anchor', 'middle').attr('fill', attrs.headerTitleFill).attr('x', calc.circleRadius).attr('y', calc.chartTitlePosY).attr('dy', '0.3em').attr('font-weight', 'bold').attr('font-size', attrs.headerTitleFontSize).call(wrap, 200)

          //chart name
          var chartName = centerPoint.selectAll('.chart-name').data(['chart-name']);
          chartName.exit().remove();
          chartName = chartName.enter().append('text').merge(chartName);
          chartName.attr('class', 'chart-name').text(attrs.data.name).attr('y', calc.chartNamePosY).attr('text-anchor', 'middle').attr('fill', attrs.chartNameFill).attr('font-size', attrs.chartNameFontSize)

          //chart percent
          var chartNamePercent = centerPoint.selectAll('.chart-name-percent').data(['chart-name-percent']);
          chartNamePercent.exit().remove();
          chartNamePercent = chartNamePercent.enter().append('text').merge(chartNamePercent);
          chartNamePercent.attr('class', 'chart-name-percent').text(attrs.data.percent + '%').attr('y', -calc.percentPosY).attr('text-anchor', 'start').attr('fill', attrs.chartNameFill).attr('font-size', attrs.percentFontSize)

          //price wrapper
          var priceWrapper = centerPoint.selectAll('.price-wrapper').data(['price-wrapper']);
          priceWrapper.exit().remove();
          priceWrapper = priceWrapper.enter().append('g').merge(priceWrapper);
          priceWrapper.attr('class', 'price-wrapper').attr('transform', 'translate(0,' + attrs.priceWrapperBottomPos + ')');

          //min price
          var minPrice = priceWrapper.selectAll('.min-price').data(['min-price'])
          minPrice.exit().remove();
          minPrice = minPrice.enter().append('text').merge(minPrice);
          minPrice.attr('class', 'min-price').text(calc.minText).attr('text-anchor', 'end').attr('fill', attrs.priceFill).attr('x', -attrs.priceMarginFromCenter).attr('font-size', attrs.priceFontSize)

          //divider-symbol
          var dividerSymbol = priceWrapper.selectAll('.divider-symbol').data(['divider-symbol'])
          dividerSymbol.exit().remove();
          dividerSymbol = dividerSymbol.enter().append('text').merge(dividerSymbol);
          dividerSymbol.attr('class', 'chart-name').text('-').attr('text-anchor', 'middle').attr('fill', attrs.chartNameFill).attr('font-size', attrs.priceFontSize)

          //max price
          var maxPrice = priceWrapper.selectAll('.max-price').data(['max-price']);
          maxPrice.exit().remove();
          maxPrice = maxPrice.enter().append('text').merge(maxPrice);
          maxPrice.attr('class', 'max-prcie').text(calc.maxText).attr('text-anchor', 'start').attr('fill', attrs.priceFill).attr('font-size', attrs.chartNameFontSize).attr('x', attrs.priceMarginFromCenter).attr('font-size', attrs.priceFontSize)

          //mini pie center
          var miniPieCenter = centerPoint.selectAll('.mini-pie-center').data(['mini-pie-center']);
          miniPieCenter.exit().remove();
          miniPieCenter = miniPieCenter.enter().append('g').merge(miniPieCenter);
          miniPieCenter.attr('class', 'mini-pie-center').attr('transform', 'translate(' + calc.miniPiePosX + ',' + calc.miniPiePosY + ')')

          //back-arc
          var backArc = miniPieCenter.selectAll('.back-arc').data(layouts.pie([{ value: 1, color: attrs.miniPieBackgroundFill }]))
          backArc.exit().remove();
          backArc = backArc.enter().append('g').merge(backArc);
          backArc.attr('class', 'back-arc').append('path').attr('d', arcs.pie).attr('fill', function (d) { return d.data.color; })

          //mini pie arcs
          var miniPieArc = miniPieCenter.selectAll('.arc').data(layouts.pie([{ value: attrs.data.percent, color: attrs.miniPieForegroundFill }, { value: 100 - attrs.data.percent, color: "none" }]))
          miniPieArc.exit().remove();
          miniPieArc = miniPieArc.enter().append('g').merge(miniPieArc);
          miniPieArc.attr('class', 'arc').append('path').attr('d', arcs.pie).attr('fill', function (d) { return d.data.color; })



          var salesMixExternalMiniDonutLine = chart.selectAll('.salesMixExternalMiniDonutLine').data(['salesMixExternalMiniDonutLine']);
          salesMixExternalMiniDonutLine.exit().remove();
          salesMixExternalMiniDonutLine = salesMixExternalMiniDonutLine.enter().insert('line').merge(salesMixExternalMiniDonutLine);
          salesMixExternalMiniDonutLine.attr('x1', 0).attr('y1', 15).attr('x2', 38).attr('y2', 60).attr('stroke', '#9D91AA').attr('transform', 'translate(' + (calc.chartWidth * 1.06) + ',' + (calc.chartWidth / 2.5) + ')').attr('stroke-width', 2.5)


          //sales mix mini donut wrapper
          var salesMixExternalMiniDonut = centerPoint.selectAll('.sales-mix-mini-donut-wrapper').data(['sales-mix-mini-donut-wrapper']);
          salesMixExternalMiniDonut.exit().remove();
          salesMixExternalMiniDonut = salesMixExternalMiniDonut.enter().append('g').merge(salesMixExternalMiniDonut);
          salesMixExternalMiniDonut.attr('class', 'sales-mix-mini-donut-wrapper').attr('pointer-events', 'none')

          //donut background
          var circle = salesMixExternalMiniDonut.selectAll('.back-circle').data(['back-circle']);
          circle.exit().remove();
          circle = circle.enter().append('circle').merge(circle);
          circle.attr('class', 'back-circle').attr('r', 55).attr('fill', '#EA5C84')

          //donut paths
          var donutPaths = salesMixExternalMiniDonut.selectAll('path.salesMixMiniDonutChart').data(layouts.salesDonutPie([1, 1, 1, 1, 1]));
          donutPaths.exit().remove();
          donutPaths = donutPaths.enter().append('path').merge(donutPaths);
          donutPaths.attr('class', 'salesMixMiniDonutChart').attr('fill', 'white').attr('opacity', function (d, i, arr) { return 1 - (i / arr.length); }).attr('d', arcs.salesDonutPie);

          // =======================  ASSIGN NEEDED PROPS   =========================
          _var.salesMixExternalMiniDonut = salesMixExternalMiniDonut;
          _var.headerTitle = headerTitle;
          _var.chartName = chartName;
          _var.salesMixExternalMiniDonutLine = salesMixExternalMiniDonutLine;
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

// Imports
var d3 = require("d3");
var common = require("../common");
var bubbleComponents = require('../../_init.js').bubbleComponents;

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var attrs = undefined;
  var layoutType = undefined;
  var chartsContainer = undefined;
  var urlLocation = undefined;
  var data;

  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run': {
        if (!layoutType) {
          console.log('valdiation error - layoutType')
        }
        if (!chartsContainer) {
          console.log('valdiation error - chartsContainer')
        }
        if (!data) {
          console.log('valdiation error - data')
        }
        if (!urlLocation) {
          console.log('valdiation error - urlLocation')
        }
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

          var allCharts = [];

          //=======================  DRAWING DIVS  =========================
          //get layout
          var layouts = common.layouts[layoutType];
          var layoutKeys = Object.keys(layouts).filter(k => k != 'salesStockAnalysis');
          var wrapper = d3.select(chartsContainer);

          //chart wrapper divs
          var wrapperDivs = wrapper.selectAll('.chart-wrapper-div').data(layoutKeys, function (d) { return d; })
          wrapperDivs.exit().remove();
          wrapperDivs = wrapperDivs.enter().append('div').merge(wrapperDivs);
          wrapperDivs.attr('class', function (d) { return ' chart-wrapper-div ' + d; }).style('width', 0).style('height', 0).style("position", "absolute");

          //stock sales
          var salesStockAnalysisKeys = Object.keys(layouts.salesStockAnalysis);
          wrapper.selectAll('.chart-wrapper-div')

          // stock sales wrapper divs
          var stockSalesWrapperDivs = wrapper.selectAll('.stock-wrapper-div').data(salesStockAnalysisKeys, function (d) { return d; })
          stockSalesWrapperDivs.exit().remove();
          stockSalesWrapperDivs = stockSalesWrapperDivs.enter().append('div').merge(stockSalesWrapperDivs);
          stockSalesWrapperDivs.attr('class', function (d) { return 'chart-wrapper-div stock-wrapper-div salesStockAnalysis ' + d; }).style('width', 0).style('height', 0).style("position", "absolute");

          //=======================  DINAMICALLY DRAWING CHARTS BASED LAYOUT CONFIG  =========================
          wrapperDivs.each(function (d) {
            var layout = layouts[d];
            var chartsSelector = chartsContainer + ' .' + d;
            var chart = bubbleComponents[d]()

            //  ----------- DIVS UPDATING STYLE  -----------
            d3.select(this).style('top', layout.y + "px")
            d3.select(this).style('left', layout.x + "px")
            var keys = Object.keys(layout.invokables);
            keys.forEach(k => {

              // invoke function dinamically based on layout
              chart[k](layout.invokables[k])

              //set urlLocation for chart if exists
              if (chart.urlLocation) chart.urlLocation(urlLocation)
            })
            chart.container(chartsSelector).data(data[d]).run()
            allCharts.push({ "key": d, chart: chart, layout: layout });
          });

          //=======================  DINAMICALLY DRAWING STOCK SALES ANALYSIS BUBBLES =========================
          stockSalesWrapperDivs.each(function (d) {
            var layout = layouts.salesStockAnalysis[d];
            var chartsSelector = chartsContainer + ' .salesStockAnalysis.' + d;
            var chart = bubbleComponents.salesStockAnalysis()

            //  ----------- DIVS UPDATING STYLE  -----------
            d3.select(this).style('top', layout.y + "px")
            d3.select(this).style('left', layout.x + "px")
            var keys = Object.keys(layout.invokables);
            keys.forEach(k => {

              // invoke function dinamically based on layout
              chart[k](layout.invokables[k])
            })

            chart.container(chartsSelector).data(data.salesStockAnalysis[d]).run()
            allCharts.push({ "key": "salesStockAnalysis", "subKey": d, chart: chart, layout: layout });
          });

          // =======================  ASSIGN NEEDED PROPS   =========================
          _var.allCharts = allCharts;

          break;
      }
    }

    return _var;
  };

  // Expose Global Variables
  ['_var', 'layoutType', 'chartsContainer', 'data', 'urlLocation'].forEach(function (key) {

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

  // Executa main step func
  main.run = _ => main('run');

  return main;
};

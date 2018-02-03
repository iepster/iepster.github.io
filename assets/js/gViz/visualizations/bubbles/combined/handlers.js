// Imports
var d3 = require("d3");
var common = require("../common");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var allCharts = undefined;
  var STATES = common.STATES;

  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run': {
        if (!allCharts) console.log('not valid - allCharts');
        return true;
      }
      default: return false;
    }
  };

  // Main function
  var main = function (step) {

    // Validate attributes if necessary
    if (validate(step)) {
      switch (step) {
        case 'run':

          // filter static bubbles
          allCharts = allCharts.filter(f => f.key != "mainProductBubble");

          // initial stated charts
          var initialCharts = allCharts.filter(f => {
            return f.chart.state() == "INITIAL";
          })

          initialCharts.forEach(initial => {
            var chart = initial.chart;

            // hide other charts on hover and display linked ones
            chart
              .hoverStart(function () {
                initialCharts.forEach(ch => ch.chart.state('SHADOWED'));
                if (initial.layout.linkedBubbles) {
                  initial.layout.linkedBubbles.forEach(l => {
                    var linkedChart
                    if (initial.key == "salesStockAnalysis") {
                      linkedChart = allCharts.filter(c => c.key == 'salesStockAnalysis' && c.subKey == l)[0];
                    } else {
                      linkedChart = allCharts.filter(c => c.key == l)[0];
                    }
                    linkedChart.chart.state("ACTIVE");
                  });
                }
                chart.state("ACTIVE")
              })
              .hoverEnd(function () {
                if (initial.layout.linkedBubbles) {
                  initial.layout.linkedBubbles.forEach(l => {
                    var linkedChart
                    if (initial.key == "salesStockAnalysis") {
                      linkedChart = allCharts.filter(c => c.key == 'salesStockAnalysis' && c.subKey == l)[0];
                    } else {
                      linkedChart = allCharts.filter(c => c.key == l)[0];
                    }
                    linkedChart.chart.state("HIDDEN");
                  });
                }
                initialCharts.forEach(ch => ch.chart.state('INITIAL'));
              })
          });
      }
    }
    return _var;
  };

  ['_var', 'allCharts'].forEach(function (key) {

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

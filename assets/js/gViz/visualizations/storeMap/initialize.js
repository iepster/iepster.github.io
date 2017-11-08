// Imports
var d3 = require("d3");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var data = undefined;
  var _var = undefined;
  var attrs = undefined;
  var handlers = undefined;

  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run': {
        if (!data) {
          console.log('valdiation error - data')
        }

        if (!handlers) {
          console.log('valdiation error - handlers')
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

        case 'run':
          //override
          var keys = Object.keys(attrs.data.overridableParams);
          keys.forEach(key => {
            attrs[key] = attrs.data.overridableParams[key];
          })
          //override attr values

          {

            var props = d3.select(attrs.container).node().getBoundingClientRect();


            attrs.svgHeight = attrs.svgWidth * props.height / props.width + 25;
          }

          //calculated properties
          var calc = {};


          calc.chartLeftMargin = attrs.marginLeft;
          calc.chartTopMargin = attrs.marginTop;

          calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
          calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;

          // Get values for map
          attrs._data = { map: {} };
          attrs.data.stores.forEach(function(d) {

            // Get state
            var state = d.state.toString().toLowerCase();

            // Initialize new values
            if(attrs._data.map[state] == null) {
              attrs._data.map[state] = { salesSum: 0, salesPerc: 0 };
            }

            // Store values
            d.values.forEach(function(v) {
              attrs._data.map[state].salesSum += +v.sales;
              attrs._data.map[state].salesPerc += +v.salesPerc * 100;
            });
          });

          //filter alaska
          calc.featuresWithoutAlaska = attrs.data.map.features.filter(function (d) {
            return d.properties.abbr != 'ak';
          });


          //summarize
          attrs.data.stores.forEach(d => {
            d.salesSum = d3.sum(d.values, p => +p.sales);
            d.salesPercSum = d3.sum(d.values, p => +p.salesPerc * 100)
          });

          //#############################   SCALES    ##################################
          var scales = {}
          var min = d3.min(attrs.data.stores, d => +d.salesSum);
          var max = d3.max(attrs.data.stores, d => +d.salesSum);

          scales.linear = d3.scaleLinear()
            .domain([min, max])
            .range([0, attrs.barMaxHeight]);

          var baseColor = d3.hsl('#0c8722');

          //var color = d3.interpolateRgbBasis(
          //  [
          //    baseColor.brighter(3),
          //    baseColor.brighter(2),
          //    baseColor.brighter(1),
          //    baseColor.darker(0),
          //    baseColor.darker(1),
          //  ]
          //);

          // Heatmap colors
          var heatMin = d3.min(Object.keys(attrs._data.map), k => attrs._data.map[k].salesSum);
          var heatMax = d3.max(Object.keys(attrs._data.map), k => attrs._data.map[k].salesSum);
          var heatNegatives = heatMin < 1;
          scales.heatMin = heatMin;
          scales.heatMax = heatMax;

          if(heatNegatives) {
            heatMin = 1 + Math.abs(heatMin);
            heatMax += heatMin;
          }

          // Set color scale
          var heatColor = d3.hsl("#E3F2F5");
          var logColor = d3.scaleLog();
          scales.heatmapColorScale = d3.scaleLinear().domain([Math.log(heatMin), Math.log(heatMax)]).range([heatColor, heatColor.darker(3)]);

          scales.heatmapColor = function (salesSum) {
            var value = salesSum + heatMin;
            return scales.heatmapColorScale(Math.log(value));
          }

          //#############################    BEHAVIORS  #########################

          var behaviors = {};


          behaviors.zoom = d3
            .zoom()
            .scaleExtent([1, 1])
            .on("zoom", d => {
              handlers.redraw(d);
              console.log('paning')
            });

          //#############################    ASSIGN PROPS _VAR #########################
          _var.calc = calc;
          _var.scales = scales;
          _var.behaviors = behaviors;

          break;
      }
    }

    return _var;
  };

  // Expose global variables
  ['_id', '_var', 'data', 'attrs', 'handlers', 'scales'].forEach(function (key) {

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





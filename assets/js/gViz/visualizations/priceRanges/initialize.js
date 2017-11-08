// Imports
var d3 = require("d3");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var data = undefined;
  var _var = undefined;
  var attrs = undefined;

  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run': {
        if (!data) {
          console.log('valdiation error - data')
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
          //Override
          var keys = Object.keys(attrs.data.overridableParams);
          keys.forEach(key => {
            attrs[key] = attrs.data.overridableParams[key];
          })

          var centerCircleRadiusForZoom = attrs.centerCircleRadius * 0.8;
          var zoomLevel = attrs.zoomLevel;

          //   //#############################    SCALES   #########################

          var colorScale = d3.scaleLinear()
            .range([attrs.colors.min, attrs.colors.max])

          //Recalculate attrs properties
          attrs.tooltipWidth = attrs.svgWidth * 3 / 8;

          //   //#############################    CALCULATED PARAMETERS   #########################
          //Calculated properties
          var calc = {};

          calc.chartLeftMargin = attrs.marginLeft;
          calc.chartTopMargin = 0//attrs.marginTop;
          calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
          calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
          calc.halfWidth = Math.min(calc.chartWidth, calc.chartHeight) / 2;
          calc.centerPointX = calc.chartWidth / 2;
          calc.centerPointY = calc.chartHeight / 2 + attrs.marginTop;
          calc.eachDonutRadius = (calc.halfWidth * attrs.circleDecreaseLevel - attrs.centerCircleRadius) / attrs.data.priceRanges.length;
          calc.multiDonutData = [];

          if (!attrs.hasToggle) {
            attrs.mode = 'CATEGORY';
          }

          // Assign related props
          attrs.data.priceRanges.forEach((r, i) => {
            //Normal arc
            var pieArc = d3.arc()
              .outerRadius(calc.eachDonutRadius * (i + 1) + attrs.centerCircleRadius)
              .innerRadius(calc.eachDonutRadius * (i) + attrs.centerCircleRadius);

            r.pieArc = pieArc;

            //Hover zoom arc
            var zoomArc = d3.arc()
              .outerRadius(calc.eachDonutRadius * zoomLevel * (i + 1) + centerCircleRadiusForZoom)
              .innerRadius(calc.eachDonutRadius * zoomLevel * (i) + centerCircleRadiusForZoom);

            // Data binding
            var singleDonutData = attrs.data.categories.map((cat, i, arr) => {
              var products = attrs.data.products.filter(p => p.categoryID == cat.id && p.priceRangeID == r.id);
              return {
                category: cat,
                value: 360 / arr.length,
                products: products,
                arc: pieArc,
                zoomArc: zoomArc,
                priceRange: r,

              }
            })
            r.products = singleDonutData.map(c => c.products).reduce(function (a, b) { return a.concat(b); });
            calc.multiDonutData.push(singleDonutData);
          });

          //Assign values and products
          attrs.data.categories.forEach((cat, i, arr) => {
            var products = attrs.data.products.filter(p => p.categoryID == cat.id);
            cat.products = products;
            cat.value = 360 / arr.length;
          })

          //Assign random angle
          attrs.data.products.forEach(p => {
            p.angle = Math.random();
          });

          //--  CALCULATE  COLORS BY PRICE RANGE
          var priceRangeMax = d3.max(attrs.data.priceRanges, d => d.products.length);
          var priceRangeMin = d3.min(attrs.data.priceRanges, d => d.products.length);
          var priceRangeColors = {};
          attrs.data.priceRanges.forEach(r => {
            priceRangeColors[r.id] = colorScale.domain([priceRangeMin, priceRangeMax])(r.products.length);
          });

          //-- CALCULATE  COLORS BY CATEGORY
          var categoryRangeProducts = {};
          var categoryMax = d3.max(attrs.data.categories, d => d.products.length);
          var categoryMin = d3.min(attrs.data.categories, d => d.products.length);
          attrs.data.categories.forEach(cat => {
            var rCat = categoryRangeProducts[cat.id] = {};
            rCat.products = [];
            attrs.data.priceRanges.forEach(r => {
              rCat.products.push(r.products.filter(p => p.categoryID == cat.id).length);
            });
            rCat.max = d3.max(rCat.products);
            rCat.min = d3.min(rCat.products);
          });

          // -- ASSIGN CALCULATED COLORS
          calc.multiDonutData.forEach(single => single.forEach(p => {
            p.priceRangeColor = priceRangeColors[p.priceRange.id];
            var min = categoryRangeProducts[p.category.id].min;
            var max = categoryRangeProducts[p.category.id].max;
            var colorFunc = colorScale.domain([min, max]);
            p.categoryColor = colorFunc(p.products.length);
          }))

          //   //#############################    LAYOUTS   #########################
          var layouts = {};
          layouts.pie = d3.pie()
            .sort(null)
            .value(d => {
              return d.value
            })

          //   //#############################    ARCS   ############################
          var arcs = {};
          arcs.defaultCategory = d3.arc()
            .innerRadius(attrs.centerCircleRadius)
            .outerRadius(calc.halfWidth);
          arcs.zoomedCategory = d3.arc()
            .innerRadius(centerCircleRadiusForZoom)
            .outerRadius(calc.eachDonutRadius * zoomLevel * attrs.data.priceRanges.length + centerCircleRadiusForZoom)
          arcs.detail = d3.arc()
            .innerRadius(attrs.centerCircleRadius)
            .outerRadius(calc.halfWidth);

          console.log(calc.multiDonutData)
          //#############################    ASSIGN PROPS _VAR #########################
          _var.calc = calc;
          _var.arcs = arcs;
          _var.layouts = layouts;

          break;
      }
    }
    return _var;
  };

  // Expose global variables
  ['_id', '_var', 'data', 'attrs'].forEach(function (key) {

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








// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

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
        if (!attrs) {
          console.log('valdiation error - attrs')
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

          //Override
          var keys = Object.keys(attrs.data.overridableParams);
          keys.forEach(key => {
            attrs[key] = attrs.data.overridableParams[key];
          })

          //Calculated properties
          var calc = {};
          _var.container = {
            clientRect: d3.select(attrs.container).node().getBoundingClientRect()
          };

          // Define height and width
          attrs.svgHeight = ((attrs.svgHeight != null) ? attrs.svgHeight : _var.container.clientRect.height - attrs.breadCrumbDimensions.h);
          attrs.svgWidth = ((attrs.svgWidth != null) ? attrs.svgWidth : _var.container.clientRect.width);
          calc.chartLeftMargin = attrs.marginLeft;
          calc.chartTopMargin = attrs.marginTop;
          calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
          calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
          calc.radius = (Math.min(calc.chartWidth, calc.chartHeight) / 2) * attrs.radiusLengthFraction - 5;
          calc.centerPointX = calc.chartHeight / 2;
          calc.centerPointY = calc.chartHeight / 2;
          calc.backRectWidth = attrs.breadCrumbDimensions.h;

          //#############################    FORMATING #########################
          var formatting = {};
          formatting.number = d3.format(",d");
          formatting.hoverModePrice = shared.helpers.number.parseFormat(attrs.hoverModePriceValue);
          formatting.restModeSumValue = shared.helpers.number.parseFormat(attrs.restModeSumValue);

          //#############################    SCALES  #########################
          var scales = {};
          scales.x = d3.scaleLinear().domain([0, 1]).range([0, 2 * Math.PI])

          scales.y = d3.scalePow().domain([0, 1]).range([0, calc.radius]).exponent(attrs.radiusExponent)

          scales.color = d3.scaleOrdinal(d3.schemeCategory20).range(['pink', 'green', 'blue', 'yellow', 'red']);

          //#############################    BEHAVIORS  #########################
          var behaviors = {};
          behaviors.drag = d3.drag()//.on("start", d => handlers.dragStarted(d)).on("drag", d => handlers.dragging(d)).on("end", d => handlers.dragEnded(d))

          //#############################    LAYOUTS  #########################
          var layouts = {}
          layouts.partition = d3.partition();

          //#############################    ARCS  #########################
          var arcs = {};

          arcs.sunburst = d3.arc()
            .startAngle(d => {
              var startAngle = Math.max(0, Math.min(2 * Math.PI, scales.x(d.x0)));
              var lineThicknesAngle = Math.PI / 480;
              if (d.depth == 3) {
                if (d.parent && d.parent.children) {
                  var index = d.parent.children.indexOf(d);
                  if (index == 0) {
                    d.firstBordered = true;
                    startAngle += lineThicknesAngle;
                  }
                }
              }
              if (d.depth == 4) {
                if (d.parent && d.parent.children && (d.parent.firstBordered || d.parent.lastBordered)) {
                  var index = d.parent.children.indexOf(d);
                  if (index == 0) {
                    d.firstBordered = true;
                    startAngle += lineThicknesAngle;
                  }
                }
              }
              return startAngle;
            })
            .endAngle(d => {
              var endAngle = Math.max(0, Math.min(2 * Math.PI, scales.x(d.x1)))
              var lineThicknesAngle = Math.PI / 480;
              if (d.depth == 3) {
                if (d.parent && d.parent.children) {
                  var index = d.parent.children.indexOf(d);
                  if (index == (d.parent.children.length - 1)) {
                    d.lastBordered = true;
                    endAngle -= lineThicknesAngle;
                  }
                }
              }
              if (d.depth == 4) {
                if (d.parent && d.parent.children && (d.parent.firstBordered || d.parent.lastBordered)) {
                  var index = d.parent.children.indexOf(d);
                  if (index == (d.parent.children.length - 1)) {
                    d.lastBordered = true;
                    endAngle -= lineThicknesAngle;
                  }
                }
              }
              return endAngle;
            })
            .innerRadius(d => {
              var result = Math.max(0, scales.y(d.y0));
              if (d.depth > 2) result += 2;  // prevent overlap between two and third level childrens
              return result;
            })
            .outerRadius(d => Math.max(0, scales.y(d.y1)))

          //#############################    HIERARCHY STUFF  #########################
          var hierarchy = {};
          hierarchy.root = d3.hierarchy(attrs.data);

          //Generate id and assign colors
          var i = 1;

          hierarchy.root.each(d => {
            //If node does have parent and does not have color
            if (!d.data.color && d.parent) {
              d.data.color = d.parent.data.color;
            }
            d.data.generatedId = 'node' + i++;
          });

          hierarchy.root.sum(d => d.children ? 0 : d.sales ? d.sales : 1);

          //Assign values for tooltip
          hierarchy.root.each(d => {
            if (d.parent) {
              d.data.categoryPercent = d.value / d.parent.value;
              d.data.totalPercent = d.value / hierarchy.root.value;
            }
          })

          //  ########################  RECALCULATION BASED ON  OTHER PROPS  ###########
          //we are using square scale, so this will correctly calculate root circle radius
          calc.innerCircleRadius = scales.y(1 / (hierarchy.root.height + 1));
          calc.dropTextPosY = -calc.innerCircleRadius / 1.7;
          calc.addTextPosY = - calc.innerCircleRadius / 2.5;
          calc.centerImageWidth = calc.innerCircleRadius * 0.7;
          calc.centerImageHeight = calc.innerCircleRadius * 0.7;

          //#############################    ASSIGN PROPS _VAR #########################
          _var.calc = calc;
          _var.formatting = formatting;
          _var.scales = scales;
          _var.layouts = layouts;
          _var.arcs = arcs;
          _var.hierarchy = hierarchy;
          _var.behaviors = behaviors;
          break;
      }
    }
    return _var;
  };

  // Expose global variables
  ['_id', '_var', 'data', 'attrs', 'handlers'].forEach(function (key) {

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





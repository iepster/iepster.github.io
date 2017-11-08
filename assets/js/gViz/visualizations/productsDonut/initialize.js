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

                    //override
                    var keys = Object.keys(attrs.data.overridableParams);
                    keys.forEach(key => {
                        attrs[key] = attrs.data.overridableParams[key];
                    })

                    //calculated properties
                    var calc = {};


                    calc.chartLeftMargin = attrs.marginLeft;
                    calc.chartTopMargin = attrs.marginTop;

                    calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
                    calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;

                    calc.centerPointX = calc.chartWidth / 2;
                    calc.centerPointY = calc.chartHeight / 2;

                    calc.halfChartWidth = Math.min(calc.chartWidth, calc.chartHeight) / 2;

                    calc.outerRadius = calc.halfChartWidth;
                    calc.innerRadius = calc.outerRadius - attrs.donutRadius;


                    calc.centerImageWidth = calc.innerRadius * 0.7;
                    calc.centerImageHeight = calc.innerRadius * 0.7;

                    calc.totalSales = d3.sum(attrs.data.values, d => d.sales)

                    calc.commaFormat = d3.format(",.2r");




                    // set hover and default colors
                    if (attrs.interpolationConfig.interpolate) {
                        calc.colorInterpolation = d3.interpolate('transparent', attrs.interpolationConfig.defaultColor)
                    }

                    attrs.data.values.forEach((value, i) => {
                        value.hoverColor = value.color;
                        value.restColor = value.color;

                        if (attrs.interpolationConfig.interpolate) {
                            value.restColor = calc.colorInterpolation(1 / i);
                        }
                    })



                    //#############################    ARCS   #########################
                    var arcs = {};
                    arcs.donut = d3.arc()
                        .outerRadius(calc.outerRadius)
                        .innerRadius(calc.innerRadius);

                    arcs.donutHover = d3.arc()
                        .outerRadius(calc.outerRadius + 10)
                        .innerRadius(calc.innerRadius - 10);


                    //#############################    LAYOUTS   #########################
                    var layouts = {};

                    layouts.donut = d3.pie()
                        .sort(null)
                        .value(function (d) { return d.sales; });


                    //#############################    ASSIGN PROPS _VAR #########################
                    _var.calc = calc;
                    _var.layouts = layouts;
                    _var.arcs = arcs;

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





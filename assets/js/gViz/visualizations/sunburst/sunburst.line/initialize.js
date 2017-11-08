// Imports
var d3 = require("d3");

// Initialize the visualization class
module.exports  = function () {
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

                    //calculated properties
                    var calc = {};


                    calc.chartLeftMargin = attrs.marginLeft;
                    calc.chartTopMargin = attrs.marginTop;

                    calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
                    calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
                    //###############################   PARSING    #############################
                    var parsing = {};

                    parsing.time = d3.timeParse("%d-%b-%y");


                    //###############################   SCALES     ####################### 
                    var scales = {}

                    scales.axes = d3.scaleLinear().domain([0, 100]).range([calc.chartHeight, 0])

                    scales.x = d3.scaleTime()
                        .rangeRound([0, calc.chartWidth])
                        .domain(d3.extent(attrs.data.values, d => new Date(d.date)))

                    scales.y = d3.scaleLinear()
                        .rangeRound([calc.chartHeight, 0])
                        .domain(d3.extent(attrs.data.values, d => d.value))




                    //###############################   LAYOUTS     ####################### 

                    var layouts = {};

                    layouts.line = d3.line()
                        .x(function (d) { return scales.x(d.date); })
                        .y(function (d) { return scales.y(d.value); });


                    layouts.area = d3.area()
                        .x(function (d) { return scales.x(d.date); })
                        .y1(function (d) { return scales.y(d.value); });

                    layouts.area.y0(calc.chartHeight)

                    //##########################  TRANSFORM DATA   ######################
                    attrs.data.values.forEach((d, i) => {
                        d.date = new Date(d.date);
                    })



                    //#############################    ASSIGN PROPS _VAR #########################
                    _var.calc = calc;
                    _var.layouts = layouts;
                    _var.scales = scales

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





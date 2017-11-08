// Imports
var d3 = require("d3");

// Initialize the visualization class
module.exports = function () {
    "use strict";

    // Get attributes values
    var _var = undefined;
    var attrs = undefined;
    var calc = undefined;

    var handlers = {
        data: undefined,
        color: undefined
    }


    // Validate attributes
    var validate = function (step) {
        switch (step) {
            case 'run': {
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

                    //=======================  DRAWING   =========================

                    var container = d3.select(attrs.container)

                    var svg = container
                        .append('svg')
                        .attr('font-family', attrs.svgFontFamily)
                        .attr('width', attrs.svgWidth)
                        .attr('height', attrs.svgHeight)
                        .style('transform', 'scale(' + attrs.scale + ')')
                    // .attr("viewBox", "0 0 " + attrs.svgWidth + " " + attrs.svgHeight)
                    // .attr("preserveAspectRatio", "xMidYMid meet")


                    var chart = svg.append('g')
                        .attr('class', 'chart')
                        .attr('width', calc.chartWidth)
                        .attr('height', calc.chartHeight)
                        .attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')')

                    // =======================  ASSIGN NEEDED PROPS   =========================
                    _var.chart = chart;


                    break;
            }
        }

        return _var;
    };


    ['_var', 'attrs', 'calc'].forEach(function (key) {

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

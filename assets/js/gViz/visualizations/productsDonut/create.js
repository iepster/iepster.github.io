// Imports
var d3 = require("d3");

// Initialize the visualization class
module.exports = function () {
    "use strict";

    // Get attributes values
    var _var = undefined;
    var attrs = undefined;
    var calc = undefined;



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

                    container.selectAll('svg').remove()

                    var svg = container
                        .append('svg')
                        .attr('font-family', attrs.svgFontFamily)
                        .attr('width', '100%')
                        .attr('height', '100%')
                        //.style('transform', 'scale(' + attrs.scale + ')')
                        .attr("viewBox", "0 0 " + attrs.svgWidth + " " + attrs.svgHeight)
                        .attr("preserveAspectRatio", "xMidYMid meet")


                    var chart = svg.append('g')
                        .attr('class', 'chart')
                        .attr('width', calc.chartWidth)
                        .attr('height', calc.chartHeight)
                        .attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')');


                    var centerPoint = chart.append('g').attr('transform', 'translate(' + calc.centerPointX + ',' + calc.centerPointY + ')');

                    //######################   CENTER RECTANGULAR PATTERNS ##################

                    chart.append('defs')
                        .append('pattern')
                        .attr('id', 'rectangularPattern')
                        .attr('width', attrs.rectanglePatternLength)
                        .attr('height', attrs.rectanglePatternLength)
                        .attr('patternUnits', 'userSpaceOnUse')
                        .append('rect')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('width', attrs.rectanglePatternLength)
                        .attr('height', attrs.rectanglePatternLength)
                        .attr('stroke', 'black')
                        .attr('stroke-width', '0.15px')
                        .attr('fill', '#FFFFFF');


                    //######################   HOWER DROP SHADOW ##################


                    // Add filters ( Shadows)
                    var defs = chart.append('defs');

                    _var.filterId = "drop-shadow-donut" + Math.floor(Math.random() * 1000000);


                    _var.filterUrl = `url(${attrs.urlLocation}#${_var.filterId})`;




                    //Drop shadow filter
                    var dropShadowFilter = defs.append("filter").attr("id", _var.filterId).attr("height", "200%").attr("width", "200%");
                    dropShadowFilter.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", 5).attr("result", "blur");
                    dropShadowFilter.append("feOffset").attr("in", "blur").attr("dx", -2).attr("dy", 5).attr("result", "offsetBlur");

                    dropShadowFilter.append("feFlood").attr('flood-color', 'black').attr("flood-opacity", "0.8").attr("result", "offsetColor");
                    dropShadowFilter.append("feComposite").attr('in', 'offsetColor').attr('in2', 'offsetBlur').attr("operator", "in").attr("result", "offsetBlur");


                    var feMerge = dropShadowFilter.append("feMerge");
                    feMerge.append("feMergeNode").attr("in", "offsetBlur")
                    feMerge.append("feMergeNode").attr("in", "SourceGraphic");



                    // =======================  ASSIGN NEEDED PROPS   =========================
                    _var.chart = chart;
                    _var.centerPoint = centerPoint;


                    break;
            }
        }

        return _var;
    };

    // Exposicao de variaveis globais
    ['_var', 'data', 'attrs', 'calc'].forEach(function (key) {

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

    // Executa a funcao chamando o parametro de step
    main.run = _ => main('run');

    return main;
};

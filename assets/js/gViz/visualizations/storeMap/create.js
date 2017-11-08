// Imports
var d3 = require("d3");

// Initialize the visualization class
module.exports = function () {
    "use strict";

    // Get attributes values
    var _var = undefined;
    var attrs = undefined;
    var calc = undefined;
    var behaviors = undefined;



    // Validate attributes
    var validate = function (step) {
        switch (step) {
            case 'run': {
                if (!behaviors) console.log('validation err - behaviors');
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
                        .style('overflow', 'hidden')





                    var svg = container
                        .append('svg')
                        .style('font-family', attrs.svgFontFamily)
                        // .attr('width', attrs.svgWidth)
                        // .attr('height', attrs.svgHeight)
                        .style('transform', 'scale(' + attrs.scale + ')')
                        .call(behaviors.zoom)
                        .on("dblclick.zoom", null)
                        .attr('cursor', 'pointer')
                        .attr("viewBox", "0 0 " + attrs.svgWidth + " " + attrs.svgHeight)
                        .attr("preserveAspectRatio", "xMidYMid meet")
                        .style('overflow', 'hidden')

                    svg.append('rect')

                    var chart = svg.append('g')
                        .attr('class', 'chart')
                        .attr('width', calc.chartWidth)
                        .attr('height', calc.chartHeight)
                        .attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')')




                    var infoDiv = container.append('div')
                        .attr('class', 'info-div')
                        .style('position', 'absolute')
                       // .style('top', (10) + 'px')
                        .style('left', 10 + 'px')
                        .style('background-color', 'white')
                        .style('font-family', attrs.svgFontFamily)
                        .style('font-size', '14px')
                        .style('font-weight',300)
                        .style('color', attrs.infoPanelColor)
                        .style('pointer-events', 'none')

                    var tooltipDiv = container.append('div')
                        .attr('class', 'tooltip-div')
                        .style("opacity", 0)
                        .style('position', 'absolute')
                        .style('width', 'auto')
                        .style('pointer-events', 'none')
                        .style('font-family', attrs.svgFontFamily)
                        .style('background-color', 'white')
                        .style('pointer-events', 'none')


                    //################################   FILTERS  &   SHADOWS  ##################################

                    // Add filters ( Shadows)
                    var defs = svg.append('defs');

                    var filter = defs.append("filter")
                        .attr("id", "drop-shadow-map")
                        .attr("height", "300%")
                        .attr("width", "300%")
                        .attr('x', -attrs.barWidth)

                    // SourceAlpha refers to opacity of graphic that this filter will be applied to
                    // convolve that with a Gaussian with standard deviation 3 and store result
                    // in blur
                    filter.append("feGaussianBlur")
                        .attr("in", "SourceAlpha")
                        .attr("stdDeviation", attrs.barWidth / 3)
                        .attr("result", "blur");

                    // translate output of Gaussian blur to the right and downwards with 2px
                    // store result in offsetBlur
                    filter.append("feOffset")
                        .attr("in", "blur")
                        .attr("dx", -attrs.barWidth / 3)
                        .attr("dy", 1)
                        .attr("result", "offsetBlur");

                    filter.append('feColorMatrix')
                        .attr('in', 'blur')
                        .attr('result', 'offsetBlur')
                        .attr('type', 'matrix')
                        .attr('values', `
                        0 0 0 0   0
                        0 0 0 0   0 
                        0 0 0 0   0 
                        0 0 0 .7 0
                        `)


                    // overlay original SourceGraphic over translated blurred opacity by using
                    // feMerge filter. Order of specifying inputs is important!
                    var feMerge = filter.append("feMerge");

                    feMerge.append("feMergeNode")
                        .attr("in", "offsetBlur")
                    feMerge.append("feMergeNode")
                        .attr("in", "SourceGraphic");



                    //##################       GRADIENTS         ##########################


                    calc.gradientId = 'map-bar-gradient' + Math.floor(Math.random() * 1000000);

                    var grads = svg.append("defs")
                        .append("linearGradient")
                        .attr("gradientUnits", "objectBoundingBox")
                        .attr("x1", "0%")
                        .attr("y1", "0%")
                        .attr("x2", "0%")
                        .attr("y2", "100%")
                        .attr("id", calc.gradientId);


                    grads.append("stop")
                        .attr("offset", "0")
                        .style("stop-color", attrs.barColor);


                    grads.append("stop")
                        .attr("offset", "100%")
                        .style("stop-color", '#BADDE2');

                    // =======================  ASSIGN NEEDED PROPS   =========================
                    _var.chart = chart;
                    _var.tooltipDiv = tooltipDiv;
                    _var.infoDiv = infoDiv;
                    _var.container = container;
                    _var.defs = defs;
                    _var.svg = svg;



                    break;
            }
        }

        return _var;
    };

    // Exposicao de variaveis globais
    ['_var', 'data', 'attrs', 'calc', 'behaviors'].forEach(function (key) {

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

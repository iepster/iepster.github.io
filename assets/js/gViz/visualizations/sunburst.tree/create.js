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
                if (!behaviors) console.log('err - behaviors')
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
                        .call(behaviors.zoom)
                        .on("dblclick.zoom", null)
                        .attr('cursor', 'pointer')



                    var patternUrl = 'rectangularPattern' + Math.floor(Math.random() * 1000000) + Date.now();
                    svg.append('defs')
                        .append('pattern')
                        .attr('id', patternUrl)
                        .attr('width', attrs.rectanglePatternLength)
                        .attr('height', attrs.rectanglePatternLength)
                        .attr('patternUnits', 'userSpaceOnUse')
                        .append('rect')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('width', attrs.rectanglePatternLength)
                        .attr('height', attrs.rectanglePatternLength)
                        .attr('stroke', 'white')
                        .attr('stroke-width', '1px')
                        .attr('stroke-opacity', 1)
                        .attr('fill', '#F6F6F6');


                    svg.append('rect')
                        .attr('width', attrs.svgWidth)
                        .attr('height', attrs.svgHeight)
                        .attr('fill', 'url(' + attrs.urlLocation + '#' + patternUrl + ')')


                    // .style('transform', 'scale(' + attrs.scale + ')')

                    // .attr("viewBox", "0 0 " + attrs.svgWidth + " " + attrs.svgHeight)
                    // .attr("preserveAspectRatio", "xMidYMid meet")


                    var chart = svg.append('g')
                        .attr('class', 'chart')
                        .attr('width', calc.chartWidth)
                        .attr('height', calc.chartHeight)
                        .attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')')




                    // =======================  ASSIGN NEEDED PROPS   =========================
                    _var.chart = chart;
                    _var.svg = svg;
                    _var.container = container;




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

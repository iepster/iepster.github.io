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
                        //.style('background-color', '#F5F2F3')
                        .style('font-family', attrs.svgFontFamily)



                    var svg = container
                        .append('svg')
                        .attr('width', attrs.svgWidth)
                        .attr('height', attrs.svgHeight)
                        .style('position', 'absolute')
                        .style('transform', 'scale(' + attrs.scale + ')')
                    // .attr("viewBox", "0 0 " + attrs.svgWidth + " " + attrs.svgHeight)
                    // .attr("preserveAspectRatio", "xMidYMid meet")


                    var chart = svg.append('g')
                        .attr('class', 'chart')
                        .attr('width', calc.chartWidth)
                        .attr('height', calc.chartHeight)
                        .attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')')

                    var textWrapper = container.append('div')
                        .style('margin-left', function(){
                        return calc.chartLeftMargin + attrs.horizontalLineWidth + attrs.pointRadius * 2 + 6 + 'px';
                      })
                      .attr("class", "has-mg-bottom-medium-lg")
                    // =======================  ASSIGN NEEDED PROPS   =========================
                    _var.chart = chart;
                    _var.textWrapper = textWrapper;
                    _var.svg = svg;

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

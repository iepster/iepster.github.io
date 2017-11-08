// Imports
var d3 = require("d3");

// Initialize the visualization class
module.exports = function () {
    "use strict";

    // Get attributes values
    var _var = undefined;
    var attrs = undefined;
    var calc = undefined;
    var chart = undefined;
    var svg = undefined;
    var container = undefined;


    // Validate attributes
    var validate = function (step) {
        switch (step) {
            case 'run': {
                if (!attrs) console.log('not valid - attrs');
                if (!calc) console.log('not valid - calc');
                if (!chart) console.log('not valid -chart');
                if (!svg) console.log('not valid -svg');
                if (!container) console.log('not valid -svg');

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

                    // in out button



                    var btnZoomOut = container
                        .insert('div')
                        .style('position', 'absolute')
                        .style('top', (attrs.svgHeight - 60) + 'px')
                        .style('right', '40px')
                        .style('padding', '5px')
                        .style('background-color', 'white')
                        .style('color', '#937A99')
                        .style('cursor', 'pointer')
                        .html('<i class="di-minus" aria-hidden="true"></i>')
                        .style('font-size', '10px')
                        .on('click', function (d) {
                            console.log(attrs.transform)
                            attrs.transform.k /= 1.1;
                            chart.transition().attr('transform', `translate(${attrs.transform.x},${attrs.transform.y}) scale(${attrs.transform.k})`);
                        })


                    var btnZoomIn = container
                        .insert('div')
                        .style('position', 'absolute')
                        .style('top', (attrs.svgHeight - 60) + 'px')
                        .style('right', '70px')
                        .style('padding', '5px')
                        .style('background-color', 'white')
                        .style('color', '#937A99')
                        .style('cursor', 'pointer')
                        .html('<i class="di-plus" aria-hidden="true"></i>')
                        .style('font-size', '10px')
                        .on('click', function (d) {
                            attrs.transform.k *= 1.1;
                            chart.transition().attr('transform', `translate(${attrs.transform.x},${attrs.transform.y}) scale(${attrs.transform.k})`);
                        })






                    // =======================  ASSIGN NEEDED PROPS   =========================
                    _var.btnZoomIn = btnZoomIn;
                    _var.btnZoomOut = btnZoomOut;

                    break;
            }
        }

        return _var;
    };



    ['_var', 'calc', 'attrs', 'chart', 'centerPoint', 'svg', 'container'].forEach(function (key) {

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

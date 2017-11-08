// Imports
var d3 = require("d3");
var common = require("../common");

// Initialize the visualization class
module.exports = function () {
    "use strict";

    // Get attributes values
    var attrs = undefined;
    var _var = undefined;

    // Validate attributes
    let validate = function (step) {
        switch (step) {
            case 'run': return true;
            default: return false;
        }
    };

    // Main function
    let main = function (step) {

        // Validate attributes if necessary
        if (validate(step)) {
            switch (step) {

                // Build entire visualizations
                case 'run':

                    //calculated properties
                    var calc = {}
                    calc.chartLeftMargin = attrs.marginLeft;
                    calc.chartTopMargin = attrs.marginTop;
                    calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
                    calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
                    calc.centerPointX = calc.chartWidth / 2;
                    calc.centerPointY = calc.chartHeight / 2;
                    calc.circleRadius = d3.min([calc.chartWidth, calc.chartHeight]) / 2;
                    calc.chartNamePosY = calc.circleRadius * 0.7;
                    calc.chartTitlePosX = calc.centerPointX;
                    calc.chartTitlePosY = calc.centerPointY * 0.4;
                    calc.imagePosX = calc.centerPointX * 0.45;
                    calc.imagePosY = calc.centerPointY * 0.4;
                    calc.imageWidth = calc.chartWidth * 0.6;
                    calc.imageHeight = calc.chartHeight * 0.6;

                    // =======================  ASSIGN ALL PROPS   =========================
                    _var.calc = calc;
                    break;
            }
        }

        return _var;
    };

    // Expose global variables
    ['_id', '_var', 'attrs'].forEach(function (key) {

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

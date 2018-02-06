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

                    //calculated properties
                    var calc = {};


                    calc.chartLeftMargin = attrs.marginLeft;
                    calc.chartTopMargin = attrs.marginTop;

                    calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
                    calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;




                    calc.allTextLength = attrs.data.map(d => d.text).join('').length;
                  //#############################    ASSIGN SOME CALCULATED PROPS TO THE DATA  #########################


                    attrs.data.forEach((obj, i, arr) => {

                        var lineProps = {}



                        lineProps.allTime = calc.allTime;

                        obj.delay += calc.allTime;



                        if (i == 0) {

                            var allLength = attrs.firstLineHeight + attrs.horizontalLineWidth;

                            lineProps.verDelay = 0;

                            lineProps.x1 = 0;
                            lineProps.y1 = 0;
                            lineProps.x2 = 0;
                            lineProps.y2 = attrs.firstLineHeight;
                            lineProps.x3 = attrs.horizontalLineWidth;
                            lineProps.y3 = attrs.firstLineHeight;




                        } else {
                            obj.previousNode = arr[i - 1];



                        }
                        obj.aindex = i;

                        if (i < arr.length - 1) {
                            obj.nextNode = arr[i + 1]
                        }

                        obj.lineProps = lineProps;




                    });

                    //#############################    ASSIGN PROPS _VAR #########################
                    _var.calc = calc;

                    ;
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





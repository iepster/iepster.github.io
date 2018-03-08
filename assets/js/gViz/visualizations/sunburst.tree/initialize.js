// Imports
var d3 = require("d3");

// Initialize the visualization class
module.exports = function () {
    "use strict";

    // Get attributes values
    var data = undefined;
    var _var = undefined;
    var attrs = undefined;
    var handlers = undefined;

    // Validate attributes
    var validate = function (step) {
        switch (step) {
            case 'run': {
                if (!data) {
                    console.log('valdiation error - data')
                }
                if (!_var) {
                    console.log('valdiation error - _var')
                }
                if (!attrs) {
                    console.log('valdiation error - attrs')
                }
                if (!handlers) {
                    console.log('valdiation error - handlers')
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

                    calc.nodeRectPosX = -attrs.nodeRectSize * 0.6;


                    //#############################    LAYOUTS   #########################
                    var layouts = {}
                    layouts.tree = d3.tree()
                        .size([calc.chartWidth, calc.chartHeight])
                        .nodeSize([20])
                        .separation(function separation(a, b) {
                            return 2;
                            return a.parent == b.parent ? 1 : 2;
                        });

                    //#############################    BEHAVIORS  #########################

                    var behaviors = {};
                    // behaviors.drag = d3.drag()
                    //     .on("start", d => handlers.dragStarted(d))
                    //     .on("drag", (d, i) => handlers.dragging(d, i))
                    //     .on("end", d => handlers.dragEnded(d))
                    //     .touchable(true))

                    behaviors.zoom = d3
                        .zoom()
                        .scaleExtent([1, 1])
                        .on("zoom", d => {
                            handlers.redraw(d);
                            console.log('paning')
                        });

                    //#############################    HIERARCHU STUFF   #########################
                    var hierarchy = {}

                    hierarchy.root = d3.hierarchy(attrs.data);

                    var idCounter = 0;
                    hierarchy.root.each(d => {
                        idCounter++;
                        d.data.generatedId = 'node' + idCounter
                        //if node does have parent and does not have color

                        if (!d.data.color && d.parent) {
                            d.data.color = d.parent.data.color;
                        }



                    });

                    // Collapse after the second level
                    hierarchy.root.children.forEach(collapse);


                    hierarchy.root.y0 = 0;
                    hierarchy.root.x0 = 0;





                    function collapse(d) {
                        if (d.children) {
                            d._children = d.children
                            d._children.forEach(collapse)
                            d.children = null
                        }
                    }


                    //#############################    ASSIGN PROPS _VAR #########################
                    _var.calc = calc;
                    _var.hierarchy = hierarchy;
                    _var.layouts = layouts;
                    _var.behaviors = behaviors;

                    break;
            }
        }

        return _var;
    };

    // Expose global variables
    ['_id', '_var', 'data', 'attrs', 'handlers'].forEach(function (key) {

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





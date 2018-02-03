//Imports
var d3 = require("d3");

// Module declaration
module.exports = function () {
    "use strict";


    // Auxiliar Functions
    var components = {
        initialize: require('./initialize.js'),
        create: require('./create.js'),
        elements: require('./elements.js'),
        handlers: require('./handlers.js')

    };


    var attrs = {
        data: null,
        container: null,
        data: null,
        scale: 1,
        svgWidth: 1000,
        svgHeight: window.innerHeight-70,
        marginTop: 20,
        marginBottom: 20,
        marginRight: 20,
        marginLeft: 20,
        svgFontFamily: "Helvetica",
        duration: 1000,
        nodeRectSize: 170,
        nodeRectHeight: 30,
        nodeRectPosY: -15,
        nodeTextPosX: -13,
        linkMoveIndexX: 0.4,
        dragSymbolUrl: './assets/images/gViz/visualizations/sunburst/drag.png',
        backgroundImgUrl: './assets/images/gViz/visualizations/sunburst/sunburst-back.png',
        dragSymbolDimension: 20,
        scale: 1,
        rectanglePatternLength:14,
        urlLocation:'ask',
        transform: {
            k: 1, //scale
            x: 0,
            y: 0
        },
        dependentSunburst: null,
    }

    var _var = {
        attrs: attrs,
        calc: null,
        chart: null,
        handlers: {
            dragStarted: null,
            dragging: null,
            dragEnded: null,
            redraw: null
        }
    };

    var action = 'build';




    // Validate attributes
    var validate = function (step) {
        switch (step) {
            case 'build': return true;
            case 'initialize': return true;
            case 'create': return true;
            case 'elements': return true;
            case 'handlers': return true;
            default: return false;
        }
    };

    // Main function
    var main = function (step) {

        // Validate attributes if necessary
        if (validate(step)) {

            switch (step) {

                // Build entire visualizations
                case 'build':

                    console.log('initializing');
                    main('initialize');
                    console.log('creating');
                    main('create');
                    console.log('elements');
                    main('elements');
                    console.log('handling');
                    main("handlers");
                    console.log('done');
                    break;
                // Initialize visualization variable
                case 'initialize':

                    // Initializing
                    _var = components.initialize()
                        ._var(_var)
                        .data(attrs.data)
                        .handlers(_var.handlers)
                        .attrs(attrs)
                        .run();

                    break;

                // Create initial elements
                case 'create':

                    // Creating wrappers
                    _var = components.create()
                        ._var(_var)
                        .calc(_var.calc)
                        .attrs(attrs)
                        .behaviors(_var.behaviors)
                        .run();
                    break;


                // Setup chart elements
                case 'elements':

                    // Running
                    _var = components.elements()
                        ._var(_var)
                        .attrs(attrs)
                        .calc(_var.calc)
                        .chart(_var.chart)
                        .svg(_var.svg)
                        .container(_var.container)
                        .run();


                    break;



                case 'handlers':

                    // Handling
                    _var = components.handlers()
                        ._var(_var)
                        .calc(_var.calc)
                        .hierarchy(_var.hierarchy)
                        .layouts(_var.layouts)
                        .chart(_var.chart)
                        .attrs(attrs)
                        .handlers(_var.handlers)
                        .behaviors(_var.behaviors)
                        .sunburst(attrs.dependentSunburst)
                        .svg(_var.svg)
                        .run();

                    break;



            }
        }

        return _var;
    };

    // Expose some global variables
    ['data', 'container', 'svgWidth', 'svgHeight', 'dependentSunburst','urlLocation'].forEach((key) => {

        // Attach variables to main function
        return main[key] = function (_) {

            var string = `attrs['${key}'] = _`;

            if (!arguments.length) { eval(`return attrs['${key}']`); }
            eval(string);
            return main;
        };
    });


    // //expose variables which causes corresponding handler functions to run

    // ['scale', 'state', 'data', 'hoverStart', 'hoverEnd'].forEach(function (key) {
    //     // Attach variables to main function
    //     return main[key] = function (_) {

    //         if (!arguments.length) { eval(`return attrs['${key}]'`); }
    //         eval(`attrs['${key}'] = _`);
    //         if (typeof eval(`updateHandlerFuncs['${key}']`) === 'function') {
    //             eval(`updateHandlerFuncs['${key}']()`);
    //         }
    //         return main;
    //     };
    // });


    // Secondary functions
    main.run = _ => main("build");

    return main;

}

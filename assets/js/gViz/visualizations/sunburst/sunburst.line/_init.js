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
        handlers: require('./handlers.js'),

    };


    var attrs = {
        data: null,
        container: null,
        urlLocation: null,
        data: null,
        newData: null,
        scale: 1,
        svgWidth: 300,
        svgHeight: 100,
        marginTop: 20,
        marginBottom: 20,
        marginRight: 20,
        marginLeft: 20,
        fillColor: '#00DCC2',
        lineStrokeWidth: 3,
        axisStrokeWidth: 1,
        bottomAxisFill: '#CEE1DE',
        svgFontFamily: "Helvetica",
    }

    var updateHandlerFuncs = {
        color: undefined,
        data: undefined
    }

    var _var = {
        attrs: attrs,
        calc: null,
        chart: null
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
                        .layouts(_var.layouts)
                        .scales(_var.scales)

                        .run();


                    break;



                case 'handlers':

                    // Handling
                    _var = components.handlers()
                        ._var(_var)
                        .updateHandlerFuncs(updateHandlerFuncs)
                        .area(_var.area)
                        .ticks(_var.ticks)
                        .line(_var.line)
                        .attrs(_var.attrs)
                        .layouts(_var.layouts)
                        .scales(_var.scales)
                        .run();

                    break;


            }
        }

        return _var;
    };



    ['data', 'container', 'svgWidth', 'svgHeight'].forEach((key) => {

        // Attach variables to main function
        return main[key] = function (_) {

            var string = `attrs['${key}'] = _`;

            if (!arguments.length) { eval(`return attrs['${key}']`); }
            eval(string);
            return main;
        };
    });


    //expose variables which causes corresponding handler functions to run

    ['fillColor', 'newData'].forEach(function (key) {
        // Attach variables to main function
        return main[key] = function (_) {

            if (!arguments.length) { eval(`return attrs['${key}]'`); }
            eval(`attrs['${key}'] = _`);
            if (typeof eval(`updateHandlerFuncs['${key}']`) === 'function') {
                eval(`updateHandlerFuncs['${key}']()`);
            }
            return main;
        };
    });


    // Secondary functions
    main.run = _ => main("build");

    return main;

}




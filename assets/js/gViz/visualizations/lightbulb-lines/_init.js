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


    };


    var attrs = {
        container: null,
        data: null,
        svgWidth: 1000,
        svgHeight: 1000,
        marginTop: 5,
        marginBottom: 20,
        marginRight: 20,
        marginLeft: 0,
        lineThickness: 1,
        lineColor: '#E90031',
        firstLineHeight: 40,
        secondLineHeight: 80,
        horizontalLineWidth: 0,
        pointRadius: 4,
        ease: d3.easeLinear,
        textDuration: 1500,
        useTransition:true,
        lineData: [],
        startTyping: function(){},
      callback: function(){ }
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
                        .textWrapper(_var.textWrapper)
                        .svg(_var.svg)
                        .run();


                    break;





            }
        }

        return _var;
    };



    // Expose some global variables
    ['data', 'container', 'firstLineHeight', 'secondLineHeight', 'horizontalLineWidth', 'svgWidth', 'svgHeight', 'callback', 'startTyping','useTransition'].forEach((key) => {

        // Attach variables to main function
        return main[key] = function (_) {

            var string = `attrs['${key}'] = _`;

            if (!arguments.length) { eval(`return attrs['${key}']`); }
            eval(string);
            return main;
        };
    });




    // Secondary functions
    main.run = _ => main("build");

    return main;

}

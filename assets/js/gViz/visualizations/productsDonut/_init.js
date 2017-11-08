// Imports
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


    var consts = {
        LAYOUT_TYPE: {
            COMPLEX: 'COMPLEX',
            SIMPLE: 'SIMPLE'
        }
    }

    var attrs = {
        data: null,
        container: null,
        urlLocation: null,
        scale: 1,
        svgWidth: 1000,
        svgHeight: 600,
        marginTop: 80,
        marginBottom: 80,
        marginRight: 20,
        marginLeft: 20,
        svgFontFamily: "Helvetica",


        rectanglePatternLength: 18,
        productTextDefaultFill: '#6F6E6E',
        hoverOpacity: 0.5,
        totalSalesFontSize: 28,
        donutStrokeWidth: 5,
        donutRadius: 70,

        restModeSumValue: "$ {TOTAL_SALES} K ",
        restModeSumText: "Total Sales ",
        hoverModePriceText: "Total Sales ",
        hoverModePriceValue: "${SALES} K ",
        hoverModeProductType: "{productId} ",
        hoverModeProductName: "{name} ",

        productIdFontSize: 18,
        productNameFontSize: 21,
        productIdYOffset: -15,
        productNameYOffset: -30,
        hoverModePriceTextFontSize: 24,
        totalSalesValueFontSize: 80,
        zoomLevel: 1.3,
        isLeftChecked : true,


        interpolationConfig: {
            interpolate: true,
            defaultColor: "#B2B2B2"
        },

        layoutType: consts.LAYOUT_TYPE.COMPLEX   // can be SIMPLE,COMPLEX




    }

    var _var = {
        attrs: attrs,
        calc: null,
        chart: null,
        consts: consts,
        handlers: {
            mouseEnter: null,
            mouseLeave: null,
            mouseMove: null,
            toggleClicked: null,
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
                        .centerPoint(_var.centerPoint)
                        .layouts(_var.layouts)
                        .arcs(_var.arcs)
                        .handlers(_var.handlers)
                        .run();


                    break;



                case 'handlers':

                    // Handling
                    _var = components.handlers()
                        ._var(_var)
                        .handlers(_var.handlers)
                        .sectors(_var.sectors)
                        .attrs(_var.attrs)
                        .calc(_var.calc)
                        .arcs(_var.arcs)
                        .productImage(_var.productImage)
                        .productName(_var.productName)
                        .productId(_var.productId)
                        .productRevenue(_var.productRevenue)
                        .totalSalesValueG(_var.totalSalesValueG)
                        .productDetailWrapperG(_var.productDetailWrapperG)
                        .run()



                    break;


            }
        }

        return _var;
    };

    // Expose some global variables
    ['data', 'container', 'urlLocation','isLeftChecked'].forEach((key) => {

        // Attach variables to main function
        return main[key] = function (_) {

            var string = `attrs['${key}'] = _`;

            if (!arguments.length) { eval(`return attrs['${key}']`); }
            eval(string);
            return main;
        };
    });


    main.toggleClicked = (f) => { _var.handlers.toggleClicked = f; return main; }


    // Secondary functions
    main.run = _ => main("build");

    return main;

}

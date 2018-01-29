// Imports
var d3 = require("d3");


// Initialize the visualization class
module.exports  = function () {
    "use strict";

    // Get attributes values
    var _var = undefined;
    var updateHandlerFuncs = undefined;
    var attrs = undefined;
    var ticks = undefined;
    var line = undefined;
    var area = undefined;
    var layouts = undefined;
    var scales = undefined;


    // Validate attributes
    var validate = function (step) {
        switch (step) {
            case 'run': {
                if (!updateHandlerFuncs) console.log('err - updateHandlerFuncs');
                if (!attrs) console.log('err - attrs');
                if (!ticks) console.log('err - ticks');
                if (!line) console.log('err - line');
                if (!area) console.log('err - area');
                if (!layouts) console.log('err - layouts');
                if (!scales) console.log('err - scales');
                return true;
            }


            default: return false;
        }
    };

    // Main function
    var main = function (step) {

        // Validate attributes if necessary
        if (validate(step)) {

            switch (step) {

                case 'run':

                    updateHandlerFuncs.newData = function newData() {

                        scales.y.domain(d3.extent(attrs.newData, d => d.value))

                        attrs.newData.forEach((d, i) => {
                            d.date = new Date(d.date);
                        })

                        line.datum(attrs.newData)
                            .transition()
                            .attr("d", layouts.line);

                        area.datum(attrs.newData)
                            .transition()
                            .attr("d", layouts.area);



                    }

                    updateHandlerFuncs.fillColor = function fillColor() {
                        ticks.selectAll('rect').attr('fill', attrs.fillColor);
                        line.attr('stroke', attrs.fillColor);
                        area.attr('fill', attrs.fillColor);
                    }


            }
        }

        return _var;
    };



    ['_var', 'scales', 'updateHandlerFuncs', 'ticks', 'line', 'area', 'attrs', 'layouts'].forEach(function (key) {

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

// Imports
var d3 = require("d3");

// Initialize the visualization class
module.exports  = function () {
    "use strict";

    // Get attributes values
    var _var = undefined;
    var attrs = undefined;
    var calc = undefined;
    var chart = undefined;
    var scales = undefined;
    var layouts = undefined;


    // Validate attributes
    var validate = function (step) {
        switch (step) {
            case 'run': {

                if (!attrs) console.log('not valid - attrs');
                if (!calc) console.log('not valid - calc');
                if (!chart) console.log('not valid -chart');
                if (!scales) console.log('not valid - scales');
                if (!layouts) console.log('not valid - layouts');

                return true;
            };
            default: return false;
        }
    };

    // Main function
    var main = function (step) {

        // Validate attributes if necessarsy
        if (validate(step)) {

            switch (step) {

                // Build entire visualizations
                case 'run':
                    //lines
                    var line = chart.append('path')
                        .datum(attrs.data.values)
                        .attr('fill', 'none')
                        .attr("stroke", attrs.fillColor)
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-linecap", "round")
                        .attr("stroke-width", attrs.lineStrokeWidth)
                        .attr("d", layouts.line);


                    //area
                    var area = chart.append('path')
                        .datum(attrs.data.values)
                        .attr('fill', attrs.fillColor)
                        .attr('fill-opacity', 0.25)
                        .attr("d", layouts.area);

                    //bottom axis
                    chart.append('rect')
                        .attr('width', calc.chartWidth)
                        .attr('height', 2)
                        .attr('fill', attrs.bottomAxisFill)
                        .attr('y', calc.chartHeight)



                    //ticks
                    var layoutPercentPositions = [30, 60, 100];

                    var ticks = chart.append('g')
                        .selectAll('.axis-ticks')
                        .data(layoutPercentPositions)
                        .enter()
                        .append('g')
                        .attr('class', 'axis-ticks')

                    ticks.append('rect')
                        .attr('width', 10)
                        .attr('height', attrs.axisStrokeWidth)
                        .attr('x', -10)
                        .attr('y', d => scales.axes(d))
                        .attr('fill', attrs.fillColor)

                    ticks.append('rect')
                        .attr('width', 10)
                        .attr('height', attrs.axisStrokeWidth)
                        .attr('x', calc.chartWidth)
                        .attr('y', d => scales.axes(d))
                        .attr('fill', attrs.fillColor)



                    // =======================  ASSIGN NEEDED PROPS   =========================
                    _var.ticks = ticks;
                    _var.area = area;
                    _var.line = line;

                    break;
            }
        }

        return _var;
    };



    ['_var', 'calc', 'attrs', 'chart', 'centerPoint', 'layouts', 'scales'].forEach(function (key) {

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

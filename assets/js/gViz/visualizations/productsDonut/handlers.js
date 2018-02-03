// Imports
var d3 = require("d3");


// Initialize the visualization class
module.exports = function () {
    "use strict";

    // Get attributes values
    var _var = undefined;
    var handlers = undefined;
    var sectors = undefined;
    var attrs = undefined;
    var calc = undefined;
    var arcs = undefined;

    var productImage = undefined;
    var productName = undefined;
    var productId = undefined;
    var productRevenue = undefined;
    var totalSalesValueG = undefined;
    var productDetailWrapperG = undefined;



    // Validate attributes
    var validate = function (step) {
        switch (step) {
            case 'run': {
                if (!handlers) { console.log('err - handlers') }
                if (!sectors) { console.log('err - sectors') }
                if (!attrs) { console.log('err - attrs') }
                if (!calc) { console.log('err - calc') }
                if (!arcs) { console.log('err - arcs') }

                if (!productImage) { console.log('err - productImage') }
                if (!productName) { console.log('err - productName') }
                if (!productId) { console.log('err - productId') }
                if (!productRevenue) { console.log('err - productRevenue') }
                if (!productDetailWrapperG) { console.log('err - productDetailWrapperG') }
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

                    displayProductDetailElements(false);
                    // #################################   MOUSE ENTER   ##############################

                    handlers.mouseEnter = function mouseEnter(d, hoveredElement) {


                        sectors.attr('opacity', attrs.hoverOpacity);


                        if (hoveredElement) {

                            hoveredElement
                                .attr('opacity', 1)
                                .attr('stroke', 'none')
                                .style("filter", _var.filterUrl)
                                .attr('fill', d => d.data.hoverColor)
                                .transition()
                                .attr("d", arcs.donutHover)
                        }




                        d.data.SALES = d.data.sales.toFixed(0);

                        productRevenue
                            .text(replaceWithProps(attrs.hoverModePriceValue, d.data))
                            //.text('$' + d.data.sales.toFixed(0) + 'K')
                            .attr('fill', d.data.hoverColor)


                        productId
                            .text(replaceWithProps(attrs.hoverModeProductType, d.data))
                            .attr('fill', attrs.productTextDefaultFill);

                        productImage.transition().attr('xlink:href', d.data.img);



                        productName
                            .text(replaceWithProps(attrs.hoverModeProductName, d.data))
                            .attr('fill', d.data.hoverColor)
                            .call(wrap, 2 * calc.innerRadius - 80);

                        d.data.COMMA_FORMATTED_VALUE = calc.commaFormat(d.data.sales)

                        _var.totalSalesValueSimple.attr('fill', d.data.hoverColor)
                            .text(replaceWithProps(attrs.hoverModePriceValue, d.data))



                        _var.salesValueTextSimple.attr('fill', d.data.hoverColor)
                            .text(replaceWithProps(attrs.hoverModeProductName, d.data))

                        d.data.PERCENT = ((d.endAngle - d.startAngle) / (Math.PI * 2) * 100).toFixed(2);

                        _var.simpleHoverPercent
                            .text(replaceWithProps(attrs.simpleModePercentText, d.data))
                            .attr('opacity', '1')

                        displayProductDetailElements(true);
                    }



            }


            // #################################   TOOLTIP MOUSE OVER   ##############################

            handlers.mouseOver = function mouseOver(d, hoveredElement) {



            }


            // #################################   TOOLTIP MOUSE LEAVE   ##############################

            handlers.mouseLeave = function mouseLeave(d, hoveredElement) {


                sectors.attr('opacity', 1)
                    .style("filter", "none")
                    .attr('stroke', 'white')
                    .transition()
                    .attr("d", arcs.donut)
                    .attr('fill', d => d.data.restColor)

                _var.totalSalesValueSimple.attr('fill', attrs.productTextDefaultFill)
                    .text(replaceWithProps(attrs.restModeSumValue, { TOTAL_SALES: calc.totalSales.toFixed(0) }))

                _var.salesValueTextSimple.attr('fill', attrs.restModeSimpleLayoutCenterTextFill)
                    .text(attrs.restModeSumText)


                _var.simpleHoverPercent
                    .attr('opacity', '0')


                displayProductDetailElements(false);


            }


            function displayProductDetailElements(shouldDisplay) {
                var opacity = 1;
                var opposite = 0;

                if (!shouldDisplay) {
                    opacity = 0;
                    opposite = 1
                };

                totalSalesValueG.transition().attr('opacity', opposite);
                productDetailWrapperG.transition().attr('opacity', opacity);


            }

            // util functions
            function replaceWithProps(text, obj) {
                var keys = Object.keys(obj)
                keys.forEach(key => {
                    var stringToReplace = `{${key}}`;
                    var re = new RegExp(stringToReplace, 'g');
                    text = text.replace(re, obj[key]);
                })
                return text;

            }

            function wrap(text, width) {
                text.each(function () {
                    var text = d3.select(this),
                        words = text.text().split(/\s+/).reverse(),
                        word,
                        line = [],
                        lineNumber = 0,
                        lineHeight = 1.1, // ems
                        y = text.attr("y"),
                        dy = parseFloat(text.attr("dy")),
                        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                    while (word = words.pop()) {
                        line.push(word);
                        tspan.text(line.join(" "));
                        if (tspan.node().getComputedTextLength() > width) {
                            line.pop();
                            tspan.text(line.join(" "));
                            line = [word];
                            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                        }
                    }
                });
            }



        }

        return _var;
    };



    ['_var', 'handlers', 'sectors', 'attrs', 'calc', 'arcs', 'productImage', 'productName', 'productId', 'productRevenue', 'totalSalesValueG', 'productDetailWrapperG'].forEach(function (key) {

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

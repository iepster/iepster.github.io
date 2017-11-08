// Imports
var d3 = require("d3");

// Initialize the visualization class
module.exports = function () {
    "use strict";

    // Get attributes values
    var _var = undefined;
    var attrs = undefined;
    var calc = undefined;
    var chart = undefined;
    var textWrapper = undefined;
    var svg = undefined;



    var transitionTimeUnit = 300;
    var initialDelay = 1000;
    var textMarginDuration=200;



    // Validate attributes
    var validate = function (step) {
        switch (step) {
            case 'run': {
                if (!attrs) console.log('not valid - attrs');
                if (!calc) console.log('not valid - calc');
                if (!chart) console.log('not valid -chart');
                if (!textWrapper) console.log('not valid -textWrapper');
                if (!svg) console.log('not valid - svg');
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

                // Build entire visualizations
                case 'run':
                if(!attrs.useTransition){
                    transitionTimeUnit = 0;
                    attrs.textDuration = 0;
                    initialDelay = 0;
                    textMarginDuration=0;
                }


                    console.log(calc);
                    // first line
                    var linesWrapper = chart.append('g').attr('class', 'lines-wrapper');
                    var firstLine = attrs.firstLine;

                    linesWrapper.selectAll('g')
                        .data(attrs.lineData);



                    // texts
                    var notices = textWrapper
                        .selectAll('.each-notice-wrapper')
                        .data(attrs.data)
                        .enter()
                        .append('div')
                        .attr('class', 'each-notice-wrapper')
                        .style('padding-top', attrs.firstLineHeight + 'px')


                    var texts = notices.append('p').attr('class', 'text');
                    var props = notices.append('div').attr('class', 'props');



                    notices.each(function (d, i, arr, test) {




                        var noticeWrapper = d3.select(this);
                        var text = noticeWrapper.select('.text');
                        var props = noticeWrapper.select('.props');

                        if (i == 0) {
                            // drawing first line
                            chart.append('rect')
                                .attr('class', 'verticalLine')
                                .attr('width', attrs.lineThickness)
                                .attr('fill', attrs.lineColor)
                                .transition()
                                .ease(attrs.ease)
                                .duration(transitionTimeUnit)
                                .attr('height', function () {
                                    return d.lineProps.y2 + Math.ceil(attrs.lineThickness / 2);
                                })


                            //first horizontal
                            chart.append('rect')

                                .attr('class', 'horizontalLine0')
                                .attr('height', attrs.lineThickness)
                                .attr('fill', attrs.lineColor)
                                .attr('y', function(){
                                  console.log(Math.ceil(attrs.lineThickness / 2), attrs.pointRadius / 2);
                                  return d.lineProps.y2 + Math.ceil(attrs.pointRadius / 2) - Math.ceil(attrs.lineThickness / 2);
                                })
                                .transition()
                                .ease(attrs.ease)
                                .duration(transitionTimeUnit)
                                .delay(transitionTimeUnit)
                                .attr('width', d.lineProps.x3)

                            chart.append('circle')
                                .attr('class', 'horizontalLinePoint0')
                                .attr('cx', attrs.horizontalLineWidth)
                                .attr('fill', attrs.lineColor)
                                .attr('cy', function () {
                                    return d.lineProps.y3 + Math.ceil(attrs.pointRadius / 2);
                                })
                                .transition()
                                .delay(2*transitionTimeUnit)
                                .attr('r', attrs.pointRadius)


                        }

                        var textDuration = attrs.textDuration;


                        text.transition()
                            .duration(textDuration)
                            .ease(d3.easeLinear)
                            .delay(function (d) {
                                if (i == 0) return initialDelay; // initialDelay
                                return 2 * i * textDuration + textDuration + textMarginDuration;
                            })
                            .tween("text", function (dt) {
                                var newHtml = dt.text;
                            var attrText = '';


                                var propHtml = "";
                                if (dt.attributes) {
                                    //assembling properties
                                    propHtml = dt.attributes.map((prop, i, arr) => {

                                        var htmlContent = "<b>" + prop.name + "</b> : " + prop.value;
                                        attrText += ` ${prop.name} : ${prop.value}`;
                                        if (i < arr.length - 1) {
                                            htmlContent += "<span style='font-weight:bold;color:" + attrs.lineColor + "' class='props-divider'> | </span>"
                                        }
                                        return htmlContent;

                                    }).join("");

                                }
                                attrs.startTyping(newHtml + attrText);

                                newHtml += "<br>" + propHtml;

                                var textLength = newHtml.length;

                                return (t) => {

                                    this.innerHTML = newHtml.slice(0,
                                        Math.round(t * textLength));

                                };
                            })
                            .on('end', function () {
                                console.log(d.aindex)
                                if (i == arr.length - 1) {
                                    attrs.callback();
                                    return;
                                };
                                console.log('ended')
                                var k = d.nextNode;





                                k.lineProps = {};
                                var index = i//i ? i - 1 : i;
                                var bbox = arr[index].getBoundingClientRect();


                                var height = bbox.height;

                                k.lineProps.x1 = k.previousNode.lineProps.x2;

                                k.lineProps.y1 = k.previousNode.lineProps.y2;

                                k.lineProps.y2 = k.lineProps.y1 + height;
                                k.lineProps.x2 = k.lineProps.x1;

                                k.lineProps.y3 = k.lineProps.y2;
                                k.lineProps.x3 = attrs.horizontalLineWidth;



                                console.log(k)

                                var allLength = height + attrs.horizontalLineWidth;

                                k.lineProps.horTime = attrs.horizontalLineWidth / allLength * calc.allTime;



                                // get Client Box of previous text


                                var totalDuration = textDuration;
                                var totalLength = height + k.lineProps.x3;
                                var vertDuration = height / totalLength * totalDuration;
                                var horDuration = k.lineProps.x3 / totalLength * totalDuration;


                                chart.append('rect')
                                    .attr('class', 'verticalLine')
                                    .attr('width', attrs.lineThickness)
                                    .attr('fill', attrs.lineColor)
                                    .transition()
                                    .ease(attrs.ease)
                                    .duration(vertDuration)
                                    .attr('height', function () {
                                        return k.lineProps.y2 + Math.ceil(attrs.lineThickness / 2);
                                    })


                                //first horizontal
                                chart.append('rect')
                                    .attr('class', 'horizontalLine' + (i + 1))
                                    .attr('height', attrs.lineThickness)
                                    .attr('fill', attrs.lineColor)
                                    .attr('y', function(){
                                    return k.lineProps.y2 + Math.ceil(attrs.pointRadius / 2) - Math.ceil(attrs.lineThickness / 2);
                                    })
                                    .transition()
                                    .ease(attrs.ease)
                                    .duration(horDuration)
                                    .delay(vertDuration)
                                    .attr('width', k.lineProps.x3)



                                svg.attr('height', k.lineProps.y2 + 100)


                                chart.append('circle')
                                    .attr('class', 'horizontalLinePoint' + (i + 1))
                                    .attr('cx', attrs.horizontalLineWidth)
                                    .attr('fill', attrs.lineColor)
                                    .attr('cy', function () {
                                        return k.lineProps.y3 + Math.ceil(attrs.pointRadius / 2);
                                    })
                                    .transition()
                                    .delay(totalDuration)
                                    .attr('r', attrs.pointRadius)

                            });



                    })


                    window.addEventListener('resize', function () {

                        chart.selectAll('.verticalLine').remove();


                        chart.append('rect')
                            .attr('class', 'verticalLine')
                            .attr('width', attrs.lineThickness)
                            .attr('fill', attrs.lineColor);


                        var eachBoxHeight = Array.prototype.slice.call(textWrapper.node().querySelectorAll('.text')).map(e => e.getBoundingClientRect().height)

                        var cummulativeSums = [];
                        eachBoxHeight.reduce(function (a, b, i) { return cummulativeSums[i] = a + b; }, 0);
                        console.log(cummulativeSums);


                        textWrapper.selectAll('.text')
                            .each(function (d, i, arr) {

                                var newY = attrs.firstLineHeight * (i + 1);
                                if (i) {
                                    newY += cummulativeSums[i - 1]
                                }


                                svg.attr('height', newY + 100)
                                chart.select('.verticalLine')
                                    .attr('height', newY)

                                chart.select('.horizontalLine' + i).attr('y', newY)
                                chart.selectAll('.horizontalLinePoint' + i).attr('cy', (d, i) => newY + attrs.pointRadius / 2)



                                // console.log(bbox);
                            })

                    })



                    // =======================  ASSIGN NEEDED PROPS   =========================


                    break;
            }
        }

        return _var;
    };



    ['_var', 'calc', 'attrs', 'chart', 'textWrapper', 'svg'].forEach(function (key) {

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

// Imports
var d3 = require("d3");


// Initialize the visualization class
module.exports = function () {
    "use strict";

    // Get attributes values
    var _var = undefined;
    var hierarchy = undefined;
    var layouts = undefined;
    var chart = undefined;
    var attrs = undefined;
    var calc = undefined;
    var handlers = undefined;
    var behaviors = undefined;
    var sunburst = undefined;
    var svg = undefined;


    var i = 0;


    // Validate attributes
    var validate = function (step) {
        switch (step) {
            case 'run': {
                if (!hierarchy) console.log('err - hierarchy');
                if (!layouts) console.log('err - layouts');
                if (!chart) console.log('err - chart');
                if (!attrs) console.log('err - attrs')
                if (!calc) console.log('err - calc')
                if (!handlers) console.log('err - handlers')
                if (!behaviors) console.log('err - behaviors')
                if (!sunburst) console.log('err - sunburst')
                if (!svg) console.log('err - svg')
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

                    update(hierarchy.root);


                    // #################################   DRAG START   ##############################

                    handlers.dragStarted = function dragStarted(d) {
                        attrs.oldSvgWidth = attrs.svgWidth - 20;
                        svg.attr('width', document.documentElement.clientWidth);


                    }



                    // #################################   DRAGGING   ##############################
                    handlers.dragging = function dragging(d) {


                        var nodeSelector = '[data-generated-id="' + d.data.generatedId + '"]';
                        var node = chart.select(nodeSelector);



                        var transMatrix = chart.node().getCTM();

                        var translatedX = transMatrix.e;
                        var translatedY = transMatrix.f;

                        var coords = {
                            x: d3.mouse(document.body)[0],
                            y: d3.mouse(document.body)[1]
                        }
                        node.attr('transform', 'translate(' + (coords.x + 40 - translatedX) / attrs.transform.k + ',' + (coords.y - 20 - translatedY) / attrs.transform.k + ')')

                        if (sunburst) {
                            sunburst.showDragCircle(true);
                            sunburst.makeSunburstTransparent(true);
                        }


                        if (sunburst) {
                            var isInDragCircle = sunburst.isInDragArea(coords, d);
                        }





                    }


                    // #################################   DRAG ENDED   ##############################

                    handlers.dragEnded = function dragEnded(d) {

                        if (sunburst) sunburst.showDragCircle(false);

                        var nodeSelector = '[data-generated-id="' + d.data.generatedId + '"]';
                        var node = chart.select(nodeSelector);

                        node.transition().select('rect').style('fill', d.data.color)

                        node.transition()
                            .attr("transform", function (d) {
                                // also moving nodes to the right 
                                var y = d.y + attrs.nodeRectSize * (d.depth - 1);
                                return "translate(" + y + "," + d.x + ")";
                            });


                        var coords = {
                            x: d3.mouse(document.body)[0],
                            y: d3.mouse(document.body)[1]
                        }

                        if (sunburst) {
                            sunburst.makeSunburstTransparent(false);
                           
                            var isInDragCircle = sunburst.isInDragArea(coords, d);

                            if (isInDragCircle) {
                                sunburst.addNode(d);
                            }
                        }

                        svg.attr('width', attrs.oldSvgWidth);

                    }


                    // #################################   REDRAWING  ##############################

                    handlers.redraw = function () {
                        var evt = d3.event.transform;
                        var oldScale = attrs.transform.k;
                        attrs.transform = evt;
                        attrs.transform.k = oldScale;
                        console.log(evt);
                        if (!isNaN(evt.x) && !isNaN(evt.y)) {
                            chart.attr("transform", evt);
                        } else {
                            console.log('something happened ' + evt)
                        }

                    }


                    function update(source) {

                        // Assigns the x and y position for the nodes
                        var treeData = layouts.tree(hierarchy.root);

                        // Compute the new tree layout.
                        var nodes = treeData.descendants().slice(1),
                            links = treeData.descendants().slice(1 + hierarchy.root.children.length);

                        // Normalize for fixed-depth.
                        nodes.forEach(function (d) { d.y = d.depth * 50 + 100; d.x += 300; });

                        // ****************** Nodes section ***************************

                        // Update the nodes...
                        var node = chart.selectAll('g.node')
                            .data(nodes, function (d) { return d.id || (d.id = ++i); });

                        // Enter any new modes at the parent's previous position.
                        var nodeEnter = node.enter().append('g')
                            .attr('class', 'node')
                            .attr('cursor', 'pointer')
                            .attr('data-generated-id', function (d) {
                                return d.data.generatedId;
                            })
                            .attr("transform", function (d) {
                                var y = source.y0;
                                // move nodes to the right and make free space
                                if (d.depth > 2) {
                                    y += attrs.nodeRectSize
                                }
                                return "translate(" + y + "," + source.x0 + ")";
                            })
                            .on('click', click)
                            .call(behaviors.drag);


                        // Add rect for the nodes
                        nodeEnter.append('rect')
                            .attr('class', 'node')
                            .attr('width', attrs.nodeRectSize)
                            .attr('height', attrs.nodeRectHeight)
                            .attr('y', attrs.nodeRectPosY)
                            .attr('x', calc.nodeRectPosX)
                            .style("fill", function (d) {

                                if(Array.isArray(d.data.color)){
                                    return d.data.color[d.depth-1];
                                }

                                return d.data.color;
                            });



                        // Add labels for the nodes
                        nodeEnter.append('text')
                            .attr("dy", ".35em")
                            .attr('fill', 'white')
                            .attr("x", attrs.nodeTextPosX)
                            .attr("text-anchor", "middle")
                            .text(function (d) { return shortenText(d.data.name,17); });


                        nodeEnter.append('image')
                            .attr('xlink:href', attrs.dragSymbolUrl)
                            .attr('width', attrs.dragSymbolDimension)
                            .attr('height', attrs.dragSymbolDimension)
                            .attr('x', -attrs.nodeRectSize * 0.56)
                            .attr('y', -attrs.nodeRectHeight / 3)

                        // UPDATE
                        var nodeUpdate = nodeEnter.merge(node);

                        // Transition to the proper position for the node
                        nodeUpdate.transition()
                            .duration(attrs.duration)
                            .attr("transform", function (d) {
                                // also moving nodes to the right 
                                var y = d.y + attrs.nodeRectSize * (d.depth - 1);
                                return "translate(" + y + "," + d.x + ")";
                            });




                        // Remove any exiting nodes
                        var nodeExit = node.exit().transition()
                            .duration(attrs.duration)
                            .attr("transform", function (d) {
                                //move to the left when exiting, to match parent node pos
                                var y = source.y;
                                if (d.depth > 2) y += + attrs.nodeRectSize
                                return "translate(" + y + "," + source.x + ")";
                            })
                            .remove();



                        // On exit reduce the opacity of text labels
                        nodeExit.select('text')
                            .style('fill-opacity', 1e-6);

                        // ****************** links section ***************************

                        // Update the links...
                        var link = chart.selectAll('path.link')
                            .data(links, function (d) { return d.id; });

                        // Enter any new links at the parent's previous position.
                        var linkEnter = link.enter().insert('path', "g")
                            .attr("class", "link")
                            .attr('d', function (d, i) {
                                var o = { x: source.x0, y: source.y0 }
                                return diagonal(o, o, i, d)
                            })
                            .attr('transform', function (d) {
                                // move links right, to match node's end
                                var x = attrs.nodeRectSize * (d.depth - 2 + attrs.linkMoveIndexX);
                                return 'translate(' + x + ',0)'
                            });

                        // UPDATE
                        var linkUpdate = linkEnter.merge(link);

                        // Transition back to the parent element position
                        linkUpdate.transition()
                            .duration(attrs.duration)
                            .attr('fill', 'none')
                            .attr('stroke', d => {

                                if(Array.isArray(d.data.color)){
                                    return d.data.color[d.depth-1];
                                }
                                
                                return d.data.color
                            })
                            .attr('d', (d, i) => diagonal(d, d.parent, i, d));

                        // Remove any exiting links
                        var linkExit = link.exit().transition().duration(attrs.duration)
                            .attr('d', function (d) {
                                var o = { x: source.x, y: source.y }
                                return diagonal(o, o, i, d)
                            })
                            .remove();

                        // Store the old positions for transition.
                        nodes.forEach(function (d) {
                            d.x0 = d.x;
                            d.y0 = d.y;
                        });



                        // Creates a curved (diagonal) path from parent to the child nodes
                        function diagonal(s, d, i, node) {


                            console.log(i);

                            var borderRadius = 10;
                            var startX = d.y;
                            var startY = d.x;

                            var endX = s.y;
                            var endY = s.x;

                            var diffY = endY - startY;
                            var diffX = endX - startX;

                            var buffer = 0;


                            var halfX = diffX / 2;

                            var yLineLength = Math.abs(diffY) - borderRadius * 2;
                            var xLineLength = halfX - borderRadius;

                            var endFirstLineX = (endX - startX) / 2 - borderRadius + startX;
                            var endirstLineY = s.y
                            var startMiddleLineX = endFirstLineX + borderRadius + d.y;

                            var cstartDestX = -borderRadius;
                            var cstartDestY = borderRadius;
                            var cstartContX = 0;
                            var cstartConty = borderRadius;

                            var cendDestX = borderRadius;
                            var cendDestY = -borderRadius;
                            var cendContX = 0;
                            var cendConty = -borderRadius;


                            if (startY < endY) {
                                console.log('gt')
                                buffer -= Math.abs(diffY)
                                cstartDestY -= borderRadius * 2;
                                cstartConty -= borderRadius * 2;
                                cendDestY += borderRadius * 2;
                                cendConty += borderRadius * 2;
                                yLineLength = -yLineLength;
                                borderRadius = -borderRadius;

                            }






                            var path = `M ${startX} ${startY} 
                                    l  ${xLineLength} 0
                                    M  ${endFirstLineX + Math.abs(borderRadius)}  ${endY + borderRadius}
                                     l 0 ${yLineLength}
                                     M  ${endX}  ${endY}
                                      l ${-xLineLength} 0
                                      M  ${endFirstLineX + Math.abs(borderRadius)}  ${endY + + yLineLength + borderRadius}
                                      c ${cstartContX},${cstartConty} ${cstartContX},${cstartConty} ${cstartDestX},${cstartDestY} 
                                       M  ${endFirstLineX + Math.abs(borderRadius)}  ${endY + borderRadius}
                                      c ${cendContX},${cendConty} ${cendContX},${cendConty} ${cendDestX},${cendDestY} 
                                    `


                            // fix line on odd child elements
                            var middleElement;
                            var arr = node.parent.children;
                            if (arr && arr.length % 2 == 1) {
                                middleElement = arr[Math.round((arr.length - 1) / 2)];
                            }

                            if (middleElement == node) {
                                path =
                                    `M ${startX} ${startY} 
                                    l  ${xLineLength * 4} 0
                                    `
                            }


                            return path;

                        }

                        // Toggle children on click.
                        function click(d) {
                            if (d.children) {
                                d._children = d.children;
                                d.children = null;
                            } else {
                                d.children = d._children;
                                d._children = null;
                            }
                            update(d);
                        }



                        function shortenText(text, size) {
                            if (text.length > size) {
                                return text.slice(0, size - 3) + '...';
                            }

                            return text;
                         }



                    }
            }
        }

        return _var;
    };



    ['_var', 'hierarchy', 'layouts', 'chart', 'attrs', 'calc', 'handlers', 'behaviors', 'sunburst', 'svg'].forEach(function (key) {

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

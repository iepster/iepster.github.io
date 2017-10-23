//Imports
var d3 = require("d3");
var line = require('./sunburst.line/_init.js');


// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var handlers = undefined;
  var tooltipDiv = undefined;
  var sunburstPaths = undefined;
  var breadcrumbTrail = undefined;
  var attrs = undefined;
  var states = undefined;
  var centerPoint = undefined;
  var scales = undefined;
  var arcs = undefined;
  var calc = undefined;
  var revenueValue = undefined;
  var productName = undefined;
  var productId = undefined;
  var centerText = undefined;
  var states = undefined;
  var dragCircleContent = undefined;
  var dragBackgroundCircle = undefined;
  var layouts = undefined;
  var hierarchy = undefined;
  var updateHandlerFuncs = undefined;
  var chart = undefined;
  var behaviors = undefined;
  var types = undefined;
  var lineChart = undefined;
  var productWrapper = undefined;
  var dragCircle = undefined;
  var productRevenue = undefined;
  var styleName = undefined;
  var productImage = undefined;
  var productTotalRevenueText = undefined;
  var productsDefinition = undefined;
  var styleName = undefined;
  var variablesButtonG = undefined;
  var totalSalesValueG = undefined;
  var totalSalesValue = undefined;
  var urlLocation = undefined;
  var tooltipLeft = 170;
  var freezed = false;
  var lineChartContainer;

  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run': {
        if (handlers == null) console.log('error - handlers')
        if (tooltipDiv == null) console.log('error - tooltipDiv')
        if (sunburstPaths == null) console.log('error - sunburstPaths')
        if (breadcrumbTrail == null) { console.log('error - breadcrumbTrail') }
        if (attrs == null) { console.log('error  - attrs') }
        if (states == null) { console.log('error  - statess') }
        if (centerPoint == null) { console.log('error - centerPoint') }
        if (scales == null) { console.log('error  - scales') }
        if (arcs == null) { console.log('error  - arcs') }
        if (calc == null) { console.log('error  - calc') }
        if (revenueValue == null) { console.log('error  - revenueValue') }
        if (productName == null) { console.log('error  - productName') }
        if (productId == null) { console.log('error  - productId') }
        if (centerText == null) { console.log('error  - centerText') }
        if (states == null) { console.log('error  - states') }
        if (dragCircleContent == null) { console.log('error  - dragCircleContents') }
        if (dragBackgroundCircle == null) { console.log('error  - dragBackgroundCircle') }
        if (hierarchy == null) { console.log('error  - hierarchy') }
        if (!updateHandlerFuncs) { console.log('err - updateHandlerFuncs') }
        if (!chart) { console.log('err - chart') }
        if (!behaviors) { console.log('err - behaviors') }
        if (!productWrapper) { console.log('err - productWrapper') }
        if (layouts == null) { console.log('error  - layouts') }
        if (!types) { console.log('err - types') }
        if (!dragCircle) { console.log('err - dragCircle') }
        if (!productRevenue) { console.log('err - dragCircle') }
        if (!styleName) { console.log('err - styleName') }
        if (!productImage) { console.log('err - productImage') }
        if (!productTotalRevenueText) { console.log('err - productTotalRevenueText') }
        if (!productsDefinition) { console.log('err - productsDefinition') };
        if (!variablesButtonG) { console.log('err - variablesButtonG') }
        if (!totalSalesValueG) { console.log('err -totalSalesValueG') }
        if (!totalSalesValue) { console.log('err - totalSalesValue') }
        if (!urlLocation) { console.log('err - urlLocation') }
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

          displayTooltipElements(false);

          // Wrap function for long texts
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

          // #################################   EXTERNAL EVENT HANDLERS   ##############################
          updateHandlerFuncs.highlighSectors = function (flag, productsArr) {
            if (freezed) return;
            sunburstPaths.attr('opacity', attrs.draggedSunburstTransparency);

            if (flag) {
              sunburstPaths
                .attr('opacity', 1).style("filter", "url(" + urlLocation + "#" + calc.dropShadowUrl + ")").attr('stroke', 'none')
                .filter((node, i) => {
                  var highlightThatNode = productsArr.some(prod => {
                    var result = false;
                    switch (node.data.type) {
                      case 'Category':
                        result = prod.Category == node.data.name;
                        break;
                      case 'Class':
                        result = (prod.Class == node.data.name &&
                          prod.Category == node.parent.data.name);
                        break;
                      case 'Collections':
                        result = (
                          prod.Collections == node.data.name &&
                          prod.Class == node.parent.data.name &&
                          prod.Category == node.parent.parent.data.name);
                        break;
                      case 'Style':
                        result = (
                          prod.Style == node.data.name &&
                          prod.Collections == node.parent.data.name &&
                          prod.Class == node.parent.parent.data.name &&
                          prod.Category == node.parent.parent.parent.data.name);
                        break;
                    }
                    return result;
                  });

                  return highlightThatNode;
                })
            } else {
              sunburstPaths.attr('opacity', 1).style("filter", "none").attr('stroke', 'white')
            }
          }

          updateHandlerFuncs.showDragCircle = function showDragCircle(flag) {
            if (freezed) return;
            displayAddDragCircleContents(flag);
            displayTooltipElements(false);
          }

          function makeDragAreaHighlighted(flag) {
            if (freezed) return;
            if (flag) {
              dragCircle.attr('stroke', '#63C39E').attr('stroke-width', 10).attr('stroke-dasharray', '20,0');
            } else {
              dragCircle.attr('stroke', 'red').attr('stroke-dasharray', '7,7').attr('stroke-width', 2);
            }
          }

          updateHandlerFuncs.makeSunburstTransparent = function (flag) {
            if (freezed) return;
            if (flag) {
              centerPoint.selectAll('path').attr('opacity', attrs.draggedSunburstTransparency);

            } else {
              centerPoint.selectAll('path').attr('opacity', 1);
            }
          }
          updateHandlerFuncs.isInDragArea = function isInDragArea(coords, newNode) {
            if (freezed) return;
            var rect = dragBackgroundCircle.node().getBoundingClientRect();
            var centerX = rect.right - calc.innerCircleRadius;
            var centerY = rect.top + calc.innerCircleRadius;

            //Checking if point is inside drag circle
            if ((Math.pow(coords.x - centerX, 2) + Math.pow(coords.y - centerY, 2)) < Math.pow(calc.innerCircleRadius, 2)) {
              if (canAddNode(newNode)) {
                makeDragAreaHighlighted(true);
              }
              return true;
            }
            makeDragAreaHighlighted(false)
            return false;
          }

          updateHandlerFuncs.addNode = function addNode(newNode) {
            var newNodesParent = newNode.parent;
            hierarchy.root.each(d => {
              if (d.data.generatedId == newNodesParent.data.generatedId) {

                // Then check if already exists
                var childrenIds = d.data.children.map(c => c.generatedId);
                if (childrenIds.indexOf(newNode.data.generatedId) == -1) {
                  var copied = JSON.parse(JSON.stringify(newNode.data));

                  // Append to the parent data
                  d.data.children.push(copied);

                  //Recalculate new hierarchy and update chart
                  calculateNewRootAndUpdateChart(attrs.data);
                }
              }
            })
            totalSalesValue.text(_var.formatting.restModeSumValue(hierarchy.root.value.toFixed(0)))
          }

          // #################################   DRAG START   ##############################
          handlers.dragStarted = function dragStarted(d) {
            if (freezed || !attrs.isFullScreenMode) return;
            if (attrs.state == states.INITIAL) {
              attrs.state = states.INITIAL_DRAG;
            } else if (attrs.state == states.DETAIL_VIEW) {
              attrs.state = states.DETAIL_DRAG;
            }
            displayDragCircleContents(true);
            displayTooltipElements(false);
            productWrapper.attr('opacity', 0)
            variablesButtonG.attr('opacity', 0)
          }

          // #################################   DRAGGING   ##############################
          handlers.dragging = function dragging(d) {
            if (freezed || !attrs.isFullScreenMode) return;
            var path = chart.select('[data-generated-id="' + d.data.generatedId + '"]');
            if (!d.data.alreadyGrabbedOnce) {
              d.data.dragPosX = d3.event.x;
              d.data.dragPosY = d3.event.y;
            }
            d.x = d3.event.x - d.data.dragPosX;
            d.y = d3.event.y - d.data.dragPosY;
            d.data.alreadyGrabbedOnce = true;
            path.attr('transform', 'translate(' + (d.x) + ',' + (d.y) + ')');
            if ((Math.pow(d3.event.x - 0, 2) + Math.pow(d3.event.y - 0, 2)) < Math.pow(calc.innerCircleRadius, 2)) {
              makeDragAreaHighlighted(true);
            } else {
              makeDragAreaHighlighted(false);
            }
          }

          // #################################   DRAG ENDED   ##############################
          handlers.dragEnded = function dragEnded(d) {
            if (freezed || !attrs.isFullScreenMode) return;
            var path = chart.select('[data-generated-id="' + d.data.generatedId + '"]');

            // Check for circle area
            if ((Math.pow(d3.event.x - 0, 2) + Math.pow(d3.event.y - 0, 2)) < Math.pow(calc.innerCircleRadius, 2)) {

              //Congratulations, we are in the drop zone, we can remove this item now
              var index = arrayObjectIndexOf(d.parent.data.children, d.data.generatedId, "generatedId");
              d.parent.data.children.splice(index, 1);
              updateHandlerFuncs.onNodeDeleted(d.data);

              //Recalculate new hierarchy
              calculateNewRootAndUpdateChart(attrs.data);
            } else {

              // Item was moved out of dropzone, move it back
              path.transition().attr('transform', 'translate(' + 0 + ',' + 0 + ')')
            }
            d.data.dragPosX = 0;
            d.data.dragPosY = 0;
            if (attrs.state == states.INITIAL_DRAG) {
              attrs.state = states.INITIAL;
            } else if (attrs.state == states.DETAIL_DRAG) {
              attrs.state = states.DETAIL_VIEW;
            }
            displayDragCircleContents(false)
            productWrapper.attr('opacity', function (d) {
              if (attrs.type == types.PRODUCTED) return 1;
              return 0;
            })
            variablesButtonG.attr('opacity', 1)
          }

          // #################################   TOOLTIP START   ##############################
          handlers.tooltipMouseEnter = function tooltipMouseEnter(d) {
            if (freezed && !d.isCurrentFreezedNode) return;
            if (attrs.state != states.INITIAL && attrs.state != states.DETAIL_VIEW) return;
            var result = "";
            var row2 = "";
            tooltipLeft = 180;
            var row1Styles = "padding:5px; overflow:hidden;border-radius:5px; "
            var row2Styles = "padding:5px;";
            d.data.PERCENT = (d.data.categoryPercent * 100).toFixed(1);
            if (d.depth > 1) {
              row2Styles += "border-bottom: 2px solid  " + d.data.color;
              var row2 = '<tr>  <td style="' + row2Styles + '">' + replaceWithProps(attrs.deepLevelTooltipText.left, d.data) + '</td>' + '<td  style="text-align:right;' + row2Styles + '">' + replaceWithProps(attrs.deepLevelTooltipText.right, d.data) + '</td> </tr>'
              tooltipLeft += 20;
            }
            d.data.PERCENT = (d.data.totalPercent * 100).toFixed(1);
            var row1 = '<tr  style="min-width:100px; ">  <td style="' + row1Styles + '">' + replaceWithProps(attrs.firstLevelTooltipText.left, d.data) + '</td>' + '<td style="text-align:right;' + row1Styles + '">' + replaceWithProps(attrs.firstLevelTooltipText.right, d.data) + '</td> </tr>'
            result = "<table style='border-collapse: collapse;overflow:hidden;border-radius:5px;'>" + row2 + row1 + "</table>"
            centerPoint.selectAll('path').attr('opacity', attrs.draggedSunburstTransparency);
            var sequenceArray = getAncestors(d);
            centerPoint.selectAll('path').filter(node => sequenceArray.indexOf(node) >= 0).attr('opacity', 1).style("filter", "url(" + urlLocation + "#" + calc.dropShadowUrl + ")").attr('stroke', 'none')

            // Configure tooltip direction
            if (d3.event.pageX < 210) {
              tooltipDiv.classed('left', true)
              tooltipDiv.classed('right', false)
            } else {
              tooltipDiv.classed('right', true)
              tooltipDiv.classed('left', false)
            }
            if ((d.x0 + d.x1) / 2 > 0.5) {
              // Most part is in the first hemisphere
              tooltipLeft -= 240;
              tooltipDiv.classed('left', true)
              tooltipDiv.classed('right', false)
            }
            tooltipDiv.html(result).style("left", (d3.event.pageX - tooltipLeft) + "px").style("top", (d3.event.pageY - 20) + "px").style('color', colorFuncFirst(d)).style('display', attrs.mouseToolTip == false ? 'none' : 'initial')

            if (attrs.type == types.PRODUCTED) {
              d.data.SALES = d.value.toFixed(2);
              productRevenue.attr('class', 'font-highlight').text(_var.formatting.hoverModePrice(d.data.SALES)).attr('fill', colorFuncFirst(d))
              productsDefinition.text(replaceWithProps(attrs.hoverModeProductType, d.data)).attr('dy', '-1.1em')
              styleName.text(replaceWithProps(attrs.hoverModeProductName, d.data)).attr('fill', colorFuncFirst(d)).attr('dy', '-1em').call(wrap, 2 * calc.innerCircleRadius - 80);
              productImage.attr('xlink:href', d.data.img);
            }
            if (attrs.type == types.LINED) {
              if (!lineChart) {
                lineChartContainer = d3.select(attrs.container).select('.' + attrs.lineChartSelector).node()
                lineChart = line();
                d3.select(lineChartContainer).attr('right', 0);
                lineChart.container(lineChartContainer).svgWidth(calc.chartWidth / 4).svgHeight(100).data({ values: d.data.values }).run();
              } else {
                lineChart.fillColor(d.data.color);
                if (d.data.values) {
                  lineChart.newData(d.data.values);
                }
              }

              // Texts
              d.data.SALES = d.value.toFixed(2);
              revenueValue.text(replaceWithProps(attrs.hoverModePriceText, d.data)).attr('fill', colorFuncFirst(d))
              productName.text(replaceWithProps(attrs.hoverModeProductName, d.data)).attr('fill', colorFuncFirst(d))
            }
            displayTooltipElements(true);
          }

          // #################################   TOOLTIP MOUSE OVER   ##############################
          handlers.tooltipMouseOver = function tooltipMouseOver(d) {
            if (freezed) return;
            tooltipDiv.style("left", (d3.event.pageX - tooltipLeft) + "px").style("top", (d3.event.pageY - 20) + "px");
          }

          // #################################   TOOLTIP MOUSE LEAVE   ##############################
          handlers.tooltipMouseLeave = function tooltipMouseLeave(d) {
            if (freezed) {
              tooltipDiv.style('opacity', 0);
              return;
            }
            centerPoint.selectAll('path').attr('opacity', 1).style("filter", "none").attr('stroke', 'white')
            displayTooltipElements(false);
          }

          // #################################   BREADCRUMB SHOW   ##############################
          handlers.breadcrumbShow = function breadcrumbShow(d) {
            if (attrs.state != states.INITIAL && attrs.state != states.DETAIL_VIEW) return;
            if (freezed) return;
            var b = attrs.breadCrumbDimensions;
            var sequenceArray = getAncestors(d);
            var backButtonWidth = 0;
            if (attrs.state == states.DETAIL_VIEW) {
              backButtonWidth = calc.backRectWidth;
            }
            var g = breadcrumbTrail.selectAll('g')
              .data(sequenceArray, d => d.data.generatedId)
            g.exit().remove();
            var entering = g.enter().append('svg:g')
            entering.append("svg:polygon").style('fill', colorFunc)
            entering.append('svg:text').attr("x", 20).attr("y", b.h / 2).attr("dy", "0.35em").attr("text-anchor", "start").attr('fill', 'white').attr('font-size', attrs.breadcrumbTextSize).text(function (d) { return d.data.name; });
            var all = entering.merge(g).attr('class', 'breadcrumbs').attr('transform', function (d, i) { return 'translate(' + ((i) * (b.w + b.s) + backButtonWidth) + ',0)' });
            var startX = backButtonWidth;
            all.each(function (d, i, arr) {
              var wrapper = d3.select(this);
              var text = wrapper.select('text');
              var bbox = text.node().getBBox();
              wrapper.attr('transform', 'translate(' + startX + ',0)');
              wrapper.select('polygon').attr('points', breadcrumbPoints(d, i, arr, bbox.width + 35));
              startX += bbox.width + 35;
            })

            //   all.select('polygon').attr('points', breadcrumbPoints)
            g.exit().remove();
            breadcrumbTrail.selectAll('.breadcrumbs').attr('visibility', '')
          }

          // #################################   BREADCRUMB HIDE   ##############################
          handlers.breadcrumbHide = function breadcrumbHide(d) {
            if (freezed) return;
            if (attrs.state == states.DETAIL_VIEW) {
              breadcrumbTrail
                .selectAll('.breadcrumbs')
                .attr('visibility', function (d) {
                  if (d.depth > 1) {
                    return 'hidden';
                  }
                })
                .select('polygon')
                .attr('points', function (d, i) {
                  var width;
                  var textNode;
                  breadcrumbTrail.selectAll('g').each(function (d, i) {
                    if (!i) {
                      textNode = d3.select(this).select('text').node()
                    }
                  })
                  if (textNode) {
                    width = textNode.getBBox().width + 35
                  }
                  return breadcrumbPoints(d, 0, [d], width);
                });
            } else {
              breadcrumbTrail.selectAll('.breadcrumbs').attr('visibility', "hidden");
            }
          }

          // #################################    SECTOR FREEZING ON CLICK  ##############################
          handlers.freezeSector = function freezeSector(d) {
            if (freezed && d.freezed) {
              if (d.isFreezedNode) {
                freezed = false;
                centerPoint.selectAll('path').each(node => {
                  node.isFreezedNode = false;
                  node.freezed = false;
                  d.isCurrentFreezedNode = false;
                })
              }
            } else {
              if (attrs.state == states.DETAIL_VIEW) {
                freezed = true;
                d.isCurrentFreezedNode = true;
                centerPoint.selectAll('path').each(node => node.freezed = true)
                var n = d;
                while (n.parent) {
                  n.isFreezedNode = true;
                  n = n.parent;
                }
                displayTooltipElements(true);
                tooltipDiv.style('opacity', 0);
              }
            }
          }

          // #################################    DETAIL VIEW   ##############################

          handlers.detailView = function detailView(d) {
            console.log('detail view')
            if (attrs.state == states.DETAIL_VIEW || freezed) return;
            attrs.state = states.DETAIL_VIEW;
            breadcrumbTrail.selectAll('.back-button').style('display', '')
            handlers.breadcrumbShow(d);
            while (d.depth > 1) {
              d = d.parent;
            }
            centerPoint.transition()
              .duration(750)
              .tween("scale", function () {
                var xd = d3.interpolate(scales.x.domain(), [d.x0, d.x1]),
                  yd = d3.interpolate(scales.y.domain(), [d.y0, 1]),
                  yr = d3.interpolate(scales.y.range(), [d.y0 ? scales.y(1 / (d.depth + d.height + 1)) : 100, calc.radius]);
                return function (t) { scales.x.domain(xd(t)); scales.y.domain(yd(t)).range(yr(t)); };
              })
              .selectAll("path")
              .style('cursor', 'auto')
              .attr('stroke-width', (d) => {
                var stroke = d.depth > 2 ? 0.5 : 4;
                return stroke;
              })
              .attrTween("d", function (d) { return function () { return arcs.sunburst(d); }; })
              .attr('stroke-width', (d) => {
                var stroke = d.depth > 2 ? 0.5 : 4;
                return stroke;
                return stroke;
              })
            setTimeout(f => {
              centerPoint
                .selectAll("path")
                .filter(node => {
                  var parent = node;
                  while (parent.depth && parent.depth > 1) {
                    parent = parent.parent;
                  }
                  if (parent.data.generatedId != d.data.generatedId) {
                    return true;
                  }
                  return false;
                })
                .attr('display', 'none')
            }, 750)
          }

          // #################################    INITIAL VIEW   ##############################

          handlers.initialView = function initialView(d) {
            if (freezed) return;
            attrs.state = states.INITIAL;
            breadcrumbTrail.selectAll('.breadcrumbs').attr('visibility', 'hidden')
            breadcrumbTrail.selectAll('.back-button').style('display', 'none')

            //Return to initial view
            centerPoint
              .transition()
              .duration(750)
              .tween("scale", function () {
                var xd = d3.interpolate(scales.x.domain(), [0, 1]),
                  yd = d3.interpolate(scales.y.domain(), [0, 1]),
                  yr = d3.interpolate(scales.y.range(), [1 ? scales.y(0) : 100, calc.radius]);
                return function (t) { scales.x.domain(xd(t)); scales.y.domain(yd(t)).range(yr(t)); };
              })
              .selectAll("path")
              .attr('display', 'initial')
              .style('cursor', 'pointer')
              .attrTween("d", function (d) { return function () { return arcs.sunburst(d); }; })
              .attr('stroke-width', (d) => {
                var stroke = d.depth > 2 ? 0.5 : 4;
                return stroke;
                if (d.depth > 2) {
                  if (d.parent && d.parent.children) {
                    var index = d.parent.children.indexOf(d);
                    if (index == 0) {
                      stroke = 4;
                      d.firstBordered = true;
                    }
                  }
                }
                return stroke;
              })
          }

          // #################################    HELPER FUNCTIONS   ##############################
          function canAddNode(newNode) {
            var isPossible = false;

            // First match with parentNode
            var newNodesParent = newNode.parent;
            hierarchy.root.each(d => {
              if (isPossible) return;
              if (d.data.generatedId == newNodesParent.data.generatedId) {
                // Then check if already exists
                var childrenIds = d.data.children.map(c => c.generatedId);
                if (childrenIds.indexOf(newNode.data.generatedId) == -1) {
                  isPossible = true;
                }
              }
            })
            return isPossible;
          }

          // Todo make  as helper function
          function breadcrumbPoints(d, i, arr, width) {
            var points = [];
            var b = attrs.breadCrumbDimensions;
            if (width) {
              b.w = width;
            }
            points.push("0,0");
            points.push(b.w + ",0");
            if (i < (arr.length - 1)) {
              points.push(b.w + b.t + "," + (b.h / 2));
            }
            points.push(b.w + "," + b.h);
            points.push("0," + b.h);
            if (i > 0) {
              points.push(b.t + "," + (b.h / 2));
            }
            return points.join(" ");
          }

          // Todo make  as helper function
          function getAncestors(node) {
            var path = [];
            var current = node;
            while (current.parent) {
              path.unshift(current);
              current = current.parent;
            }
            return path;
          }

          function displayTooltipElements(shouldDisplay) {
            var opacityVal = shouldDisplay ? 1 : 0;
            variablesButtonG.style('display', shouldDisplay ? 'none' : 'initial');
            if (attrs.hideVariablesButton) variablesButtonG.style('display', 'none');
            totalSalesValueG.style('display', shouldDisplay ? 'none' : 'initial');
            centerText.attr('opacity', opacityVal);
            tooltipDiv.transition().style('opacity', opacityVal);
            d3.select(lineChartContainer).style('opacity', opacityVal)
            productId.attr('opacity', opacityVal);
            productName.attr('opacity', opacityVal);
            productImage.attr('opacity', opacityVal);
            revenueValue.attr('opacity', opacityVal);
            productTotalRevenueText.attr('opacity', opacityVal);
            productRevenue.attr('opacity', opacityVal);
            styleName.attr('opacity', opacityVal);
            productsDefinition.attr('opacity', opacityVal);
          }

          function displayAddDragCircleContents(shouldDisplay) {
            var opacityVal = shouldDisplay ? 1 : 0;
            dragCircleContent.attr('opacity', opacityVal).select('.add-text-wrapper').attr('opacity', opacityVal);
            dragBackgroundCircle.attr('opacity', opacityVal);
            variablesButtonG.attr('opacity', shouldDisplay ? 0 : 1)
          }

          function displayDragCircleContents(shouldDisplay) {
            var opacityVal = shouldDisplay ? 1 : 0;
            dragCircleContent.attr('opacity', opacityVal).select('.remove-text-wrapper').attr('opacity', opacityVal);
            dragBackgroundCircle.attr('opacity', opacityVal);
          }

          function arrayObjectIndexOf(myArray, searchTerm, property) {
            for (var i = 0, len = myArray.length; i < len; i++) {
              if (myArray[i][property] === searchTerm) return i;
            }
            return -1;
          }

          function calculateNewRootAndUpdateChart(data) {
            hierarchy.root = d3.hierarchy(data);
            hierarchy.root.sum(d => d.children ? 0 : d.sales ? d.sales : 1);

            //Reassign values for tooltip
            hierarchy.root.each(d => {
              if (d.parent) {
                d.data.categoryPercent = d.value / d.parent.value;
                d.data.totalPercent = d.value / hierarchy.root.value;
              }
            })
            var sel = centerPoint.selectAll('.sunburst-paths')
              .data(layouts.partition(hierarchy.root).descendants(), d => d.data.generatedId)
            sel.exit()
              .remove();
            sunburstPaths = sel.enter()
              .append('path')  // merge is happening bellow

            sunburstPaths = sunburstPaths.attr('class', 'sunburts-paths').attr('data-generated-id', d => d.data.generatedId).on('mouseenter.breadcrumb', d => handlers.breadcrumbShow(d)).on('mouseleave.breadcrumb', d => handlers.breadcrumbHide(d)).on('mouseenter.tooltip', d => handlers.tooltipMouseEnter(d)).on('mouseleave.tooltip', d => handlers.tooltipMouseLeave(d)).on('mousemove.tooltip', d => handlers.tooltipMouseOver(d)).on('click.detailView', d => handlers.detailView(d)).attr('stroke', 'white').attr('stroke-width', d => d.depth > 2 ? 0.5 : 4).attr('fill-opacity', d => { if (d.data.color instanceof Array) return 1; return attrs.opacityConfig[d.depth] }).style('fill', colorFunc).style('cursor', 'pointer').call(behaviors.drag).merge(sunburstPaths)
            centerPoint.transition().duration(700)
              .tween("scale", function (d) {
                var xd = d3.interpolate(scales.x.domain(), [0, 1]),
                  yd = d3.interpolate(scales.y.domain(), [0, 1]),
                  yr = d3.interpolate(scales.y.range(), [1 ? scales.y(0) : 100, calc.radius]);
                return function (t) { scales.x.domain(xd(t)); scales.y.domain(yd(t)).range(yr(t)); };
              })
              .selectAll("path").attr('display', 'initial').style('cursor', 'pointer').attrTween("d", function (d) { return function () { return arcs.sunburst(d); }; })
            totalSalesValue.text(_var.formatting.restModeSumValue(hierarchy.root.value.toFixed(0)))
            attrs.state = states.INITIAL;
          }

          function colorFunc(d) {
            if (Array.isArray(d.data.color)) {
              return d.data.color[d.depth - 1];
            }
            return d.data.color;
          }

          function replaceWithProps(text, obj) {
            var keys = Object.keys(obj)
            keys.forEach(key => {
              var stringToReplace = `{${key}}`;
              var re = new RegExp(stringToReplace, 'g');
              text = text.replace(re, obj[key]);
            })
            return text
          }

          function colorFuncFirst(d) {
            if (Array.isArray(d.data.color)) {
              return d.data.color[0];
            }
            return d.data.color;
          }
      }
    }
    return _var;
  };

  ['_var', 'handlers', 'tooltipDiv', 'sunburstPaths', 'breadcrumbTrail', 'attrs', 'states', 'centerPoint', 'scales', 'arcs', 'calc', 'revenueValue', 'productName', 'productId', 'centerText', 'states', 'dragCircleContent', 'dragBackgroundCircle', 'layouts', 'hierarchy', 'updateHandlerFuncs', 'chart', 'behaviors', 'types', 'productWrapper', 'dragCircle', 'productRevenue', 'styleName', 'productImage', 'productTotalRevenueText', 'productsDefinition', 'variablesButtonG', 'totalSalesValueG', 'totalSalesValue', 'urlLocation'].forEach(function (key) {

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

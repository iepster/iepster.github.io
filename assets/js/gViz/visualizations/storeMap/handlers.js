// Imports
var d3 = require("d3");


// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var handlers = undefined;
  var tooltipDiv = undefined;
  var infoDiv = undefined;
  var attrs = undefined;
  var chart = undefined;
  var updateHandlerFuncs = undefined;
  var barWrapper = undefined;
  var projection = undefined;
  var scales = undefined;
  var svg = undefined;
  var urlLocation;


  var tooltipLeft = 170;


  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run': {
        if (handlers == null) console.log('error - handlers');
        if (infoDiv == null) console.log('error - infoDiv');
        if (tooltipDiv == null) console.log('error - tooltipDiv');
        if (attrs == null) console.log('error - attrs');
        if (chart == null) console.log('error - chart');
        if (!updateHandlerFuncs) console.log('err -  updateHandlerFuncs');
        if (!barWrapper) console.log('err - barWrapper');
        if (!projection) console.log('err - projection');
        if (!scales) console.log('err - scales');
        if (!urlLocation) console.log('err - urlLocation');
        if (!svg) console.log('err - svg');
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
          // #################################   UPDATE HANDLER START   ##############################

          updateHandlerFuncs.highlightBars = function (flag, node) {


            barWrapper.attr('opacity', 0);



            if (flag) {

              //top green bar
              barWrapper
                .filter(d => {
                  var exists = d.values.some(prod => {
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
                  })

                  return exists;
                })
                .attr('opacity', 1)
                .select('.bar')
                .attr('fill', d => {
                  if (Array.isArray(node.data.color)) {
                    return node.data.color[node.depth - 1];
                  }
                  return node.data.color;
                })
                .attr('fill-opacity', 1)
                .attr('height', d => {
                  var filtered = d.values.filter(v => v[node.data.type] == node.data.name);
                  var sum = d3.sum(filtered, s => +s.sales);
                  d.currHeight = scales.linear(sum);
                  if (d.currHeight < 0) {
                    d.currHeight = 0;
                  }
                  return d.currHeight
                })
                .attr("y", d => projection([d.lon, d.lat])[1] - d.currHeight)
                .style("filter", "url(" + attrs.urlLocation + "#drop-shadow-map)")


              var infoPanelHtml = getInfoPanelHtml(getSunburstProps(node));
              infoDiv.html(infoPanelHtml);
              infoDiv.transition().duration(300).style('opacity', 1);

            } else {

              infoDiv.transition().duration(300).style('opacity', 0);

              barWrapper.attr('opacity', 1)
                .select('.bar')
                .attr('fill', attrs.barColor)
                .attr('width', attrs.barWidth)
                .attr('fill-opacity', attrs.barOpacity)
                .attr('height', d => scales.linear(d.salesSum))
                .attr("x", d => projection([d.lon, d.lat])[0])
                .attr("y", d => projection([d.lon, d.lat])[1] - scales.linear(d.salesSum))
                .style("filter", "none")
            }
          }

          // #################################   TOOLTIP START   ##############################

          handlers.tooltipMouseEnter = function tooltipMouseEnter(d, hoveredElement) {


            var result = "";
            var row1Styles = "padding:5px; overflow:hidden;border-radius:5px; "
            var row1 = '<tr  style="min-width:100px; "> <td>Contribution</td> <td style="' + row1Styles + '">' + d.contribution + '</td>' + ' </tr>'
            result = "<table style='border-collapse: collapse;overflow:hidden;border-radius:5px;'>" + row1 + "</table>"

            // configure tooltip direction
            if (d3.event.pageX < 210) {
              tooltipDiv.classed('left', true)
              tooltipDiv.classed('right', false)
            } else {

              tooltipDiv.classed('right', true)
              tooltipDiv.classed('left', false)
            }

            var infoPanelHtml = getInfoPanelHtml(getBarProps(d));

            tooltipDiv.html(`
                                <style>

                                .chart-tooltip-wrapper{
                                position:relative;
                                background-white;
                                max-width:200px;
                                min-width:200px;
                                box-shadow: -2px 3px 7px 0 rgba(0, 0, 0, 0.2);

                                color:${attrs.infoPanelColor}
                                }

                                .content-wrapper{


                                }

                                .chart-tooltip-wrapper:after {
                                    border: 7px solid white;
                                    bottom: 0px;
                                    content: "";
                                    position: absolute;
                                    width: 0;
                                    height: 0;
                                bottom:-6px;
                                left:92px;
                                    box-shadow: -4px 3px 3px 0 rgba(0, 0, 0, 0.1);
                                box-sizing: border-box;
                                transform-origin: 0 10;
                                    transform: rotate(-45deg);
                                content:"";
                                }

                                .chart-tooltip-wrapper table {
                                border-collapse: collapse;
                                width:100%;
                                }
                                .chart-tooltip-wrapper tr {

                                border: solid ${attrs.infoPanelColor};
                                border-width: 1px 1px 0px 1px;
                                }

                                .chart-tooltip-wrapper td {
                                    padding:7px;
                                }


                                .chart-tooltip-wrapper tr:last-child {

                                }


                                </style>



                                <div class='chart-tooltip-wrapper'>
                                    <div class='content-wrapper'>
                                    <table>
                                    ${attrs.tooltipProps.map(prop => `<tr><td class='font-highlight'>${replaceWithProps(prop.left, d)}</td>    <td style="text-align:right;font-weight:300">${replaceWithProps(prop.right, d)}</td></tr>`).join('')}
     </table>
                                    </div>
                                </div>

                        `)

              .style("left", (d3.event.pageX - tooltipLeft) + "px")
              .style("top", (d3.event.pageY - 20) + "px")
              .style('color', attrs.tooltipHoverColor)

            if (!attrs.hasTooltip) {
              tooltipDiv.style('display', 'none')
            }

            if (!attrs.hasInfoPanel) {
              infoDiv.style('display', 'none')
            }



            //hide others
            barWrapper.selectAll('rect')
              .attr('fill-opacity', 0);


            if (hoveredElement) {
              hoveredElement
                .select('.bar')
                // .attr('fill', attrs.barHoverColor)
                .attr('fill-opacity', 1)
                .style("filter", "url(" + urlLocation + "#drop-shadow-map)")

              hoveredElement
                .select('.black-bar')
                .attr('fill-opacity', 1)
            }


            infoDiv.html(infoPanelHtml);
            setInfoDivPosition();

            displayTooltipElements(true);


            if (!attrs.hasInfoPanel) {
              infoDiv.style('display', 'none')
            }

          }


          // #################################   TOOLTIP MOUSE OVER   ##############################

          handlers.tooltipMouseOver = function tooltipMouseOver(d, hoveredElement) {


            var bbox = hoveredElement.node().getBBox();
            var left = bbox.x - (bbox.x - attrs.moveLeft) / attrs.zoomWidth;

            // var chartX = attrs.transform.x ;
            // left += chartX;


            // var tooltipWidth = tooltipDiv.node().getBoundingClientRect().width;

            // left -= tooltipWidth / 2;

            tooltipDiv
              .style("left", (d3.event.pageX - 100) + "px")
              .style("top", (d3.event.pageY - 110) + "px")
            //.style("left", left + "px")
            //.style("top", 30 + "px")


          }


          // #################################   TOOLTIP MOUSE LEAVE   ##############################

          handlers.tooltipMouseLeave = function tooltipMouseLeave(d, hoveredElement) {
            displayTooltipElements(false);
            if (hoveredElement) {
              barWrapper.selectAll('rect')
                .attr('fill-opacity', 1);

              hoveredElement.select('.bar')
                //.attr('fill', attrs.barColor)
                .style("filter", "none")

            }


          }



          // PANING

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

            // Reset strokes width
            chart.selectAll('g').selectAll('path.geo-shape').style('stroke-width', (0.5 / attrs.transform.k) + 'px')

          }

          handlers.toggleClicked = function (isLeftChecked) {
            attrs.isHeatmapShowing = !isLeftChecked;
            if (isLeftChecked) {
              chart.style('filter', 'none').attr('opacity', 1)
              chart.selectAll('rect').style('pointer-events', 'all')
              chart.selectAll('.heatmap-rects').attr('opacity', 0).style('pointer-events', 'none')
              chart.selectAll('.bar-wrapper').style('display', 'block')
              d3.select(attrs.container).selectAll('.heatmap-legend-group, .heatmap-legend-text, .heatmap-legend-rect').style('display', 'none')

              // Style geo shapes
              chart.selectAll('g').selectAll('path.geo-shape')
                .style('stroke', 'none')
                .style('fill', '#E3F2F5')

            } else {

              // Style geo shapes
              chart.selectAll('g').selectAll('path.geo-shape')
                .style('stroke', '#E3F2F5')
                .style('stroke-opacity', 0.8)
                .style('stroke-width', (0.5 / attrs.transform.k) + 'px')
                .style('fill-opacity', 0.8)
                .style('fill', function (d) {
                  var obj = attrs._data.map[d.properties.abbr.toLowerCase()];
                  return obj == null ? "#FFF" : scales.heatmapColor(obj.salesSum);
                })
                .on('mouseenter.infoPanel;', function (d) { console.log('entered'); handlers.showShapeInfoPanel(d, d3.select(this)) })
                .on('mouseleave.infoPanel', function (d) { handlers.showShapeInfoPanel(d, d3.select(this), true) })


              //chart.style('filter', 'url(#gooeyCodeFilter)').attr('opacity', 0.7)
              chart.selectAll('rect').style('pointer-events', 'none')
              chart.selectAll('.heatmap-rects').attr('opacity', 1).style('pointer-events', 'none')
              chart.selectAll('.bar-wrapper').style('display', 'none')
              d3.select(attrs.container).selectAll('.heatmap-legend-group, .heatmap-legend-text, .heatmap-legend-rect').style('display', 'block')


            }

          }


          handlers.showShapeInfoPanel = function (d, hoveredElement, hideIt) {


            if (!attrs.isHeatmapShowing) return;

            var obj = attrs._data.map[d.properties.abbr.toLowerCase()];

            var props = [{ key: "sales sum", value: obj.salesSum }, { key: "sales percent", value: obj.salesPerc }]
            var infoPanelHtml = getInfoPanelHtml(props);
            infoDiv.html(infoPanelHtml);
            if (!hideIt) {
              infoDiv.style('display', 'inline')
              setInfoDivPosition();
              displayTooltipElements(true);

            } else {
              displayTooltipElements(false);

            }

            if (!attrs.hasInfoPanel) {
              infoDiv.style('display', 'none')
            }




          }
          //######################  FUNCS   ################
          function displayTooltipElements(shouldDisplay) {
            var opacityVal = shouldDisplay ? 1 : 0;
            infoDiv.transition().duration(300).style('opacity', opacityVal);
            tooltipDiv.transition().duration(300).style('opacity', opacityVal);
          }


          function setInfoDivPosition() {
            var infoDivBox = infoDiv.node().getBoundingClientRect();
            var svgBox = svg.node().getBoundingClientRect();
            infoDiv.style('bottom', (10) + 'px')


          }



          function getBarProps(d) {

            var props = [];


            attrs.infoPanelProps.forEach(prop => {
              props.push({
                key: prop.key,
                value: replaceWithProps(prop.value, d)
              })
            })



            // var props = [{
            //     key: 'Store',
            //     value: d.name
            // }, {
            //     key: 'City',
            //     value: d.city
            // }]


            // if (d.sales || d.sales == 0) {
            //     props.push({
            //         key: 'Sales Contribution $',
            //         value: d.sales
            //     })
            // }




            // if (d.salesPerc || d.salesPerc == 0) {
            //     props.push({
            //         key: '%Sales Contribution',
            //         value: d.salesPerc
            //     })
            // }




            // if (d.currentStockUnits || d.currentStockUnits == 0) {
            //     props.push({
            //         key: 'Current Stock Units',
            //         value: d.currentStockUnits
            //     })
            // }

            // if (d.expectedExcessStockUnits || d.expectedExcessStockUnits == 0) {
            //     props.push({
            //         key: 'Expected Excess Stock Units',
            //         value: d.expectedExcessStockUnits
            //     })
            // }



            return props;
          }


          function getSunburstProps(d) {

            var props = [{
              key: 'Sales Growth',
              value: d.value.toFixed(2)
            }]

            return props;
          }



          function getInfoPanelHtml(props) {



            var result =
              `
                        <table style='color:${attrs.infoPanelColor};min-width:200px;border-collapse: collapse;  background-color:white) ' >
                          ${props.map(p => `<tr style='border: 1pt solid ${attrs.infoPanelColor};min-width:150px'><td style='padding: 3px;'>&nbsp;&nbsp;${p.key}</td><td class='font-highlight' style='padding: 5px;text-align:right'>${p.value}&nbsp;&nbsp;</td></tr>`).join('')}
                        </table >
                        `

            return result;

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

      }
    }

    return _var;
  };



  ['_var', 'handlers', 'tooltipDiv', 'infoDiv', 'attrs', 'chart', 'updateHandlerFuncs', 'barWrapper', 'projection', 'scales', 'urlLocation', 'svg'].forEach(function (key) {

    // Attach variables to validation function
    validate[key] = function (_) {
      if (!arguments.length) { eval(`return ${key} `); }
      eval(`${key} = _`);
      return validate;
    };

    // Attach variables to main function
    return main[key] = function (_) {
      if (!arguments.length) { eval(`return ${key} `); }
      eval(`${key} = _`);
      return main;
    };
  });


  main.run = _ => main('run');

  return main;
};

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
  var scales = undefined;
  var handlers = undefined;
  var container = undefined;
  var updateHandlerFuncs = undefined;
  var defs = undefined;
  var svg = undefined;



  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run': {
        if (!attrs) console.log('not valid - attrs');
        if (!calc) console.log('not valid - calc');
        if (!chart) console.log('not valid -chart');
        if (!scales) console.log('not valid -scales');
        if (!handlers) console.log('not valid -handlers');
        if (!container) console.log('not valid -container');
        if (!updateHandlerFuncs) console.log('not valid - updateHandlerFuncs')
        if (!defs) { console.log('err - defs'); }
        if (!svg) { console.log('err - svg'); }
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



          var btnZoomOut = container
            .insert('div')
            .style('position', 'absolute')
            .style('bottom', '10px')
            .style('right', '50px')
            .style('padding', '5px')
            .style('background-color', 'white')
            .style('color', attrs.zoomButtonTextColor)
            .style('cursor', 'pointer')
            .style('background-color', attrs.zoomButtonColor)
            .html('<i class="di-plus" aria-hidden="true"></i>')
            .style('font-size', '10px')
            .on('click', function (d) {
              attrs.transform.k *= 1.1;
              chart.transition().attr('transform', `translate(${attrs.transform.x},${attrs.transform.y}) scale(${attrs.transform.k})`);
            })


          var btnZoomIn = container
            .insert('div')
            .style('position', 'absolute')
            .style('bottom', '10px')
            .style('right', '20px')
            .style('padding', '5px')
            .style('background-color', 'white')
            .style('color', attrs.zoomButtonTextColor)
            .style('background-color', attrs.zoomButtonColor)
            .style('cursor', 'pointer')
            .html('<i class="di-minus" aria-hidden="true"></i>')
            .style('font-size', '10px')
            .on('click', function (d) {
              attrs.transform.k /= 1.1;
              chart.transition().attr('transform', `translate(${attrs.transform.x},${attrs.transform.y}) scale(${attrs.transform.k})`);
            })



          var patternUrl = 'rectangularPattern' + Math.floor(Math.random() * 1000000) + Date.now();
          svg.append('defs')
            .append('pattern')
            .attr('id', patternUrl)
            .attr('width', attrs.rectanglePatternLength)
            .attr('height', attrs.rectanglePatternLength)
            .attr('patternUnits', 'userSpaceOnUse')
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', attrs.rectanglePatternLength)
            .attr('height', attrs.rectanglePatternLength)
            .attr('stroke', 'black')
            .attr('stroke-width', '0.24px')
            .attr('stroke-opacity', 0.6)
            .attr('fill', 'white');


          svg.select('rect')
            .attr('width', 2000)
            .attr('height', 2000)
            .attr('fill', 'url(' + attrs.urlLocation + '#' + patternUrl + ')')


          var mapWrapper = chart.append('g')
            .attr('class', 'map-wrapper')
            .attr('transform', 'translate(300,140)');



          var scale = 300;
          var offset = [410, 248];

          var projection = d3.geoMercator()
            .scale(scale)
            .translate(offset);


          var path = d3.geoPath().projection(projection);

          mapWrapper.selectAll('path')
            .data(calc.featuresWithoutAlaska)
            .enter()
            .append('path')
            .attr('class', 'geo-shape')
            .attr('d', path)
            .style('fill', '#E3F2F5')//attrs.patterBackgroundColor)
            .style('fill-opacity', 0.7)
            .style('stroke', 'none')
            .attr('transform', 'translate(' + attrs.moveLeft + ',' + attrs.moveTop + ') scale(' + attrs.zoomWidth + ',' + attrs.zoomHeight + ')')



          var barWrapper = mapWrapper.append('g')
            .attr('class', 'rect-wrapper')
            .selectAll('.bar-wrapper')
            .data(attrs.data.stores)
            .enter()
            .append('g')
            .attr('class', 'bar-wrapper')
            .on('mouseenter.tooltip', function (d) {
              handlers.tooltipMouseEnter(d, d3.select(this));
            })
            .on('mouseleave.tooltip', function (d) {
              handlers.tooltipMouseLeave(d, d3.select(this))
            })
            .on('mousemove.tooltip', function (d) {
              handlers.tooltipMouseOver(d, d3.select(this))
            })


          //top green bar
          barWrapper
            .append('rect')
            .attr('class', 'bar')
            .attr('cursor', 'pointer')

            .attr('fill', `url(${attrs.urlLocation}#${calc.gradientId})`)
            // .attr('fill', attrs.barColor)
            .attr('width', attrs.barWidth)
            .attr('fill-opacity', attrs.barOpacity)
            .attr('height', d => scales.linear(d.salesSum))
            .attr("x", d => projection([d.lon, d.lat])[0])
            .attr("y", d => projection([d.lon, d.lat])[1] - scales.linear(d.salesSum))
            .attr('transform', 'translate(' + attrs.moveLeft + ',' + attrs.moveTop + ') scale(' + attrs.zoomWidth + ',' + attrs.zoomHeight + ')')
            // .on('mouseenter.tooltip', function (d) {
            //     handlers.tooltipMouseEnter(d, d3.select(this));
            // })
            // .on('mouseleave.tooltip', function (d) {
            //     handlers.tooltipMouseLeave(d, d3.select(this))
            // })
            // .on('mousemove.tooltip', function (d) {
            //     handlers.tooltipMouseOver(d, d3.select(this))
            // })
            .on('mouseenter.barHoverStart', d => updateHandlerFuncs.barHoverStart(d))
            .on('mouseleave.barHoverEnd', d => updateHandlerFuncs.barHoverEnd(d))




          //bottom black bar
          barWrapper
            .append('rect')
            .attr('class', 'black-bar')
            .attr('cursor', 'pointer')
            .attr('fill', attrs.bottomBarColor)
            .attr('fill-opacity', attrs.barOpacity)
            .attr('width', attrs.barWidth)
            .attr('height', attrs.bottomBarHeight)
            .attr("x", d => projection([d.lon, d.lat])[0])
            .attr("y", d => projection([d.lon, d.lat])[1] - attrs.bottomBarHeight)
            .attr('transform', 'translate(' + attrs.moveLeft + ',' + attrs.moveTop + ') scale(' + attrs.zoomWidth + ',' + attrs.zoomHeight + ')')
            // .on('mouseenter.tooltip', d => handlers.tooltipMouseEnter(d))
            // .on('mouseleave.tooltip', d => handlers.tooltipMouseLeave(d))
            // .on('mousemove.tooltip', d => handlers.tooltipMouseOver(d))
            .on('mouseenter.barHoverStart', d => updateHandlerFuncs.barHoverStart(d))
            .on('mouseleave.barHoverEnd', d => updateHandlerFuncs.barHoverEnd(d))

          // ########################  TOGGLE  ########################

          var toggleWrapper = svg.append('g')
            .attr('display', attrs.displayToggle ? 'inline' : 'none')
            .attr('class', 'toggle-wrapper')
            .attr('transform', `translate(0,${0})`)
            .attr('cursor', 'pointer')
            .on('click', d => {
              toggleWrapper
                .select('circle')
                .transition()
                .attr('cx', (d) => {
                  return attrs.svgWidth - ((!attrs.isLeftChecked ? 10 : -10) + toggleWrapper.select('.heatmap').node().getBoundingClientRect().width + 40)
                }).on('end', (d) => {
                  attrs.isLeftChecked = !attrs.isLeftChecked;
                  if (handlers.toggleClicked) {
                    handlers.toggleClicked(attrs.isLeftChecked);
                  }
                });
            });


          toggleWrapper.append('rect').attr('width', attrs.svgWidth).attr('height', 34).attr('fill', 'white').style('pointer-events', 'none')

          toggleWrapper.append('text')
            .attr('class', 'heatmap')
            .text(attrs.toggleRightText)
            .attr('y', 10)
            .attr('alignment-baseline', 'middle')
            .attr('text-anchor', 'end')
            .attr('x', attrs.svgWidth)
            .attr('fill', attrs.infoPanelColor)


          toggleWrapper.append('rect')
            .attr('class', 'toggle-line')
            .attr('width', 40)
            .attr('height', 20)
            .attr('fill', '#EDEDED')
            .attr('rx', 10)
            .attr('x', attrs.svgWidth - (toggleWrapper.select('.heatmap').node().getBoundingClientRect().width + 60))


          toggleWrapper.append('circle')
            .attr('r', 8)
            .attr('cx', attrs.svgWidth - ((attrs.isLeftChecked ? 10 : -10) + toggleWrapper.select('.heatmap').node().getBoundingClientRect().width + 40))
            .attr('cy', 10)
            .attr('fill', '#4DBEA2')

          toggleWrapper.append('text')
            .attr('class', 'bars')
            .text(attrs.toggleLeftText)
            .attr('text-anchor', 'end')
            .attr('x', +toggleWrapper.select('.toggle-line').attr('x') - 10)
            .attr('y', 10)
            .attr('alignment-baseline', 'middle')
            .attr('fill', attrs.infoPanelColor)

          ////#############  BLURRED HEATMAP   ###############
          //barWrapper
          //  .append('rect')
          //  .attr('cursor', 'pointer')
          //  .attr('class', 'heatmap-rects')
          //  .attr('opacity', 0)
          //  .attr('fill', d => scales.heatmapColor(d.salesSum))
          //  .attr('width', attrs.barWidth)
          //  .attr('height', attrs.bottomBarHeight)
          //  .style('pointer-events', 'none')
          //  .attr('width', 12)
          //  .attr('height', 12)
          //  .attr("x", d => projection([d.lon, d.lat])[0])
          //  .attr("y", d => projection([d.lon, d.lat])[1] - attrs.bottomBarHeight)
          //  .attr('transform', 'translate(' + attrs.moveLeft + ',' + attrs.moveTop + ') scale(' + attrs.zoomWidth + ',' + attrs.zoomHeight + ')')

          //var defs = svg.append('defs');
          //var filter = defs.append('filter').attr('id', 'gooeyCodeFilter');
          //filter.append('feGaussianBlur')
          //  .attr('in', 'SourceGraphic')
          //  .attr('stdDeviation', '15')
          //  //to fix safari: http://stackoverflow.com/questions/24295043/svg-gaussian-blur-in-safari-unexpectedly-lightens-image
          //  .attr('color-interpolation-filters', 'sRGB')
          //  .attr('result', 'blur');
          //filter.append('feColorMatrix')
          //  .attr('in', 'blur')
          //  .attr('mode', 'matrix')
          //  .attr('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9')
          //  .attr('result', 'gooey');


          // Draw heat legend div
          var heatLegendGroup = container.selectAll('div.heatmap-legend-group').data(['heatmap-legend-group']);
          heatLegendGroup.exit().remove();
          heatLegendGroup = heatLegendGroup.enter().append("div").attr('class', 'heatmap-legend-group').merge(heatLegendGroup);
          heatLegendGroup
            .style('position', 'absolute')
            .style('display', 'none')
            .style('top', "-3px")
            .style('left', '-3px')
            .style('width', 'auto')
            .style('height', '20px')
            .style('color', attrs.infoPanelColor)
            .html("<div style='font-size: 14px; padding: 3px 5px; float: left;'> Low</div><div style='width: 20px; background: linear-gradient(to right, " + scales.heatmapColor(scales.heatMin) + " , " + scales.heatmapColor(scales.heatMax) + "); float: left; height: 12px; margin-top: 4px;'></div><div style='font-size: 14px; padding: 3px 5px; float: left;' >High</div>")


          //// Draw heat legend squares
          //var heatDiff = Math.abs(scales.heatMax - scales.heatMin) / 2;
          //var heatInterval = d3.range(2).map(function(d,i) { return scales.heatMax - heatDiff * i; });
          //var heatLegendRect = container.selectAll('div.heatmap-legend-rect').data(heatInterval);
          //heatLegendRect.exit().remove();
          //heatLegendRect = heatLegendRect.enter().append("div").attr('class', 'heatmap-legend-rect').merge(heatLegendRect);
          //heatLegendRect
          //  .style('position', 'absolute')
          //  .style('top', function(d, i) { return (40 + i * 20 + i * 3) + 'px'; })
          //  .style('right', '20px')
          //  .style('width', '20px')
          //  .style('height', '20px')
          //  .style('display', 'none')
          //  .style('background', function(d) { return scales.heatmapColor(d); })

          //// Draw heat legend text
          //var heatLegendText = container.selectAll('.heatmap-legend-text').data(heatInterval);
          //heatLegendText.exit().remove();
          //heatLegendText = heatLegendText.enter().append("div").attr('class', 'heatmap-legend-text').merge(heatLegendText);
          //heatLegendText
          //  .style('position', 'absolute')
          //  .style('top', function(d, i) { return (40 + i * 20 + i * 3) + 'px'; })
          //  .style('right', '39px')
          //  .style('width', 'auto')
          //  .style('font-size', '12px')
          //  .style('height', '20px')
          //  .style('line-height', '22px')
          //  .style('text-align', 'right')
          //  .style('background', 'white')
          //  .style('padding', '0px 5px')
          //  .style('display', 'none')
          //  .style('border', function(d) { return "1px solid " + scales.heatmapColor(d); })
          //  .html(function(d, i) { return d; })
          //  // .html(function(d, i) {
          //  //   if(i === heatInterval.length-1) { return scales.heatMin.toFixed(2) + " - " + d.toFixed(2); }
          //  //   else { return heatInterval[i+1].toFixed(2) + " - " + d.toFixed(2); }
          //  // })


          // =======================  ASSIGN NEEDED PROPS   =========================
          _var.barWrapper = barWrapper;
          _var.projection = projection;


          break;
      }
    }

    return _var;
  };



  ['_var', 'calc', 'attrs', 'chart', 'centerPoint', 'scales', 'handlers', 'container', 'updateHandlerFuncs', 'defs', 'svg'].forEach(function (key) {

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

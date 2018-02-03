// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var attrs = undefined;
  var calc = undefined;
  var chart = undefined;
  var svg = undefined;
  var scales = undefined;
  var handlers = undefined;
  var formats = undefined;

  // Get attributes values
  var _var = null;
  var components = null;
  var data = null;

  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run': {
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

          var attrs = {
            data: _var.data,
            container: null,
            urlLocation: null,
            scale: 1,
            svgWidth: _var.width,
            svgHeight: _var.height,
            marginTop: _var.margin.top,
            marginBottom: _var.margin.bottom,
            marginRight: _var.margin.right,
            marginLeft: _var.margin.left,
            svgFontFamily: "Yantramanav",
            legendText: _var.data.node.leftTitle,
            legendColorRectWidth: 45,
            legendRectPartsCount: 30,
            legendRectHeight: 5,
            marginBetweenLegendTexts: 25,
            colorLegend: _var.data.node.rightTitle,
            rectItemXProportion: 1,//0.8,
            rectItemYProportion: 1,//0.6,
            rectItemHoverOpacity: 0.1,
            rectItemDisplayText: "{SI_PREFIXED_VALUE}",
            rectItemTextFontSize: 11,
            rectItemTextColor: "'#A64138'",
            textDefaultColor: "#706F6F",
            axisTextFontSize: 11,
            axisDisplayText: "{{name}}",
            xAxisRigthMargin: 5,
            xAxisTextMargin: 5,
            yAxisTopMargin: 0,
            yAxisTextMargin: 9,
            axisTickLength: 5,
            axisTickThickness: 0.7,
            legendTextFontSize: 12,
            gridColor: "#706F6F",
            gridThickness: 0.3,
            gridDashArray: "1,3",
            gradientGridThickness: 3,
            lineGradientFromColor: "#3d3737",
            lineGradientToColor: "#f4eded",
            borderGridThickness: 0.5,
            legendTextTopMargin: 20,
            colorGradients: _var.data.node.colors
          }

          // calculated properties
          var calc = {};
          calc.chartLeftMargin = attrs.marginLeft;
          calc.chartTopMargin = attrs.marginTop;
          calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
          calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
          calc.eachCellHeight = calc.chartHeight / (attrs.data.data.nodes.length);
          calc.eachCellWidth = calc.chartWidth / (attrs.data.data.nodes.length);
          calc.eachRectWidth = calc.eachCellWidth * attrs.rectItemXProportion;
          calc.eachRectHeight = calc.eachCellHeight * attrs.rectItemYProportion;
          calc.eachLegendRectWidth = attrs.legendColorRectWidth / attrs.legendRectPartsCount;
          calc.replaceWithProps = function (text, obj) {
            var keys = Object.keys(obj)
            keys.forEach(key => {
              var stringToReplace = `{{${key}}}`;
              var re = new RegExp(stringToReplace, 'g');
              text = text.replace(re, obj[key]);
            })
            return text;
          }
          calc.itemIndexes = {};
          calc.items = {};
          attrs.data.data.nodes.forEach((d, i) => {
            calc.itemIndexes[d.id] = (i + 1)
            calc.items[d.id] = d;
          })

          attrs.data.data.links.forEach(value => {
            value.sourceId = value.source;
            value.targetId = value.target;
            value.xItem = calc.items[value.source];
            value.source = calc.items[value.source];
            value.yItem = calc.items[value.target];
            value.target = calc.items[value.target];
            value.X_ITEM_NAME = value.xItem.name;
            value.Y_ITEM_NAME = value.yItem.name;
            value.value = Number(value.value);
            value.totalValue = Number(value.totalValue);
          })

          //#######################   SCALES  ###################
          var scales = {};
          var color = d3.interpolateRgbBasis(attrs.colorGradients);
          scales.normalizedColor = color;
          scales.color = function (value) {
            return color(scales.colorValue(value));
          }
          scales.colorValue = d3.scaleLinear()
            .domain([
              d3.min(attrs.data.data.links, d => d.value),
              d3.max(attrs.data.data.links, d => d.value)
            ])
            .range([0, 1])

          //####################   FORMATS  ####################
          var formats = {}
          formats.SIprefix = d3.format(".2s");
          _var.valueFormat = shared.helpers.number.parseFormat(_var.data.node)

          //###########################   LEGENDS  ########################
          //draw legend wrapper
          var legendWrapper = _var.wrap.selectAll('.legend-wrapper').data(['legend-wrapper']);
          legendWrapper.exit().remove();
          legendWrapper = legendWrapper.enter().insert('g', ':first-child').attr('class', 'legend-wrapper').merge(legendWrapper)

          // drawl legend left text
          var legendText = legendWrapper.selectAll('.legend-text').data(['legend-text']);
          legendText.exit().remove();
          legendText = legendText.enter().append('text').merge(legendText);
          legendText.attr('class', 'legend-text')
            .text(attrs.legendText)
            .attr('fill', attrs.textDefaultColor)
            .attr('font-size', attrs.legendTextFontSize)
            .attr('y', attrs.legendTextTopMargin)

          //gradient line wrapper
          var gradientLineWrapper = legendWrapper.selectAll('.legend-rect-wrapper').data(['legend-rect-wrapper'])
          gradientLineWrapper.exit().remove();
          gradientLineWrapper = gradientLineWrapper.enter().append('g').merge(gradientLineWrapper)
          gradientLineWrapper.attr('class', 'legend-rect-wrapper')

          // draw gradient line legend
          var legendTextWidth = _var.wrap.select('.legend-text').node().getBBox().width;
          var rectsArr = Array(attrs.legendRectPartsCount).fill(1);

          // legend rects
          var legendRects = gradientLineWrapper.selectAll('.legend-rects').data(rectsArr);
          legendRects.exit().remove();
          legendRects = legendRects.enter().append('rect').attr('class', 'legend-rects').merge(legendRects);
          legendRects.attr('width', calc.eachLegendRectWidth)
            .attr('height', attrs.legendRectHeight)
            .attr('y', attrs.legendTextTopMargin - attrs.legendRectHeight - 1)
            .attr('fill', (d, i) => scales.normalizedColor(1 - i / rectsArr.length))
            .attr('stroke', (d, i) => scales.normalizedColor(1 - i / rectsArr.length))
            .attr('x', (d, i) => legendTextWidth + attrs.marginBetweenLegendTexts + i * calc.eachLegendRectWidth)

          // plus sign
          var signPlus = legendWrapper.selectAll('.sign-plus').data(['sign-plus'])
          signPlus.exit().remove();
          signPlus = signPlus.enter().append('text').merge(signPlus);
          signPlus.text('+')
            .attr('y', attrs.legendTextTopMargin)
            .attr('fill', attrs.textDefaultColor)
            .attr('font-size', attrs.legendTextFontSize)
            .attr('x', legendTextWidth + attrs.marginBetweenLegendTexts - 10)

          //minus sign
          var signMinus = legendWrapper.selectAll('.sign-minus').data(['sign-minus']);
          signMinus.exit().remove();
          signMinus = signMinus.enter().append('text').merge(signMinus);
          signMinus.attr('class', 'sign-minus')
            .text('-')
            .attr('y', attrs.legendTextTopMargin)
            .attr('fill', attrs.textDefaultColor)
            .attr('font-size', attrs.legendTextFontSize)
            .attr('x', legendTextWidth + attrs.marginBetweenLegendTexts + attrs.legendColorRectWidth + 7)

          //right legend text
          var rightLegendText = legendWrapper.selectAll('right-legend-text').data(['right-legend-text']);
          rightLegendText.exit().remove();
          rightLegendText = rightLegendText.enter().append('text').merge(rightLegendText);
          rightLegendText.attr('class', 'color-legend')
            .text(attrs.colorLegend)
            .attr('y', attrs.legendTextTopMargin)
            .attr('fill', attrs.textDefaultColor)
            .attr('font-size', attrs.legendTextFontSize)
            .attr('x', legendTextWidth + attrs.legendColorRectWidth + attrs.marginBetweenLegendTexts + 20)

          //###########################   Y-AXES   ########################
          // y axis wrapper
          var yAxisWrapper = _var.g.selectAll('.y-axis-wrapper').data(['y-axis-wrapper'])
          yAxisWrapper.exit().remove();
          yAxisWrapper = yAxisWrapper.enter().append('g').merge(yAxisWrapper)
          yAxisWrapper.attr('class', 'y-axis-wrapper');

          //each y axis wrappers
          var eachYAxisWrappers = yAxisWrapper.selectAll('y-axis').data(attrs.data.data.nodes);
          eachYAxisWrappers.exit().remove();
          eachYAxisWrappers = eachYAxisWrappers.enter().append('g').merge(eachYAxisWrappers);
          eachYAxisWrappers.attr('class', 'y-axis')
            .attr('transform', (d, i) => {
              return `translate(${-attrs.xAxisRigthMargin},${(i) * calc.eachCellHeight + calc.eachCellHeight / 2})`
            })

          // y axis texts  
          var yAxisTexts = eachYAxisWrappers.selectAll('text').data(d => [calc.replaceWithProps(attrs.axisDisplayText, d)]);
          yAxisTexts.exit().remove();
          yAxisTexts = yAxisTexts.enter().append('text').merge(yAxisTexts);
          yAxisTexts.text(d => d)
            .attr('text-anchor', 'end')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', attrs.axisTextFontSize)
            .attr('x', -attrs.xAxisTextMargin)
            .attr('fill', attrs.textDefaultColor)

          //axis ticks
          var axisTicksY = eachYAxisWrappers.selectAll('.x-grid').data([1]);
          axisTicksY.exit().remove();
          axisTicksY = axisTicksY.enter().append('rect').merge(axisTicksY);
          axisTicksY.attr('class', 'grid-line x-grid')
            .attr('fill', attrs.gridColor)
            .attr('width', attrs.axisTickLength)
            .attr('height', attrs.axisTickThickness)

          //###########################   X-AXES   ########################
          //x axis wrapper
          var xAxisWrapper = _var.g.selectAll('.x-axis-wrapper').data(['x-axis-wrapper']);
          xAxisWrapper.exit().remove();
          xAxisWrapper = xAxisWrapper.enter().append('g').merge(xAxisWrapper);
          xAxisWrapper.attr('class', 'x-axis-wrapper');

          // each x axis wrappers
          var xAxisWrappers = xAxisWrapper.selectAll('.x-axis').data(attrs.data.data.nodes.reverse());
          xAxisWrappers.exit().remove();
          xAxisWrappers = xAxisWrappers.enter().append('g').merge(xAxisWrappers);
          xAxisWrappers.attr('class', 'x-axis')
            .attr('transform', (d, i) => {
              return `translate(${(i) * calc.eachCellWidth + calc.eachCellWidth / 2},${attrs.yAxisTopMargin + calc.chartHeight})`
            })

          // each x axis text 
          var xAxisTexts = xAxisWrappers.selectAll('text').data(d => [calc.replaceWithProps(attrs.axisDisplayText, d)])
          xAxisTexts.exit().remove()
          xAxisTexts = xAxisTexts.enter().append('text').merge(xAxisTexts);
          xAxisTexts.text(d => d)
            .attr('font-size', attrs.axisTextFontSize)
            .attr('y', attrs.yAxisTextMargin)
            .attr('x', -attrs.yAxisTextMargin)
            .attr('fill', attrs.textDefaultColor)
            .attr('transform', 'rotate(-45)')
            .attr('text-anchor', 'end')

          // axis ticks 
          var xAxisTicks = xAxisWrappers.selectAll('.x-grid').data(['x-axis-ticks'])
          xAxisTicks.exit().remove();
          xAxisTicks = xAxisTicks.enter().append('rect').merge(xAxisTicks);
          xAxisTicks.attr('class', 'grid-line x-grid')
            .attr('fill', attrs.gridColor)
            .attr('height', attrs.axisTickLength)
            .attr('width', attrs.axisTickThickness)

          //##########################  GRIDS  ##################
          // grid wrapper
          var gridWrapper = _var.g.selectAll('.grid-wrapper').data(['grid-wrapper']);
          gridWrapper.exit().remove();
          gridWrapper = gridWrapper.enter().append('g').merge(gridWrapper);
          gridWrapper.attr('class', 'grid-wrapper');

          // x grid lines
          var xGridLines = gridWrapper.selectAll('.grid-line.x-grid')
            .data(attrs.data.data.nodes);
          xGridLines.exit().remove();
          xGridLines = xGridLines.enter().append('rect').merge(xGridLines);
          xGridLines.attr('class', 'grid-line x-grid')
            .attr('stroke', attrs.gridColor)
            .attr('fill', 'none')
            .attr('width', calc.chartWidth)
            .attr('stroke-width', attrs.gridThickness)
            .attr('height', 0.001)
            .attr('y', (d, i) => (i + 1) * calc.eachCellHeight)
            .attr('stroke-dasharray', attrs.gridDashArray)

          //y grid lines 
          var yGridLInes = gridWrapper.selectAll('.grid-line.y-grid')
            .data(attrs.data.data.nodes);
          yGridLInes.exit().remove()
          yGridLInes = yGridLInes.enter().append('rect').merge(yGridLInes);
          yGridLInes.attr('class', 'grid-line y-grid')
            .attr('stroke', attrs.gridColor)
            .attr('fill', 'none')
            .attr('height', calc.chartHeight)
            .attr('width', 0.001)
            .attr('stroke-width', attrs.gridThickness)
            .attr('x', (d, i) => (i + 1) * calc.eachCellWidth)
            .attr('stroke-dasharray', attrs.gridDashArray)

          // ####################  RECTANGLES  #######################
          // all rectangle wrapper
          var tableRectsWrapper = _var.g.selectAll('.table-rects').data(['table-rects'])
          tableRectsWrapper.exit().remove();
          tableRectsWrapper = tableRectsWrapper.enter().append('g').attr('class', 'table-rects').merge(tableRectsWrapper);

          //each cell wrapper
          var rectWrappers = tableRectsWrapper.selectAll('rect-wrapper').data(attrs.data.data.links);
          rectWrappers.exit().remove();
          rectWrappers = rectWrappers.enter().append('g').merge(rectWrappers);
          rectWrappers.attr('cursor', 'pointer')
            .on("mouseenter", function (d) {
              var group = d3.select(this)
              var rect = group.select('rect');
              rectWrappers.transition().attr('opacity', attrs.rectItemHoverOpacity)
              rect.attr('filter', `url(#${_var.shadowId})`)
              group.transition()
                .attr('opacity', 1)

              // Set hovered node
              _var.hovered = d;

              // Mouseenter event
              components.events()
                ._var(_var)
                .action("mouseenter")
                .components(components)
                .node(d)
                .x(calc.eachRectWidth / 2 + Number(rect.attr("x")))
                .y(Number(rect.attr("y")))
                .run();
            })
            .on("mouseleave", function (d) {
              d3.select(this).select('rect').attr('filter', 'none')
              rectWrappers.transition().attr('opacity', 1)

              // Reset hovered node
              _var.hovered = null;

              // mouseleave event
              components.events()
                ._var(_var)
                .action("mouseleave")
                .components(components)
                .run();
            });

          // actual cell rects
          var rects = rectWrappers.selectAll('rect').data(d => [d])
          rects.exit().remove();
          rects = rects.enter().append('rect').merge(rects);
          rects.attr('width', calc.eachRectWidth)
            .attr('height', calc.eachRectHeight)
            .attr('fill', d => { return scales.color(d.value) })
            .attr('x', d => { return (attrs.data.data.nodes.length - calc.itemIndexes[d.targetId]) * calc.eachCellWidth })
            .attr('y', d => (calc.itemIndexes[d.sourceId] - 1) * calc.eachCellHeight)

          // cell rect texts
          var cellTexts = rectWrappers.selectAll('.cell-text').data(d => [d])
          cellTexts.exit().remove();
          cellTexts = cellTexts.enter().append('text').merge(cellTexts);
          cellTexts.text(d => {
            d.SI_PREFIXED_VALUE = formats.SIprefix(d.value);
            var t = _var.data.node;
            var frmt = d3.format('.2s');
            d.FORMATTED = frmt(d.value);
            return t.prefix + calc.replaceWithProps('{{FORMATTED}}', d) + t.sufix;
          })
            .attr('x', d => { return (attrs.data.data.nodes.length - calc.itemIndexes[d.targetId]) * calc.eachCellWidth + calc.eachCellWidth / 2 })
            .attr('y', d => (calc.itemIndexes[d.sourceId] - 1) * calc.eachCellHeight + calc.eachCellHeight / 2)
            .attr('font-size', attrs.rectItemTextFontSize)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', attrs.rectItemTextColor)

          // --------------------  BORDER GRIDS  ---------------------
          //top
          var topGrid = _var.g.selectAll('.top-grid').data(['top-grid'])
          topGrid.exit().remove();
          topGrid = topGrid.enter().append('rect').merge(topGrid);
          topGrid.attr('width', calc.chartWidth)
            .attr('height', 0.01)
            .attr('stroke-width', attrs.borderGridThickness)
            .attr('stroke', attrs.gridColor)

          //bottom    
          var bottomGrid = _var.g.selectAll('.bottom-grid').data(['bottom-grid'])
          bottomGrid.exit().remove();
          bottomGrid = bottomGrid.enter().append('rect').merge(bottomGrid);
          bottomGrid.attr('width', calc.chartWidth + 0.5)
            .attr('y', calc.chartHeight)
            .attr('height', 0.01)
            .attr('stroke-width', attrs.borderGridThickness)
            .attr('stroke', attrs.gridColor)

          //left
          var leftGrid = _var.g.selectAll('.left-grid').data(['left-grid'])
          leftGrid.exit().remove();
          leftGrid = leftGrid.enter().append('rect').merge(leftGrid);
          leftGrid.attr('height', calc.chartHeight)
            .attr('width', 0.01)
            .attr('stroke-width', attrs.borderGridThickness)
            .attr('stroke', attrs.gridColor)

          //right    
          var rightGrid = _var.g.selectAll('.right-grid').data(['right-grid'])
          rightGrid.exit().remove();
          rightGrid = rightGrid.enter().append('rect').merge(rightGrid);
          rightGrid.attr('height', calc.chartHeight)
            .attr('x', calc.chartWidth)
            .attr('width', 0.01)
            .attr('stroke-width', attrs.borderGridThickness)
            .attr('stroke', attrs.gridColor)

          // =======================  ASSIGN NEEDED PROPS   =========================
          break;
      }
    }
    return _var;
  };

  ['_var', 'calc', 'attrs', 'chart', 'centerPoint', 'svg', 'scales', 'handlers', 'formats', 'components'].forEach(function (key) {

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


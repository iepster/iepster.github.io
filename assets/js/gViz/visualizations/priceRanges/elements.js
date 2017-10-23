// Imports
var d3 = require("d3");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var svg = undefined;
  var attrs = undefined;
  var calc = undefined;
  var chart = undefined;
  var centerPoint = undefined;
  var arcs = undefined;
  var layouts = undefined;
  var handlers = undefined;

  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run': {
        if (!attrs) console.log('not valid - attrs');
        if (!calc) console.log('not valid - calc');
        if (!chart) console.log('not valid - chart');
        if (!centerPoint) console.log('not valid - centerPoint');
        if (!arcs) console.log('not valid - arcs');
        if (!layouts) console.log('not valid - layouts');
        if (!handlers) console.log('not valid - handlers');
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

          // Font size variables
          _var.fontSizes = {
            priceRangeCountTextFontSize: attrs.priceRangeCountTextFontSize,
            companyLegendsFontSize: 13,
            legendFontSize: attrs.legendFontSize,
            centerCircleTextFontSize: 30,
            centerTextFontSize: 12,
            categoryTextFontSize: attrs.categoryTextFontSize,
            sameCategoriesGroupFontSize: 16,
            sequenceFontSize: 14
          };

          // Change font size if simension is small
          if (attrs.svgWidth < 400) {
            _var.fontSizes.priceRangeCountTextFontSize = 5;
            _var.fontSizes.companyLegendsFontSize = 5;
            _var.fontSizes.legendFontSize = 5;
            _var.fontSizes.centerCircleTextFontSize = 5;
            _var.fontSizes.centerTextFontSize = 5;
            _var.fontSizes.categoryTextFontSize = 10;
            _var.fontSizes.sameCategoriesGroupFontSize = 10;
            _var.fontSizes.sequenceFontSize = 10;
          }

          //Functions
          attrs.getColorBasedType = function (type) {
            switch (type) {
              case 'Primary': return attrs.pointFill;
              case 'Secondary': return attrs.secondaryPointFill;
            }
          }

          //#######################    BACK         ######################

          var button = chart.selectAll('.back-button-wrapper').data(['back-button-wrapper']);
          button.exit().remove();
          button = button.enter().insert('g', ':first-child').merge(button)

          // Button props
          button.attr('class', 'price-pie—button-back').attr('cursor', 'pointer').attr('transform', `translate(${calc.chartWidth / 2},${calc.chartHeight + attrs.marginBottom / 2})`)
            .on('click', d => { handlers.back() }).attr('display', 'none')

          //Background
          button.patternify({ selector: 'button-background', elementTag: 'rect' }).attr('width', 100).attr('height', 32).attr('rx', 15).attr('fill', 'black').attr('fill', '#C6C6C6')

          // Button text
          button.patternify({ selector: 'button-text', elementTag: 'text' }).attr('x', 14).attr('y', 21).attr('fill', 'white').attr('font-family', 'Diwo-Icons').attr('font-size', function (d) { return 0.7 + 'em' }).text(function (d) { return '\ue90e' })

          // Second button text
          button.patternify({ selector: 'second-button-text', elementTag: 'text' }).text('Back').attr('fill', 'white').attr('x', 37).attr('y', 22);

          //#######################    FILTER BUTTONS         ######################

          // Filtering feature buttons
          var filterBtns = chart.selectAll('.price-pie—button-filter').data(['price-pie—button-filter']);
          filterBtns.exit().remove();
          filterBtns = filterBtns.enter().insert('g', ':first-child').merge(filterBtns);
          filterBtns.attr('class', 'price-pie—button-filter').attr('font-size', _var.fontSizes.companyLegendsFontSize).attr('font-weight', 100).attr('transform', 'translate(-10,10)').attr('display', attrs.hasToggle ? 'initial' : 'none')

          //----  PRICE POINT  ----
          var btnPricePoint = filterBtns.selectAll('.price-point-button').data(['price-point-button']);
          btnPricePoint.exit().remove();
          btnPricePoint = btnPricePoint.enter().insert('g').merge(btnPricePoint);
          btnPricePoint.attr('class', 'price-point-button').attr('cursor', 'pointer').attr('transform', `translate(${calc.chartWidth / 3 - 45},${calc.chartHeight + 20})`)
            .on('click', d => { handlers.pricePointMode() })


          // Price point button
          btnPricePoint.patternify({ selector: 'price-pie—button-price', elementTag: 'rect' }).attr('class', 'price-pie—button price-pie—button-price').attr('width', 110).attr('height', 32).attr('rx', 15).attr('fill', 'black').attr('fill', attrs.activeBtnFill).attr('stroke', 'white').attr('stroke-width', 2)

          //Price point button text
          btnPricePoint.patternify({ selector: 'price-point-button-text', elementTag: 'text' })
            .text('Price Point').attr('fill', 'white').attr('x', 50).attr('y', 22).attr('text-anchor', 'middle')

          //----  PR + CATEGORY  ----
          //Shortcut
          var btnCategory = filterBtns.selectAll('.pr-category-button').data(['pr-category-button']);
          btnCategory.exit().remove();
          btnCategory = btnCategory.enter().insert('g').merge(btnCategory);
          btnCategory.attr('class', 'pr-category-button').attr('cursor', 'pointer').attr('transform', `translate(${calc.chartWidth / 2 - 50},${calc.chartHeight + 20})`)
            .on('click', d => { handlers.categoryMode() })

          // Category button background
          btnCategory.patternify({ selector: 'price-pie—button-category', elementTag: 'rect' }).attr('class', 'price-pie—button price-pie—button-category').attr('width', 120).attr('height', 32).attr('fill', attrs.passiveBtnFill).attr('stroke', 'white').attr('stroke-width', 2)

          // Category button text
          btnCategory.patternify({ selector: 'pr-category-button-text', elementTag: 'text' }).text('PR + Category').attr('fill', 'white').attr('x', 60).attr('y', 22).attr('text-anchor', 'middle')

          //----  PR + COLLECTION  ----
          var btnCollection = filterBtns.selectAll('.pr-collections-button').data(['pr-collections-button']);
          btnCollection.exit().remove();
          btnCollection = btnCollection.enter().insert('g', ':first-child').merge(btnCollection);
          btnCollection.attr('class', 'pr-collections-button').attr('cursor', 'pointer').attr('transform', `translate(${calc.chartWidth / 4 * 3 - 95},${calc.chartHeight + 20})`)
            .on('click', d => { handlers.collectionMode() })

          //Collection button background
          btnCollection.patternify({ selector: 'price-pie—button-collection', elementTag: 'rect' }).attr('class', 'price-pie—button price-pie—button-collection').attr('width', 140).attr('height', 32).attr('rx', 15).attr('fill', 'black').attr('fill', attrs.passiveBtnFill).attr('stroke', 'white').attr('stroke-width', 2)

          //Collection button text
          btnCollection.patternify({ selector: 'collection-button-text', elementTag: 'text' }).text('PR + Collection').attr('fill', 'white').attr('x', 70).attr('y', 22).attr('text-anchor', 'middle')

          //#######################      PIE WRAPPERS     ######################

          // Zoomed categories paths
          centerPoint.patternify({ selector: 'zoomed-categories-path', elementTag: 'path', data: layouts.pie(attrs.data.categories) }).attr('pointer-events', 'none').attr('class', d => 'zoomed-category zoomed-category-' + d.data.id).attr('d', arcs.defaultCategory).attr('fill', 'white').attr('filter', `url(${attrs.urlLocation}#${calc.dropShadowUrl})`).attr('opacity', 0)

          //Price range wrappers
          var priceRangeWrappers = centerPoint.patternify({ selector: 'price-range-wrapper', elementTag: 'g', data: calc.multiDonutData })

          // Category wrappers
          var categoryWrappers = priceRangeWrappers.patternify({ selector: 'category-wrapper', elementTag: 'g', data: d => layouts.pie(d) })
          categoryWrappers
            .on('mouseenter.breadcrumb', d => handlers.breadcrumbShow(d))
            .on('mouseleave.breadcrumb', d => handlers.breadcrumbHide(d))
            .on('mouseenter.sectorHighlight', d => handlers.hightlightSector(d, true))
            .on('mouseleave.sectorHighlight', d => handlers.hightlightSector(d, false))
            .on('mouseenter.priceRangeHighlight', function (d) { handlers.priceRangeHighlight(d, d3.select(this), true) })
            .on('mouseleave.priceRangeHighlight', function (d) { handlers.priceRangeHighlight(d, d3.select(this), false) })
            .on('click', function (d) { console.log('click', d); handlers.drillToDepth(d, d3.select(this)) })
            .attr('class', d => { return 'category-wrapper category-wrapper-' + d.data.category.id })

          //#######################      PIE PATHS     ######################

          //Pie paths
          categoryWrappers.selectAll('.category-pie-paths').remove(); //shortcut

          var piePaths = categoryWrappers.patternify({ selector: 'category-pie-paths', elementTag: 'path', data: d => [d] })
            .attr('fill', d => { return d.data.priceRangeColor })
            .attr('d', d => d.data.arc({ startAngle: 0, endAngle: 0.1 }))
            .attr('stroke', attrs.stroke).attr('stroke-width', attrs.strokeWidth)
            .each(function (d) { this._current = d; })

          // Transition paths smoothly
          piePaths.transition().attrTween('d', arcTween)

          function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
              return a.data.arc(i(t));
            };
          }

          //#######################      POINTS          ######################

          _var.utils.getPositionBasedOnArc = function getPositionBasedOnArc(d, p, arcName, isFullCircle) {

            //Construct new arc for each point
            var arc = d3.arc();

            //Find height for each point based on range;
            var minPrice = d.data.priceRange.min;
            var maxPrice = d.data.priceRange.max;
            var innerRadius = d.data[arcName].innerRadius()() + 4;
            var outerRadius = d.data[arcName].outerRadius()() - 4;
            var priceScale = d3.scaleLinear().domain([minPrice, maxPrice]).range([innerRadius, outerRadius]);
            var buffer = Math.PI / 30;
            var angleScale = d3.scaleLinear().domain([0, 1]).range([d.startAngle + buffer, d.endAngle - buffer])
            if (isFullCircle) {
              angleScale.range([0, Math.PI * 2]);
            }
            var productRadius = priceScale(p.price);
            var productAngle = angleScale(p.angle);
            var arc = d3.arc()
            var arcObj = {
              innerRadius: productRadius,
              outerRadius: productRadius,
              startAngle: productAngle,
              endAngle: productAngle
            }
            var pointPos = d3.arc(arcObj).centroid(arcObj);
            return pointPos;
          }

          // Loop over category wrappers
          categoryWrappers.each(function (d) {
            var g = d3.select(this);
            var arrData = [];
            d.data.products.forEach(p => {
              var pointPos = _var.utils.getPositionBasedOnArc(d, p, 'arc');
              var zoomPointPos = _var.utils.getPositionBasedOnArc(d, p, 'zoomArc');
              var categoryPointPos = _var.utils.getPositionBasedOnArc(d, p, 'arc', true);

              var data = {
                zoomPointPos: zoomPointPos,
                pointPos: pointPos,
                categoryPointPos: categoryPointPos,
                product: p,
                data: d.data
              }

              arrData.push(data);
              // g.selectAll('product-point').remove();//shortcut
            });

            console.log(arrData);
            var points = g.patternify({ selector: 'product-point', elementTag: 'circle', data: arrData }).attr('r', attrs.pointRadius).attr('cx', k => k.pointPos[0]).attr('cy', k => k.pointPos[1]).attr('data-id', k => k.product.id).attr('fill', k => { return attrs.getColorBasedType(k.product.type); })
              .on('mouseenter.tooltip', k => { handlers.pointTooltip(k, true) })
              .on('mouseleave.tooltip', k => { handlers.pointTooltip(k, false) })

          })

          // Price range wrapper lines
          var priceRangeWrapperLines = centerPoint.patternify({ selector: 'price-range-wrapper-lines', elementTag: 'path', data: attrs.data.priceRanges }).attr('d', d => d.pieArc({ startAngle: 0, endAngle: Math.PI * 2 })).attr('fill', 'none').attr('stroke', attrs.stroke).attr('stroke-width', attrs.strokeWidth).attr('pointer-events', 'none')

          //#######################      PRICE RANGE PRODUCT COUNTS PER CATEGORY     ######################
          var priceRangeCatCounts = categoryWrappers.patternify({ selector: 'price-range-category-counts', elementTag: 'text', data: d => d }).attr('class', d => 'price-range-category-counts').text(d => d.data.products.length).attr('x', d => d.data.arc.centroid(d)[0]).attr('y', d => d.data.arc.centroid(d)[1]).attr('fill', attrs.defaultTextFill).attr('text-anchor', 'middle').attr('dominant-baseline', 'central').attr('font-size', _var.fontSizes.priceRangeCountTextFontSize).attr('opacity', 0).attr('pointer-events', 'none')

          //#######################      COMPANY LEGENDS #############

          var companyLegendsWrapper = chart.selectAll('company-legends-wrapper').data(['company-legends-wrapper']);
          companyLegendsWrapper.exit().remove()
          companyLegendsWrapper = companyLegendsWrapper.enter().insert('g', ':first-child').merge(companyLegendsWrapper);
          companyLegendsWrapper.attr('class', 'company-legends-wrapper').attr('transform', `translate(${-attrs.marginLeft + 20}) scale(${1 / attrs.scale})`);

          var companyLegends = companyLegendsWrapper.patternify({ selector: 'company-legends', elementTag: 'g', data: attrs.data.companies }).attr('font-size', _var.fontSizes.companyLegendsFontSize)

          // Company legend points
          companyLegends.patternify({ selector: 'company-legend-points', elementTag: 'circle', data: d => [d] }).attr('r', 7).attr('fill', d => { return attrs.getColorBasedType(d.type); })

          // Legend text
          companyLegends.patternify({ selector: 'company-legends-texts', elementTag: 'text', data: d => [d] }).text(d => d.name).attr('x', 15).attr('y', 7);

          // Rearange legend texts based their dimensions
          var startX = 0;
          companyLegends.each(function (d, i, arr) {
            var wrapper = d3.select(this);
            var text = wrapper.select('text');
            var bbox = text.node().getBBox();
            wrapper.attr('transform', 'translate(' + startX + ',-30)');
            startX += bbox.width + 35;
          })

          //#######################      PRICE RANGE LEGENDS          ######################

          // Legends
          var legendWrapper = centerPoint.patternify({ selector: 'legend-wrapper', elementTag: 'g' }).attr('pointer-events', 'none').attr('transform', 'translate(' + (-calc.halfWidth) + ',' + (-calc.halfWidth) + ')')

          // Legend items
          var legendItems = legendWrapper.patternify({ selector: 'legend-item', elementTag: 'G', data: attrs.data.priceRanges.slice().reverse() }).attr('transform', function (d, i) { return 'translate(0,' + (((i + 0.5) * calc.eachDonutRadius) + (1 - attrs.circleDecreaseLevel) * calc.halfWidth) + ')' })

          //Legend rects
          legendItems.patternify({ selector: 'legend-rects', elementTag: 'rect', data: d => [d] }).attr('width', calc.halfWidth).attr('height', 0.3).attr('fill', 'none').attr('stroke', attrs.legendLineFill).attr('stroke-width', 1).attr('stroke-dasharray', '1,2')

          //Legend texts
          legendItems.patternify({ selector: 'legend-texts', elementTag: 'text', data: d => [d] }).text(d => d.title).attr('x', attrs.legendTextPosY).attr('text-anchor', 'middle').attr('fill', attrs.legendTextFill).attr('font-weight', 100).attr('font-size', _var.fontSizes.legendFontSize).attr('y', 4)

          legendItems.patternify({ selector: 'legend-item-circles', elementTag: 'circle', data: d => [d] }).attr('fill', attrs.legendLineFill).attr('cx', calc.halfWidth).attr('r', 2)

          legendItems.patternify({ selector: 'legend-item-line', elementTag: 'rect', data: d => [d] }).attr('width', 0.6).attr('height', 14).attr('fill', attrs.legendLineFill).attr('y', -7).attr('x', -2)

          //#######################     CATEGORY WRAPPER TEXTS          ######################
          var categoryTextWrappers = centerPoint.patternify({ selector: 'category-text-wrapper ', elementTag: 'g', data: layouts.pie(attrs.data.categories) }).attr('pointer-events', 'none').attr('class', d => 'category-text-wrapper category-text-wrapper-' + d.data.id).each(d => { var centroid = arcs.defaultCategory.centroid(d); d.centroid = centroid; })

          //Category wrapper texts
          categoryTextWrappers.patternify({ selector: 'category-wrapper-texts', elementTag: 'text', data: d => [d] }).text(d => d.data.products.length).attr('class', 'font-highlight category-wrapper-texts').attr('text-anchor', 'middle').attr('font-weight', 800).attr('dominant-baseline', 'central').attr('fill', attrs.defaultTextFill).attr('font-size', _var.fontSizes.categoryTextFontSize).attr('x', d => d.centroid[0]).attr('y', d => d.centroid[1])

          // Category titles
          categoryTextWrappers.patternify({ selector: 'category-title', elementTag: 'text', data: d => [d] }).text(d => d.data.title).attr('x', d => d.centroid[0]).attr('y', d => d.centroid[1] + 26).attr('text-anchor', 'middle').attr('font-weight', 400).attr('fill', attrs.defaultTextFill).attr('dominant-baseline', 'central').attr('font-size', _var.fontSizes.companyLegendsFontSize).attr('letter-spacing', '-0.02em')

          //#######################    CENTER CIRCLE TEXTS         ######################
          centerPoint.patternify({ selector: 'center-text-number', elementTag: 'text' }).attr('class', 'center-text-number font-highlight').attr('font-size', _var.fontSizes.centerCircleTextFontSize).attr('y', 5).attr('font-weight', 'bold').attr('text-anchor', 'middle').text(attrs.data.products.length).attr('fill', attrs.defaultTextFill)

          //Center texts
          centerPoint.patternify({ selector: 'center-point-text', elementTag: 'text' }).attr('y', 20).attr('font-size', _var.fontSizes.centerTextFontSize).attr('text-anchor', 'middle').text(attrs.centerText).attr('fill', attrs.defaultTextFill)

          // FIXED REDESIGNED TOOLTIP 
          var width = attrs.tooltipWidth;
          var height = 159 / 6;
          var fixedTooltip = svg.patternify({ selector: 'fixed-tooltip-wrapper', elementTag: 'g' }).attr('transform', `translate(0)`).attr('display', 'none').attr('pointer-events', 'none')

          //TOP
          fixedTooltip.patternify({ selector: 'top-content', elementTag: 'rect' }).attr('class', 'top-content hover-fill hover-stroke').attr('width', width).attr('height', height).attr('fill', 'white').attr('stroke-width', 1)

          //MIDDLE
          fixedTooltip.patternify({ selector: 'middle-content ', elementTag: 'rect' }).attr('class', 'middle-content hover-stroke').attr('width', width).attr('height', height).attr('stroke', attrs.tooltipFill).attr('fill', 'none').attr('stroke-width', 1).attr('transform', 'translate(0,26)')

          //TOP
          fixedTooltip.patternify({ selector: 'title', elementTag: 'text' }).attr('fill', 'white').attr('y', 20).attr('x', 10).text('VSX Player')

          //MIDDLE
          fixedTooltip.patternify({ selector: 'difference', elementTag: 'text' }).attr('class', 'difference hover-fill').attr('fill', 'black').attr('y', height + 20).attr('x', 10).text(attrs.bottomTooltipText)

          // Tooltip text
          fixedTooltip.patternify({ selector: 'value', elementTag: 'text' }).attr('class', 'value hover-fill font-highlight').attr('fill', 'black').attr('y', height + 20).attr('font-weight', 'bold').attr('x', width - 30).attr('text-anchor', 'end').text('20%')

          // Fixed tooltip background
          fixedTooltip.patternify({ selector: 'fixed-tooltip-background-rect', elementTag: 'rect' }).attr('class', 'hover-stroke fixed-tooltip-background-rect').attr("x", 315).attr("y", 60).attr("width", 82).attr("height", 82).attr('fill', 'white').attr('stroke', 'black')

          //Fixed tooltip image
          fixedTooltip.patternify({ selector: 'image', elementTag: 'image' }).attr('class', 'image').attr("xlink:href", "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg").attr("x", 315).attr("y", 60).attr("width", 82).attr("height", 82);

          //#######################    TOOLTIP         ######################

          var width = attrs.tooltipWidth;
          var height = width / 3;
          var tooltip = svg.patternify({ selector: 'tooltip-wrapper', elementTag: 'g' }).attr('display', 'none')

          tooltip.patternify({ selector: 'bottom-content', elementTag: 'path' }).attr('transform', 'translate(0,25)').attr('fill', attrs.tooltipFill).attr('stroke', attrs.tooltipFill).attr('stroke-width', 1).attr('d', `M 0 0 L ${width} 0 L ${width} ${width * 3 / 8} L ${width * 5 / 8}  ${width * 3 / 8}  L  ${width / 2}  ${width / 2}  L ${width * 3 / 8}   ${width * 3 / 8}  L 0  ${width * 3 / 8}  L 0 0 `)

          // Tooltip top content
          tooltip.patternify({ selector: 'top-content', elementTag: 'rect' }).attr('width', width).attr('height', height).attr('fill', 'white').attr('stroke', 'black').attr('stroke-width', 1)

          //Tooltip title
          tooltip.patternify({ selector: 'title', elementTag: 'text' }).attr('fill', attrs.defaultTextFill).attr('y', 20).attr('x', width * 0.35).text('VSX Player')

          // Tooltip properties
          tooltip.patternify({ selector: 'property', elementTag: 'text' }).attr('y', 40).attr('x', width * 0.35).attr('font-weight', 'bold').attr('fill', attrs.defaultTextFill).text('Red')

          //Tooltip contribution text
          tooltip.patternify({ selector: 'contribution', elementTag: 'text' }).attr('class', 'contribution').attr('fill', 'white').attr('y', height + 20).attr('x', 10).text('Contribution')

          // Tooltip value text
          tooltip.patternify({ selector: 'value', elementTag: 'text' }).attr('class', 'value').attr('fill', 'white').attr('y', height + 20).attr('font-weight', 'bold').attr('x', width * 0.75).text('20%')

          //Tooltip image
          tooltip.patternify({ selector: 'image', elementTag: 'image' }).attr('class', 'image').attr("xlink:href", "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg").attr("x", "5").attr("y", "-5").attr("width", 45).attr("height", 65);

          // =======================  ASSIGN NEEDED PROPS   =========================
          _var.tooltip = tooltip;
          _var.fixedTooltip = fixedTooltip;
          break;
      }
    }
    return _var;
  };

  // dinamic function assigning
  ['_var', 'calc', 'attrs', 'chart', 'centerPoint', 'arcs', 'layouts', 'handlers', 'svg'].forEach(function (key) {

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

  // run func declaration
  main.run = _ => main('run');
  return main;
};

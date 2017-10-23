// Imports
var d3 = require("d3");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes categoryValuesObj
  var _var = undefined;
  var handlers = undefined;
  var attrs = undefined;
  var chart = undefined;
  var breadcrumbTrail = undefined;
  var arcs = undefined;
  var calc = undefined;
  var tooltip = undefined;
  var fixedTooltip = fixedTooltip;
  var hoverTransitionTime = 100;

  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run': {
        if (!handlers) console.log('err - handlers');
        if (!attrs) console.log('err - attrs');
        if (!chart) console.log('err - chart');
        if (!arcs) console.log('err - arcs');
        if (!attrs) console.log('err - attrs');
        if (!calc) console.log('err - calc');
        if (!tooltip) console.log('err - tooltip');
        if (!fixedTooltip) console.log('err - fixedTooltip');
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
          if (attrs.mode != 'CATEGORY') {
            showCategoryText(false);
            showCategoryLines(false);
            showPriceRangeWrapperLines(true);
          } else {
            showPriceRangeWrapperLines(false);
          }

          //Functions
          function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
              return a.data.arc(i(t));
            };
          }

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

          function showCategoryText(flag) {
            var opac = flag ? 1 : 0;
            _var.centerPoint.selectAll('.category-text-wrapper').selectAll('text').attr('opacity', opac)
          }

          function showHoverShadowPaths(flag) {
            var display = flag ? 'initial' : 'none';

            // Make same hover category shadow appear
            _var.centerPoint.selectAll('.zoomed-category').attr('d', arcs.defaultCategogy).attr('display', display)
          }

          function showLegends(flag) {
            var opac = flag ? 1 : 0;
            _var.centerPoint.selectAll('.legend-wrapper').attr('opacity', opac)
          }

          function showCountTexts(flag) {
            var opac = flag ? 1 : 0;
            _var.centerPoint.selectAll('.price-range-category-counts').attr('opacity', opac)
          }

          function showCategoryPaths(flag) {
            _var.centerPoint.selectAll('.category-pie-paths').attr('display', d => flag ? 'initial' : 'none')
          }

          function showCategoryLines(flag) {
            _var.centerPoint.selectAll('.category-pie-paths').attr('stroke', d => flag ? attrs.stroke : d.data.priceRangeColor)
          }

          function showPoints(flag) {
            var display = flag ? 'initial' : 'none';
            _var.centerPoint.selectAll('.product-point').attr('display', display)
          }

          function showFilterBtns(flag) {
            var display = flag ? 'initial' : 'none';
            chart.selectAll('.price-pie—button-filter').attr('display', display)
          }

          function showBackBtn(flag) {
            var display = flag ? 'initial' : 'none';
            chart.selectAll('.price-pie—button-back').attr('display', display)
          }

          function showPriceRangeWrapperLines(flag) {
            var display = flag ? 'initial' : 'none';
            _var.centerPoint.selectAll('.price-range-wrapper-lines').attr('display', display)
          }

          function colorizeFixedTooltip(newColor) {
            fixedTooltip.selectAll('.hover-fill').attr('fill', newColor);
            fixedTooltip.selectAll('.hover-stroke').attr('stroke', newColor);
          }

          function backToCategory() {

            attrs.currentCategory.selectAll('path')
              .attr('stroke', attrs.stroke)
              .attr('stroke-width', attrs.strokeWidth)


            _var.centerPoint.selectAll('.category-pie-paths').attr('opacity', 1);
            _var.centerPoint.selectAll('.product-point').attr('opacity', 1);
            attrs.currentDetail.select('path')
              .transition()
              .attr('d', d => d.data.arc({ startAngle: 0, endAngle: Math.PI * 2 }))

            showLegends(true);
          }

          function backToFull() {
            showCategoryText(true);
            showHoverShadowPaths(true);
            showLegends(true);
            showCountTexts(false)
            showCategoryPaths(true)
            showPoints(true);
            showBackBtn(false);
            if (attrs.hasToggle) {
              showFilterBtns(true);
            }
            var sameCatRange;
            attrs.currentCategory.selectAll('path').each((d, i) => { sameCatRange = d; d.startAngle = 2 * Math.PI * d.value * (d.index) / 360; d.endAngle = d.startAngle + 2 * Math.PI / attrs.data.categories.length }).transition().duration(500).ease(d3.easeLinear).attrTween("d", arcTween).on('end', d => { highlightCategoryFor(sameCatRange, false, true) })

            attrs.currentCategory.selectAll('.product-point').attr('display', 'initial').transition().duration(1000).attr('cx', d => d.pointPos[0]).attr('cy', d => d.pointPos[1])
          }

          function drillToDetail(d, clickedItem) {

            showLegends(false);
            showCountTexts(false);

            attrs.currentDetail = clickedItem;

            //Update center text
            _var.centerPoint.select('.center-text-number').text(d.data.products.length)
            clickedItem.select('path').transition().attr('stroke', attrs.stroke).attr('filter', 'none').attr('d', arcs.detail({ startAngle: 0, endAngle: Math.PI * 2 }))
            _var.centerPoint.selectAll('.category-pie-paths').filter(di => di.data.priceRange.id != d.data.priceRange.id).attr('opacity', 0);
            _var.centerPoint.selectAll('.product-point').filter(di => di.product.priceRangeID != d.data.priceRange.id).attr('opacity', 0);

          }

          function drillToCategory(d) {
            showCategoryText(false);
            showHoverShadowPaths(false);
            showLegends(true);
            showCountTexts(false)
            showCategoryPaths(false)
            showPoints(false);
            var sameCategoriesGroup = _var.centerPoint.selectAll('.category-wrapper-' + d.data.category.id);
            sameCategoriesGroup.selectAll('path').attr('stroke', attrs.stroke).transition().duration(500).ease(d3.easeLinear).attr('display', 'initial').each(d => { d.startAngle = 0; d.endAngle = 2 * Math.PI; }).attrTween("d", arcTween);
            sameCategoriesGroup.selectAll('.product-point').attr('display', 'initial').transition().duration(1000).attr('cx', d => d.categoryPointPos[0]).attr('cy', d => d.categoryPointPos[1])
            sameCategoriesGroup.select('.price-range-category-counts').attr('x', d => d.data.arc.centroid(d)[0] + 10).attr('y', d => d.data.arc.centroid({ startAngle: 0, endAngle: 0 })[1]).attr('opacity', 1)
            attrs.currentCategory = sameCategoriesGroup;
          }

          function highlightCategoryFor(d, flag, shouldTransition) {
            // _var.log('highlightCategoryFor')
            // _var.log(d);

            var categoryValuesObj = {
              'arc': 'arc',
              'categoryOpacity': '1',
              'countTextsOpacity': '0',
              'activeCategoryOpacity': 1,
              'pointPosType': 'pointPos',
              'activeSectorColor': 'priceRangeColor',
              'productsCount': attrs.data.products.length,
              'fillOpacity': 1,
              'activeHoverShadowOpacity': 0,
              'hoveredCategoryArc': arcs.defaultCategory,
              'legendOpacity': 1,
            }
            var active = {
              'legendOpacity': 0,
              'arc': 'zoomArc',
              'categoryOpacity': '0.4',
              'countTextsOpacity': '1',
              'activeCategoryOpacity': 0,
              'pointPosType': 'zoomPointPos',
              'activeSectorColor': 'categoryColor',
              'productsCount': d.data.category.products.length,
              'fillOpacity': 0,
              'activeHoverShadowOpacity': 1,
              'hoveredCategoryArc': arcs.zoomedCategory
            }
            if (flag) categoryValuesObj = active;

            //Update center text
            _var.centerPoint.select('.center-text-number').text(categoryValuesObj.productsCount)

            // Make other categories transparent
            _var.centerPoint.selectAll('.category-text-wrapper').selectAll('text').attr('opacity', categoryValuesObj.categoryOpacity)

            _var.centerPoint.selectAll('.product-point').attr('opacity', categoryValuesObj.categoryOpacity)

            _var.centerPoint.selectAll('.product-point').attr('opacity', categoryValuesObj.categoryOpacity)

            var paths = _var.centerPoint.selectAll('.category-pie-paths');

            if (shouldTransition) {
              paths = paths.transition();
            }

            paths.attr('fill', d => flag ? 'white' : d.data.priceRangeColor).attr('fill-opacity', categoryValuesObj.fillOpacity)

            // Get same category paths
            var categoryId = d.data.category.id;

            var sameCategoriesGroup = _var.centerPoint.selectAll('.category-wrapper-' + categoryId)

            var sameHoverCategoryWrapper = _var.centerPoint.selectAll('.zoomed-category-' + categoryId)

            // Make same hover category shadow appear
            sameHoverCategoryWrapper.transition().duration(hoverTransitionTime).ease(d3.easeCubic).attr('d', categoryValuesObj.hoveredCategoryArc).attr('opacity', categoryValuesObj.activeHoverShadowOpacity)

            // Apply new arc for zoom
            sameCategoriesGroup.select('path').transition().duration(hoverTransitionTime).ease(d3.easeCubic).attr('d', d => { return d.data[categoryValuesObj.arc](d); })

            sameCategoriesGroup.selectAll('.category-pie-paths').attr('fill', d => d.data[categoryValuesObj.activeSectorColor]).attr('fill-opacity', 1)

            // Show hidden point counts text
            sameCategoriesGroup.selectAll('.price-range-category-counts').attr('opacity', categoryValuesObj.countTextsOpacity).attr('font-size', _var.fontSizes.sameCategoriesGroupFontSize).transition().duration(hoverTransitionTime).ease(d3.easeCubic).attr('x', d => d.data[categoryValuesObj.arc].centroid(d)[0]).attr('y', d => d.data[categoryValuesObj.arc].centroid(d)[1])


            sameCategoriesGroup.selectAll('.product-point').attr('opacity', 1).transition().duration(hoverTransitionTime).ease(d3.easeCubic).attr('cx', d => { return d[categoryValuesObj.pointPosType][0] }).attr('cy', d => { return d[categoryValuesObj.pointPosType][1] })

            // Hide text
            _var.centerPoint.selectAll('.category-text-wrapper-' + d.data.category.id).selectAll('text').attr('opacity', categoryValuesObj.activeCategoryOpacity)

            // Legends
            _var.centerPoint.selectAll('.legend-wrapper').attr('opacity', categoryValuesObj.legendOpacity);

          }

          // #################################  POINT TOOLTIP   ##############################

          handlers.pointTooltip = function (d, flag) {
            _var.log('pointTooltip' + " " + flag.toString())
            _var.log(d);
            // if (attrs.state == 'FULL') return;
            if (attrs.svgWidth < 500) return;
            var props = {
              display: 'none',
              linkedPointRadius: attrs.pointRadius,
              hoveredPointRadius: attrs.pointRadius,
            }

            var active = {
              display: 'initial',
              linkedPointRadius: attrs.highlightedPointRadius,
              hoveredPointRadius: attrs.highlightedPointRadius,
            }
            if (flag) {
              attrs.pointHovering = true;
              props = active;
              if (attrs.centerText.trim()) {
                var item = { generatedId: 3, color: '#9D99A0', name: attrs.centerText }
              }
              handlers.breadcrumbShow(d, item)
            } else {
              attrs.pointHovering = false;
              handlers.breadcrumbHide(d)
            }
            var coords = d3.mouse(chart.node());
            fixedTooltip.select('.title').text(d.product.title);
            fixedTooltip.select('.property').text(d.product.property);
            fixedTooltip.select('.value').text(d.product.contribution + ' %');
            fixedTooltip.select('.difference-value').text(d.product.difference);
            fixedTooltip.select('.image').attr('xlink:href', d.product.imageUrl);
            fixedTooltip.select('.difference').text(replaceWithProps(attrs.bottomTooltipText, d.product))
            var width = 400;
            fixedTooltip.select('.top-content').attr('width', width)
            fixedTooltip.select('.middle-content').attr('width', width)
            fixedTooltip.select('.value').attr('x', width - 30)
            width = fixedTooltip.node().getBoundingClientRect().width + 100;
            width = width > 400 ? width : 400;
            fixedTooltip.select('.top-content').attr('width', width)
            fixedTooltip.select('.middle-content').attr('width', width)
            fixedTooltip.select('.value').attr('x', width - 30)
            fixedTooltip.attr('display', props.display)
              .attr('transform', `translate(${calc.chartWidth - 80 - (width - 300)},${53})`) //;
            showBackBtn(!flag);
            if (attrs.state == 'FULL') showBackBtn(false);

            //MIDDLE
            var middleRect = fixedTooltip.selectAll('.middle-rect').data(['middle-rect']);
            middleRect.exit().remove();
            middleRect = middleRect.enter().append('rect').merge(middleRect)
            middleRect.attr('class', 'middle-rect');

            colorizeFixedTooltip(attrs.getColorBasedType(d.product.type));
            _var.centerPoint.selectAll('.product-point').each(function (d) { if (attrs.pointHovering) d.oldOpacity = d3.select(this).attr('opacity') }).attr('opacity', d => { if (attrs.pointHovering) { return 0.4; } else { return d.oldOpacity; } });
            _var.centerPoint.selectAll(`[data-id='${d.product.linkedPointID}']`).attr('r', props.linkedPointRadius).attr('opacity', 1);
            _var.centerPoint.selectAll(`[data-id='${d.product.id}']`).attr('r', props.hoveredPointRadius).attr('opacity', 1);

          }
          // #################################   HANDLER MODES   ##############################
          handlers.categoryMode = function () {
            attrs.mode = 'CATEGORY';
            chart.selectAll('.price-pie—button-filter .price-pie—button').attr('fill', attrs.passiveBtnFill)
            chart.select('.price-pie—button-category').attr('fill', attrs.activeBtnFill)
            showCategoryText(true);
            showCategoryLines(true);
            showPriceRangeWrapperLines(false);
          }
          handlers.pricePointMode = function () {
            attrs.mode = 'PRICE_POINT';
            chart.selectAll('.price-pie—button-filter .price-pie—button').attr('fill', attrs.passiveBtnFill)
            chart.select('.price-pie—button-price').attr('fill', attrs.activeBtnFill)
            showCategoryText(false);
            showCategoryLines(false);
            showPriceRangeWrapperLines(true);
          }
          handlers.collectionMode = function () {
            attrs.mode = 'COLLECTION';
            chart.selectAll('.price-pie—button-filter .price-pie—button').attr('fill', attrs.passiveBtnFill)
            chart.centerPoint.select('.price-pie—button-collection').attr('fill', attrs.activeBtnFill)
            showCategoryText(false);
            showCategoryLines(false);
            showPriceRangeWrapperLines(true);
          }
          // #################################   DRILL TO CATEGORY   ##############################

          handlers.back = function () {
            _var.log('back')
            switch (attrs.state) {
              case 'CATEGORY': { attrs.state = 'FULL'; backToFull(); break; }
              case 'DETAIL': { attrs.state = 'CATEGORY'; backToCategory(); break; }
            };
            handlers.breadcrumbHide();
          }

          // #################################   DRILL TO CATEGORY   ##############################
          handlers.drillToDepth = function (d, clickedItem) {
            if (attrs.mode != 'CATEGORY') return;
            showFilterBtns(false);
            showBackBtn(true);
            switch (attrs.state) {
              case 'FULL': {
                drillToCategory(d); attrs.state = 'CATEGORY'; break;
              }
              case 'CATEGORY': {
                drillToDetail(d, clickedItem); attrs.state = 'DETAIL'; break;
              }
            };
          }

          // #################################  PRICE RANGE HOVER   ##############################
          handlers.priceRangeHighlight = function (d, hoveredSector, flag) {
            if (attrs.state != 'CATEGORY') return;
            var props = {
              dropShadow: 'none',
              stroke: attrs.stroke,
              strokeWidth: attrs.strokeWidth
            };
            var active = {
              dropShadow: `url(${attrs.urlLocation}#${calc.dropShadowUrl})`,
              stroke: 'black',
              strokeWidth: 2
            };
            if (flag) { props = active; }
            _var.centerPoint.selectAll(".price-range-wrapper")
              .sort(function (a, b) { // select the parent and sort the path's
                var el = a[d.index];
                if (!(el.category.id == d.data.category.id && el.priceRange.id == d.data.priceRange.id)) return -1;               // a is not the hovered element, send "a" to the back
                else return 1;                             // a is the hovered element, bring "a" to the front
              });
            hoveredSector.select('.category-pie-paths')
              .attr('filter', props.dropShadow)
              .attr('stroke', props.stroke)
              .attr('stroke-width', props.strokeWidth)
          }

          // #################################   BREADCRUMB SHOW   ##############################

          handlers.hightlightSector = function (d, flag) {
            if (attrs.state != 'FULL' || attrs.mode != 'CATEGORY') return;
            if (flag) {
              highlightCategoryFor(d, true);
              attrs.lastHoveredCategoryId = d.data.category.id;
              attrs.lastHoveredItem = d;
              attrs.lastHoveredCategoryTime = Date.now();
            } else {
              //if last hovered time is more than 300 ms, go back
              highlightCategoryFor(d, false)
            }
          }

          // #################################   BREADCRUMB SHOW   ##############################
          handlers.breadcrumbShow = function breadcrumbShow(d, item) {
            var b = attrs.breadCrumbDimensions;
            var sequenceArray = [
              {
                generatedId: 1 + d.data.category.title,
                name: d.data.category.title,
                color: '#9D99A0'
              }, {
                generatedId: 2 + ` $ ${d.data.priceRange.min} - $ ${d.data.priceRange.max}`,
                name: ` $ ${d.data.priceRange.min} - $ ${d.data.priceRange.max}`,
                color: '#BAB6BC'
              }];
            if (item) {
              sequenceArray.push(item);
            }
            var backButtonWidth = 0;
            // if (attrs.state == states.DETAIL_VIEW) {
            //     backButtonWidth = calc.backRectWidth;
            // }
            var g = breadcrumbTrail.selectAll('g')
              .data(sequenceArray, d => d.generatedId)
            g.exit().remove();
            var entering = g.enter().append('svg:g')
            entering.append("svg:polygon").style('fill', d => d.color)

            entering.append('svg:text').attr("x", 20).attr("y", b.h / 2).attr("dy", "0.4em").attr("text-anchor", "start").attr('fill', 'white').attr('font-size', _var.fontSizes.sequenceFontSize).attr('font-weight', 100).text(function (d) { return d.name; });

            var all = entering.merge(g)
              // .style('opacity', d => 1 / d.depth)
              .attr('class', 'breadcrumbs')
              .attr('transform', function (d, i) {
                return 'translate(' + ((i) * (b.w + b.s) + backButtonWidth) + ',0)'
              });

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
            breadcrumbTrail.selectAll('.breadcrumbs').attr('visibility', 'hidden');
            switch (attrs.state) {
              case 'FULL': breadcrumbTrail.selectAll('.breadcrumbs').attr('visibility', 'hidden'); break;
              case 'CATEGORY': breadcrumbTrail.selectAll('.breadcrumbs').attr('visibility', (d, i) => i > 0 ? 'hidden' : 'auto'); break;
              case 'DETAIL': breadcrumbTrail.selectAll('.breadcrumbs').attr('visibility', (d, i) => i > 1 ? 'hidden' : 'auto'); break;
            }
          }

          // Util functions
          function replaceWithProps(text, obj) {
            var keys = Object.keys(obj)
            keys.forEach(key => {
              var stringToReplace = `{{${key}}}`;
              var re = new RegExp(stringToReplace, 'g');
              text = text.replace(re, obj[key]);
            })
            return text;
          }
      }
    }
    return _var;
  };

  ['_var', 'handlers', 'attrs', 'chart', 'breadcrumbTrail', 'arcs', 'calc', 'tooltip', 'fixedTooltip'].forEach(function (key) {

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


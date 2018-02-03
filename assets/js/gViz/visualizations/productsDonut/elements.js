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
  var centerPoint = undefined;
  var layouts = undefined;
  var arcs = undefined;
  var handlers = undefined;



  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run': {
        if (!attrs) console.log('not valid - attrs');
        if (!calc) console.log('not valid - calc');
        if (!chart) console.log('not valid -chart');
        if (!layouts) console.log('not valid - layouts');
        if (!arcs) console.log('not valid - arcs');
        if (!centerPoint) console.log('not valid - centerPoint');
        if (!handlers) console.log('not valid - handlers');
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


          //  #################################    CENTER TEXTS - REST MODE #####################

          centerPoint.append('circle')
            .attr('r', calc.innerRadius)
            .attr('fill', 'white')
          //  .attr('fill', 'url(' + attrs.urlLocation + '#rectangularPattern)')

          var totalSalesValueG = centerPoint.append('g').style('display', attrs.layoutType == _var.consts.LAYOUT_TYPE.COMPLEX ? 'inline' : 'none');

          var totalSalesValueText = totalSalesValueG
            .append('text')
            .text(attrs.restModeSumText)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('y', 60)
            .attr('font-size', attrs.totalSalesFontSize)
            .attr('fill', attrs.productTextDefaultFill);



          var totalSalesValue = totalSalesValueG
            .append('text')
            .attr('class', 'font-highlight')
            .text(replaceWithProps(attrs.restModeSumValue, { TOTAL_SALES: calc.totalSales.toFixed(0) }))
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('y', -10)
            .attr('font-size', attrs.totalSalesValueFontSize)
            .attr('fill', attrs.productTextDefaultFill);


          //  #################################    CENTER TEXTS FOR COMPLEX LAYOUT  #####################


          var productDetailWrapperG = centerPoint.append('g').style('display', attrs.layoutType == _var.consts.LAYOUT_TYPE.COMPLEX ? 'inline' : 'none');

          var productImage = productDetailWrapperG.append('image')
            .attr('width', calc.centerImageWidth)
            .attr('height', calc.centerImageHeight)
            .attr('x', -calc.centerImageWidth / 2.4)
            .attr('y', -calc.centerImageHeight / 2);


          var productName = productDetailWrapperG.append('text')
            .text('Product name')
            .attr('text-anchor', 'middle')
            .attr('y', - calc.innerRadius / 2 + attrs.productNameYOffset)
            .attr('font-size', attrs.productNameFontSize)
            .attr('fill', attrs.productTextDefaultFill)
            .attr('dy', '0.8em')



          var productId = productDetailWrapperG.append('text')
            .text('product id')
            .attr('text-anchor', 'middle')
            .attr('y', - calc.innerRadius / 1.5 + attrs.productIdYOffset)
            .attr('font-size', attrs.productIdFontSize)
            .attr('fill', attrs.productTextDefaultFill);


          var productRevenue = productDetailWrapperG
            .append('text')
            .attr('class', 'font-highlight')
            .text(attrs.productRevenueText)
            .attr('text-anchor', 'middle')
            .attr('y', calc.innerRadius / 1.2)
            .attr('font-size', attrs.hoverModePriceTextFontSize)
            .attr('fill', attrs.productTextDefaultFill);

          productDetailWrapperG.append('text')
            .text(attrs.hoverModePriceText)
            .attr('text-anchor', 'middle')
            .attr('y', calc.innerRadius / 1.7)
            .attr('font-size', attrs.hoverModePriceTextFontSize)
            .attr('fill', attrs.productTextDefaultFill);




          // ############################  CENTER TEXTS - FOR SIMPLE LAYOUT  REST MODE ########################


          var simpleLayoutRestTextWrapper = centerPoint.append('g').style('display', attrs.layoutType == _var.consts.LAYOUT_TYPE.SIMPLE ? 'inline' : 'none');

          _var.salesValueTextSimple = simpleLayoutRestTextWrapper
            .append('text')
            .text(attrs.restModeSumText)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('y', -60)
            .attr('font-size', attrs.totalSalesFontSizeSimpleLayout)
            .attr('fill', attrs.restModeSimpleLayoutCenterTextFill);



          _var.totalSalesValueSimple = simpleLayoutRestTextWrapper
            .append('text')
            .attr('class', 'font-highlight')
            .text(replaceWithProps(attrs.restModeSumValue, { TOTAL_SALES: calc.totalSales.toFixed(0) }))
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('y', -10)
            .attr('font-size', attrs.totalSalesValueFontSizeSimpleLayout)
            .attr('fill', attrs.productTextDefaultFill);


          // ######################## SIMPLE LAYOUT  - TOGGLE  ########################
          var toggleWrapper = simpleLayoutRestTextWrapper.append('g').attr('class', 'toggle-wrapper')
            .attr('transform', `translate(-20,${-calc.innerRadius * 3 / 4})`)
            .attr('cursor', 'pointer')
            .on('click', d => {
              toggleWrapper
                .select('circle')
                .transition()
                .attr('cx', (d) => {
                  return attrs.isLeftChecked ? 30 : 10;

                }).on('end', (d) => {
                  attrs.isLeftChecked = !attrs.isLeftChecked;
                  console.log(attrs.isLeftChecked);
                  if (handlers.toggleClicked) {
                    handlers.toggleClicked(attrs.isLeftChecked);
                  }
                });
            });

          toggleWrapper.append('rect')
            .attr('width', 40)
            .attr('height', 20)
            .attr('fill', '#EDEDED')
            .attr('rx', 10)


          toggleWrapper.append('circle')
            .attr('r', 8)
            .attr('cx', attrs.isLeftChecked ? 10 : 30)
            .attr('cy', 10)
            .attr('fill', '#FF5F1F')






          // ############################  CENTER TEXTS - FOR SIMPLE LAYOUT ########################

          var simpleLayoutHoverTextWrapper = centerPoint.append('g').style('display', attrs.layoutType == _var.consts.LAYOUT_TYPE.SIMPLE ? 'inline' : 'none');

          _var.simpleHoverPercent = simpleLayoutHoverTextWrapper.append('text')
            .attr('class', 'font-highlight')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('y', 60)
            .attr('font-size', attrs.totalSalesValueFontSizeSimpleLayout - 15)
            .attr('fill', attrs.productTextDefaultFill);

          //  #################################    SECTORS   #####################

          var sectorsG = centerPoint.selectAll('.sector')
            .data(layouts.donut(attrs.data.values))
            .enter()
            .append('g')

            .attr('class', 'sector');


          var sectors = sectorsG.append('path')
            .attr('class', 'arc')
            .attr('d', d => {
              d.startAngle += Math.PI / 360;
              d.endAngle -= Math.PI / 360;
              var result = arcs.donut(d);
              return result;
            })
            .on('mouseenter', function (d) { handlers.mouseEnter(d, d3.select(this)) })
            .on('mouseleave', function (d) { handlers.mouseLeave(d, d3.select(this)) })
            .on('mousemove', function (d) { handlers.mouseOver(d, d3.select(this)) })
            .attr('fill', d => d.data.restColor)




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





          // =======================  ASSIGN NEEDED PROPS   =========================
          _var.totalSalesValueG = totalSalesValueG;
          _var.sectors = sectors;
          _var.productImage = productImage;
          _var.productName = productName;
          _var.productId = productId;
          _var.productRevenue = productRevenue;
          _var.productDetailWrapperG = productDetailWrapperG;

          break;
      }
    }

    return _var;
  };



  ['_var', 'calc', 'attrs', 'chart', 'centerPoint', 'layouts', 'arcs', 'handlers', 'productDetailWrapperG'].forEach(function (key) {

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

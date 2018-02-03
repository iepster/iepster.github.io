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
  var hierarchy = undefined;
  var arcs = undefined;
  var scales = undefined;
  var formatting = undefined;
  var handlers = undefined;
  var breadcrumbTrail = undefined;
  var behaviors = undefined;
  var dragCircleContent = undefined;
  var types = undefined;
  var updateHandlerFuncs = undefined;

  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run': {
        if (!attrs) console.log('not valid - attrs');
        if (!calc) console.log('not valid - calc');
        if (!chart) console.log('not valid -chart');
        if (!centerPoint) console.log('not valid - centerPoint');
        if (!layouts) console.log('not valid - layouts');
        if (!hierarchy) console.log('not valid -hierarchy');
        if (!arcs) console.log('not valid - arcs');
        if (!scales) console.log('not valid - scales');
        if (!formatting) console.log('not valid -formatting');
        if (!handlers) console.log('not valid -handlers');
        if (!breadcrumbTrail) console.log('not valid -breadcrumbTrail');
        if (!behaviors) console.log('not valid -behaviors');
        if (!types) console.log('not valid -behaviors');
        if (!updateHandlerFuncs) console.log('not valid - updateHandlerFuncs')
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

          _var.fontSizes = {};
          _var.fontSizes = {
            totalSalesValueText: 18,
            totalSalesValue: 48,
            productRevenue: 30,
            productTotalRevenueText: 20,
            productRevenueText: 20,
          }
          if (attrs.svgWidth <= 530) {
            _var.fontSizes.productRevenueText = 12;
          }
          if (attrs.svgWidth < 400) {
            _var.fontSizes.totalSalesValueText = 10;
            _var.fontSizes.totalSalesValue = 20;
            _var.fontSizes.productRevenue = 10;
            _var.fontSizes.productTotalRevenueText = 10;
            _var.fontSizes.productRevenueText = 7;
          }

          //######################  CENTER CIRCLE PRODUCT  ###########################

          // Center circle product content wrapper
          var productWrapper = centerPoint
            .patternify({ selector: 'product-wrapper', elementTag: 'g' })
            .attr('display', function () {
              if (attrs.type == types.PRODUCTED) return 'initial';
              return 'none';
            })

          //Product image
          var productImage = productWrapper
            .patternify({ selector: 'product-image', elementTag: 'image' })
            .attr('width', calc.centerImageWidth)
            .attr('height', calc.centerImageHeight)
            .attr('x', -calc.centerImageWidth / 2.4)
            .attr('y', -calc.centerImageHeight / 2);

          // Total sales value group
          var totalSalesValueG = productWrapper.patternify({ selector: 'total-sales-value-group', elementTag: 'g' });
          var appender = 0;
          if (attrs.hideVariablesButton) {
            appender += 20
          }

          //Total sales value text
          var totalSalesValueText = totalSalesValueG
            .patternify({ selector: 'total-sales-value-text', elementTag: 'text' })
            .text(attrs.restModeSumText)
            .attr('text-anchor', 'middle')
            .attr('y', 20 + appender)
            .attr('font-size', _var.fontSizes.totalSalesValueText)
            .attr('fill', attrs.productTextDefaultFill);

          //Total sales value
          var totalSalesValue = totalSalesValueG
            .attr('class', 'font-highlight')
            .patternify({ selector: 'total-sales-value', elementTag: 'text' })
            .text(_var.formatting.restModeSumValue(hierarchy.root.value.toFixed(0)))
            .attr('text-anchor', 'middle')
            .attr('y', -10 + appender)
            .attr('font-size', _var.fontSizes.totalSalesValue)
            .attr('fill', attrs.productTextDefaultFill);

          //Product revenue
          var productRevenue = productWrapper
            .patternify({ selector: 'product-revenue', elementTag: 'text' })
            .text(attrs.productRevenueText)
            .attr('text-anchor', 'middle')
            .attr('y', calc.centerImageHeight / 2 + 50)
            .attr('font-size', _var.fontSizes.productRevenue)
            .attr('fill', attrs.productTextDefaultFill);

          //Total product  revenue text
          var productTotalRevenueText = productWrapper
            .patternify({ selector: 'product-total-revenue-text', elementTag: 'text' })
            .text(attrs.hoverModePriceText)
            .attr('text-anchor', 'middle')
            .attr('y', calc.centerImageHeight / 2 + 20)
            .attr('font-size', _var.fontSizes.productRevenueText)
            .attr('fill', attrs.defaultTextColor);

          //Product definition
          var productsDefinition = productWrapper
            .patternify({ selector: 'product-definition', elementTag: 'text' })
            .text('Style')
            .attr('text-anchor', 'middle')
            .attr('y', - calc.radius / 3.5)
            .attr('font-size', _var.fontSizes.productRevenueText)
            .attr('fill', attrs.defaultTextColor);

          //Style name
          var styleName = productWrapper
            .patternify({ selector: 'style-name', elementTag: 'text' })
            .text(attrs.productName)
            .attr('text-anchor', 'middle')
            .attr('y', - calc.radius / 5)
            .attr('font-size', _var.fontSizes.productRevenueText)
            .attr('fill', attrs.productTextDefaultFill);

          //Index of something :/
          var index = 2.5

          //Product color
          var prodColor = productWrapper
            .patternify({ selector: 'prod-color', elementTag: 'text' })
            .text('Color')
            .attr('text-anchor', 'right')
            .attr('x', - calc.radius / index)
            .attr('y', - calc.radius / 16)
            .attr('font-size', _var.fontSizes.productRevenueText)
            .attr('fill', attrs.defaultTextColor)
            .style('display', 'none')

          //Product color value
          var productColorVal = productWrapper
            .patternify({ selector: 'product-color-val', elementTag: 'text' })
            .text(attrs.productColor)
            .attr('text-anchor', 'right')
            .attr('x', - calc.radius / index)
            .attr('font-size', _var.fontSizes.productRevenueText)
            .attr('fill', attrs.productTextDefaultFill)
            .style('display', 'none')

          //Index variable
          var ind = 4

          //Product size
          var prodSize = productWrapper
            .patternify({ selector: 'prod-size', elementTag: 'text' })
            .text('Size')
            .attr('text-anchor', 'right')
            .attr('x', calc.radius / ind)
            .attr('y', - calc.radius / 16)
            .attr('font-size', _var.fontSizes.productRevenueText)
            .attr('fill', attrs.defaultTextColor)
            .style('display', 'none');

          //Product size value
          var productSizeVal = productWrapper
            .patternify({ selector: 'product-size-val', elementTag: 'text' })
            .text(attrs.productSizeVal)
            .attr('x', calc.radius / ind)
            .attr('font-size', _var.fontSizes.productRevenueText)
            .attr('fill', attrs.productTextDefaultFill)
            .style('display', 'none');

          // #########################    CENTER TEXTS  ##############
          // Center Text
          // Line Texts
          var lineTexstsG = centerPoint
            .patternify({ selector: 'line-text-g', elementTag: 'g' })
            .attr('display', attrs.type == types.LINED ? 'initial' : 'none');

          //Center text
          var centerText = lineTexstsG
            .patternify({ selector: 'center-text', elementTag: 'text' })
            .text(attrs.centerText)
            .attr('text-anchor', 'middle')
            .attr('y', calc.radius / 4)
            .attr('font-size', 20)
            .attr('fill', attrs.defaultTextColor);

          //Revenue value
          var revenueValue = lineTexstsG
            .patternify({ selector: 'revenue-value', elementTag: 'text' })
            .text('$ 1K')
            .attr('text-anchor', 'middle')
            .attr('y', calc.radius / 2.7)
            .attr('font-size', 30)
            .attr('fill', attrs.defaultTextColor);

          //Product id
          var productId = lineTexstsG
            .patternify({ selector: 'product-id', elementTag: 'text' })
            .text('product id')
            .attr('text-anchor', 'middle')
            .attr('y', - calc.radius / 4)
            .attr('font-size', 20)
            .attr('fill', attrs.defaultTextColor);

          //Product name
          var productName = lineTexstsG
            .patternify({ selector: 'product-name', elementTag: 'text' })
            .text('Product name')
            .attr('text-anchor', 'middle')
            .attr('y', - calc.radius / 7)
            .attr('font-size', 20)
            .attr('fill', attrs.defaultTextColor);

          // #########################    DRAG CIRCLE BACKGROUND  ##############
          //Drag circle background
          var dragBackgroundCircle = centerPoint
            .patternify({ selector: 'drag-circle', elementTag: 'circle' })
            .attr('class', 'drag-circle')
            .attr('r', calc.innerCircleRadius - 6)
            .attr('fill', 'white')
            .attr('opacity', 0)

          // #########################    DRAG CIRCLE CONTENT  ##############

          //Drag circle content
          var dragCircleContent = centerPoint
            .patternify({ selector: 'drag-circle-content', elementTag: 'g' })
            .attr('opacity', '0');

          //Drag circle dash array
          var dragCircle = dragCircleContent
            .patternify({ selector: 'actual-drag-circle', elementTag: 'circle' })
            .attr('r', calc.innerCircleRadius - 6)
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '7,7')

          //drop group
          var dropTextWrapper = dragCircleContent
            .patternify({ selector: 'drop-text-wrapper', elementTag: 'g' })
            .attr('class', 'remove-text-wrapper')
            .attr('opacity', 0)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FD3B90')
            .attr('transform', 'translate(0,' + calc.dropTextPosY + ')')

          //Drop group text
          dropTextWrapper
            .patternify({ selector: 'drop-here-text', elementTag: 'text' })
            .text('Drop here')

          //Drop group remove text
          dropTextWrapper
            .patternify({ selector: 'to-remove-text', elementTag: 'text' })
            .text('to remove')
            .attr('dy', '1em')

          //Drop icons
          dropTextWrapper
            .patternify({ selector: 'drop-icons-diwo', elementTag: 'text' })
            .attr('font-family', 'Diwo-Icons')
            .attr('font-size', 40)
            .attr('y', calc.innerCircleRadius)
            .attr('dy', '-1em')
            .text(function (d) {
              return '\ue915'
            });

          //Drag add area
          var addTextWrapper = dragCircleContent
            .patternify({ selector: 'add-text-wrapper', elementTag: 'g' })
            .attr('class', 'add-text-wrapper')
            .attr('opacity', 0)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FD3B90')
            .attr('transform', 'translate(0,' + calc.addTextPosY + ')')

          //Add area text
          addTextWrapper
            .patternify({ selector: 'add-text-drop-here', elementTag: 'text' })
            .text('Drop here')

          //Add area desc text
          addTextWrapper
            .patternify({ selector: 'add-text-to-add', elementTag: 'text' })
            .text('to add')
            .attr('dy', '1em')

          //Add area icons
          addTextWrapper
            .patternify({ selector: 'diwo-icond-add-text', elementTag: 'text' })
            .attr('font-family', 'Diwo-Icons')
            .attr('font-size', 30)
            .attr('y', calc.innerCircleRadius)
            .attr('font-weight', 'bold')
            .attr('dy', '-2.5em')
            .text(function (d) { return '\ue913' });

          //######################  'Add Variables' button ###########################

          //Variables button
          var variablesButtonG = centerPoint
            .patternify({ selector: 'variables-button', elementTag: 'g' })
            .attr('class', 'variables-button')
            .attr('transform', 'translate(-65,65)')
            .attr('cursor', 'pointer')
            .style('display', attrs.hideVariablesButton ? 'none' : 'initial')
            .on('click', updateHandlerFuncs.onButtonClick)

          //Variables button background
          var variablesButton = variablesButtonG
            .patternify({ selector: 'button-back', elementTag: 'rect' })
            .attr('width', 130)
            .attr('height', 36)
            .attr('fill', '#FF4000')
            .attr('rx', 18)
            .attr('ry', 18)
          //.style('display',attrs.isFullScreenMode?"initial":"none")

          //Variables button text
          variablesButtonG
            .patternify({ selector: 'variable-buttons-text', elementTag: 'text' })
            .attr('cursor', 'pointer')
            .style('user-select', 'none')
            .style('-webkit-user-select', 'none')
            .style('-moz-user-select', 'none')
            .style('-ms-user-select', 'none')
            .text('Add Variables')
            .attr('fill', 'white')
            .attr('x', 15)
            .attr('alignment-baseline', 'central')
            .attr('y', variablesButton.attr('height') / 2)

          // #########################    SUNBURST PATHS ##############

          //Actual sunburst paths
          var sunburstPaths = centerPoint.selectAll('path')
            .data(layouts.partition(hierarchy.root).descendants(), d => {
              return d.data.generatedId;
            });

          sunburstPaths.exit().remove();

          sunburstPaths = sunburstPaths
            .enter()
            .append('path')
            .merge(sunburstPaths);

          sunburstPaths
            .attr('pointer-events', 'all')
            .attr('d', arcs.sunburst)
            .attr('class', 'sunburts-paths')
            .attr('data-generated-id', d => d.data.generatedId)
            .on('click.freezeSector', d => handlers.freezeSector(d))
            .on('mouseenter.updateHandlerStart', d => updateHandlerFuncs.onSectorHoverStart(d))
            .on('mouseleave.updateHandlerEnd', d => updateHandlerFuncs.onSectorHoverEnd(d))
            .on('mouseenter.breadcrumb', d => handlers.breadcrumbShow(d))
            .on('mouseleave.breadcrumb', d => handlers.breadcrumbHide(d))
            .on('mouseenter.tooltip', d => handlers.tooltipMouseEnter(d))
            .on('mouseleave.tooltip', d => handlers.tooltipMouseLeave(d))
            .on('mousemove.tooltip', d => handlers.tooltipMouseOver(d))
            .on('click.detailView', d => { handlers.detailView(d); })
            .attr('stroke', 'white')
            .attr('stroke-width', (d) => {
              var stroke = d.depth > 2 ? 1 : 4;
              return stroke;
            })
            .attr('stroke-dasharray', function (d) {
              if (d.firstBordered) {
                return '0,88,20';
              }
            })
            .attr('fill-opacity', d => {
              if (d.data.color instanceof Array) return 1; return attrs.opacityConfig[d.depth]
            })
            .style('fill', d => {
              if (Array.isArray(d.data.color)) {
                return d.data.color[d.depth - 1];
              }
              return d.data.color;
            })
            .style('cursor', 'pointer')
          // .call(behaviors.drag)

          // #########################    BREADCRUMBS  ##############
          //Breadcrumbs
          breadcrumbTrail
            .patternify({ selector: 'back-button', elementTag: 'rect' })
            .attr('width', calc.backRectWidth)
            .attr('height', calc.backRectWidth)
            .attr('fill', 'white')

          //Back button symbol
          breadcrumbTrail
            .patternify({ selector: 'back-button-symbol', elementTag: 'text' })
            .attr('class', 'back-button-arrow-icon')
            .attr('font-family', 'Diwo-Icons')
            .attr('font-size', function (d) { return 1.1 + 'em' })
            .text(function (d) { return '\ue90e' })
            .attr('class', 'back-button')
            .attr('x', calc.backRectWidth / 20)
            .attr('y', calc.backRectWidth * 0.87)
            .attr('fill', 'red')

          //Back button styles
          breadcrumbTrail.selectAll('.back-button')
            .style('display', 'none')
            .style('cursor', 'pointer')
            .on('click', d => handlers.initialView(d))

          //Json obj property replacer func
          function replaceWithProps(text, obj) {
            var keys = Object.keys(obj)
            keys.forEach(key => {
              var stringToReplace = `{${key}}`;
              var re = new RegExp(stringToReplace, 'g');
              text = text.replace(re, obj[key]);
            })
            return text
          }

          // =======================  ASSIGN NEEDED PROPS   =========================
          _var.sunburstPaths = sunburstPaths;
          _var.revenueValue = revenueValue;
          _var.productName = productName;
          _var.styleName = styleName;
          _var.productId = productId;
          _var.centerText = centerText;
          _var.dragCircleContent = dragCircleContent;
          _var.dragBackgroundCircle = dragBackgroundCircle;
          _var.productWrapper = productWrapper;
          _var.dragCircle = dragCircle;
          _var.productRevenue = productRevenue;
          _var.productImage = productImage;
          _var.productTotalRevenueText = productTotalRevenueText;
          _var.productsDefinition = productsDefinition;
          _var.variablesButtonG = variablesButtonG;
          _var.totalSalesValueG = totalSalesValueG;
          _var.totalSalesValue = totalSalesValue;
          break;
      }
    }

    return _var;
  };

  //dinamic function declaring
  ['_var', 'calc', 'attrs', 'chart', 'centerPoint', 'formatting', 'scales', 'arcs', 'hierarchy', 'layouts', 'handlers', 'breadcrumbTrail', 'behaviors', 'types', 'updateHandlerFuncs', 'totalSalesValueG'].forEach(function (key) {

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

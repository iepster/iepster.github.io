// Imports
var d3 = require("d3");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var attrs = undefined;
  var calc = undefined;

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

          //=======================  DRAWING   =========================

          //Container
          var container = d3.select(attrs.container);

          var svg = container.patternify({ selector: 'svg-element', elementTag: 'svg' }).attr('font-family', attrs.svgFontFamily).attr('width', attrs.svgWidth).attr('height', attrs.svgHeight).style('transform', 'scale(' + attrs.scale + ')')

          //Set scales - in case we are turning on preserve aspect ration
          attrs.scale = svg.node().getBoundingClientRect().width / attrs.svgWidth;
          attrs.scale = 1;

          //Breadcrumbs wrapper
          var breadcrumbTrail = svg.patternify({ selector: 'breadcrumb-wrapper', elementTag: 'g' }).attr('id', 'trail').attr('transform', `translate(0,0) scale(${1 / attrs.scale})`);

          // Chart content wrapper - same as _var.g in other chartd
          var chart = svg.patternify({ selector: 'chart', elementTag: 'g' }).attr('width', calc.chartWidth).attr('height', calc.chartHeight).attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')')

          // Group which is translated into chart center
          var centerPoint = chart.patternify({ selector: 'center-point', elementTag: 'g' }).attr('transform', 'translate(' + calc.centerPointX + ',' + calc.centerPointY + ')');

          //################################   FILTERS  &   SHADOWS  ##################################

          // Add filters ( Shadows)
          var defs = chart.patternify({ selector: 'defs-element', elementTag: 'defs' })

          //Dinamic drop shadow url
          calc.dropShadowUrl = "drop-shadow-price-ranges" + Math.floor(Math.random() * 1000000);

          //Drop shadow filter
          var dropShadowFilter = defs.patternify({ selector: 'filter-element', elementTag: 'filter' }).attr("id", calc.dropShadowUrl).attr("height", "130%");
          dropShadowFilter.patternify({ selector: 'fe-gaussian-blur-element', elementTag: 'feGaussianBlur' }).attr("in", "SourceAlpha").attr("stdDeviation", 5).attr("result", "blur");
          dropShadowFilter.patternify({ selector: 'feOffset-element', elementTag: 'feOffset' }).attr("in", "blur").attr("dx", 2).attr("dy", 4).attr("result", "offsetBlur");
          dropShadowFilter.patternify({ selector: 'feFlood-element', elementTag: 'feFlood' }).attr('flood-color', 'black').attr("flood-opacity", "0.4").attr("result", "offsetColor");
          dropShadowFilter.patternify({ selector: 'feComposite-element', elementTag: 'feComposite' }).attr('in', 'offsetColor').attr('in2', 'offsetBlur').attr("operator", "in").attr("result", "offsetBlur");
          var feMerge = dropShadowFilter.patternify({ selector: 'feMerge-element', elementTag: 'feMerge' })
          feMerge.patternify({ selector: 'feMergeNode-element', elementTag: 'feMergeNode' }).attr("in", "offsetBlur")
          feMerge.patternify({ selector: 'feMergeNode2-element', elementTag: 'feMergeNode' }).attr("in", "SourceGraphic");

          //#############################   EVENT LISTENERES ###########################

          // Get translation from  'transform' property string
          function getTranslation(transform) {

            // Create a dummy g for calculation purposes only. This will never
            // be appended to the DOM and will be discarded once this function 
            // returns.
            var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

            // Set the transform attribute to the provided string value.
            g.setAttributeNS(null, "transform", transform);

            // Consolidate the SVGTransformList containing all transformations
            // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
            // its SVGMatrix. 
            var matrix = g.transform.baseVal.consolidate().matrix;

            // As per definition values e and f are the ones for the translation.
            return [matrix.e, matrix.f];
          }

          d3.select(window).on('resize', function () {

            //Recalculate scale
            attrs.scale = svg.node().getBoundingClientRect().width / attrs.svgWidth;

            // Make some elements not scallable
            attrs.shouldNotBeScaled.forEach(selector => {
              svg.selectAll(selector)
                .each(function (d) {
                  var el = d3.select(this);
                  var oldTransform = el.attr('transform');
                  var translObj = getTranslation(oldTransform)
                  el.attr('transform', `translate(${translObj[0]},${translObj[1]}) scale(${1 / attrs.scale})`)
                })
            })
          })

          // =======================  ASSIGN NEEDED PROPS   =========================
          _var.svg = svg;
          _var.chart = chart;
          _var.centerPoint = centerPoint;
          _var.breadcrumbTrail = breadcrumbTrail;
          _var.centerPoint = centerPoint;
          break;
      }
    }
    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'data', 'attrs', 'calc'].forEach(function (key) {

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

  // Executa a funcao chamando o parametro de step
  main.run = _ => main('run');

  return main;
};

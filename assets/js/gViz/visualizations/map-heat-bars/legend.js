// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var      = undefined;
  var animation = 900;
  var components = {};

  // Validate attributes
  var validate = function(step) {
    switch (step) {
      case 'run': return true;
      default: return false;
    }
  };

  // Main function
  var main = function(step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'run':

          // Get outer wrapper
          var outerWrapper = _var.container.d3.closest('.gViz-outer-wrapper');

          // Set margin left and display style
          outerWrapper.select('.legend-wrapper, .legend-wrapper-full')
            .style('display', _var.data == null || _var.data.legend == null || _var.data.legend.isVisible == null || _var.data.legend.isVisible === true ? 'block' : 'none')

          // Set margin left and display style
          outerWrapper.select('.legend-wrapper, .legend-wrapper-full')
            .select('.scale-wrapper')
              .style('display', _var.mode === 'heat' ? 'block' : 'none')
              .select('.scale-rect')
                .style('background', _var.mode === "heat" ? "linear-gradient(to right, "+_var.heatColors.join(',')+")" : _var.barColor({}))

          // Get scale bins values
          var scaleBinsValues = _var.mode === 'heat' ? _var.heatScale.domain() : _var.barScale.domain();
          var bins = _var.data.attrs != null && _var.data.attrs.legendBins != null && !isNaN(+_var.data.attrs.legendBins) ? +_var.data.attrs.legendBins : 0;
          var hasScaleBins = bins >= 2;

          // Draw legend scale bins
          var scaleBinsWrapper = outerWrapper.selectAll(".scale-bins-wrapper").data(hasScaleBins ? ['scale-bins-wrapper'] : []);
          scaleBinsWrapper.exit().remove();
          scaleBinsWrapper = scaleBinsWrapper.enter().append('div').attr("class", "scale-bins-wrapper").merge(scaleBinsWrapper);
          scaleBinsWrapper
            .style('position', 'absolute')
            .style('width', 'auto')
            .style('height', 'auto')
            .style('top', (((_var.height + _var.margin.top + _var.margin.top)/2) - (((bins+1)*20)/2)) + 'px')
            .style('left', (_var.width + _var.margin.left + _var.margin.right) + 'px')

          // Draw legend scale bins
          var scaleBins = scaleBinsWrapper.selectAll(".scale-bins").data(hasScaleBins ? d3.range(bins+1) : []);
          scaleBins.exit().remove();
          scaleBins = scaleBins.enter().append('div').attr("class", "scale-bins").merge(scaleBins);
          scaleBins
            .style('width', 'auto')
            .style('margin-bottom', '2px')
            .style('display', 'flex')
            .style('white-space', 'nowrap')
            .style('cursor', 'pointer')
            .html(function(d, i) {
              var value = scaleBinsValues[0] + ((scaleBinsValues[1] - scaleBinsValues[0])/bins) * i;
              var rectColor = _var.mode === 'heat' ? _var.heatScale(value) : _var.barScale(value);
              var color = _var.data.attrs != null && _var.data.attrs.legendColor != null && _var.data.attrs.legendColor !== "" ? _var.data.attrs.legendColor : (_var.mode === 'heat' ? _var.heatScale(value) : _var.barScale(value));
              var parsedValue = _var.mode === 'heat' ? _var.heatFormat(value) : _var.barFormat(value);
              var string = "<div style='display: block; height:18px; width:18px; background:"+rectColor+"; float:left; margin-right:5px'></div>";
              string += "<div style='display: block; height:18px; line-height:20px; float:left; font-size:11px; font-weight:lighter; color: "+color+";'>"+parsedValue+"</div>";
              return string;
            });

          // Mouseover action
          scaleBins.on('mouseover', function(d, i) {

            var min = scaleBinsValues[0] + ((scaleBinsValues[1] - scaleBinsValues[0])/bins) * i;
            var max = scaleBinsValues[0] + ((scaleBinsValues[1] - scaleBinsValues[0])/bins) * (i+1);

            // Fade bars
            _var.g.select('.chart-elements').selectAll('.bar, .bottom-bar, .bar-circle').transition()
              .style('opacity', function(g) { return g.value >= min && g.value < max ? 1 : 0.2; })
              .style("filter", function(g) { return g.value >= min && g.value < max ? "url(#"+_var.shadowId+")" : ""; })

            // Fade map shapes
            _var.g.select('.chart-elements').selectAll('.map-shape').transition()
              .style('opacity', function(g) { return _var.shapeValue(g) >= min && _var.shapeValue(g) < max ? _var.shapeOpacity(g) : 0.2; })
              .style("filter", function(g) { return _var.shapeValue(g) >= min && _var.shapeValue(g) < max ? "url(#"+_var.shadowId+")" : ""; })

          // Mouseout action
          }).on('mouseout', function(d,i) {

            // Fade bars
            _var.g.select('.chart-elements').selectAll('.bar, .bottom-bar, .bar-circle').transition().style('opacity', 1).style("filter", "");

            // Fade map shapes
            _var.g.select('.chart-elements').selectAll('.map-shape').transition().style('opacity', _var.shapeOpacity).style("filter", "");

          });

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','animation','components'].forEach(function(key) {

    // Attach variables to validation function
    validate[key] = function(_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return validate;
    };

    // Attach variables to main function
    return main[key] = function(_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return main;
    };
  });

  // Executa a funcao chamando o parametro de step
  main.run = _ => main('run');

  return main;
};

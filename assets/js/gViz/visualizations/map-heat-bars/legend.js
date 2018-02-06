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
          var hasLegend = _var.data.legend == null || _var.data.legend.isVisible == null || _var.data.legend.isVisible === true;
          outerWrapper.select('.legend-wrapper, .legend-wrapper-full')
            .style('display', hasLegend ? 'block' : 'none')

          // Set margin left and display style
          var scaleWrapperHeat = outerWrapper.select('.legend-wrapper, .legend-wrapper-full').select(".scale-wrapper[data-mode='heat']")
          var scaleWrapperBars = outerWrapper.select('.legend-wrapper, .legend-wrapper-full').select(".scale-wrapper[data-mode='bars']")

          // Set visibility for heat mode
          scaleWrapperHeat
            .style('display', _var.mode === 'heat' ? 'block' : 'none')
            .select('.scale-rect')
              .style('background', _var.mode === "heat" ? "linear-gradient(to right, "+_var.heatColors.join(',')+")" : _var.barColor({}))

          // Set visibility for bars mode
          scaleWrapperBars.style('display', _var.mode === 'bars' ? 'block' : 'none')
          scaleWrapperBars.select('.low-name').html(hasLegend ? _var.data.legend.text : '');

          // Set toggle visibility
          var hasToggle = _var.data.toggle != null && _var.data.toggle.isVisible != null && _var.data.toggle.isVisible === true;
          outerWrapper.select('.legend-wrapper, .legend-wrapper-full').select('.toggle-wrapper').style('display', hasToggle ? 'block' : 'none')

          // Get scale bins values
          _var.legendBinsValues = _var.mode === 'heat' ? _var.heatScale.domain() : _var.barScale.domain();
          _var.legendBins = _var.data.attrs != null && _var.data.attrs.legendBins != null && !isNaN(+_var.data.attrs.legendBins) ? +_var.data.attrs.legendBins : 0;
          var hasLegendBins =_var.legendBins >= 2;

          // Draw legend scale bins
          var scaleBinsWrapper = outerWrapper.selectAll(".scale-bins-wrapper").data(hasLegendBins ? ['scale-bins-wrapper'] : []);
          scaleBinsWrapper.exit().remove();
          scaleBinsWrapper = scaleBinsWrapper.enter().append('div').attr("class", "scale-bins-wrapper").merge(scaleBinsWrapper);
          scaleBinsWrapper
            .style('position', 'absolute')
            .style('width', 'auto')
            .style('height', 'auto')
            .style('top', (((_var.height + _var.margin.top + _var.margin.top)/2) - (((_var.legendBins+1)*20)/2)) + 'px')
            .style('left', (_var.width + _var.margin.left + _var.margin.right) + 'px')

          // Draw legend scale bins
          var scaleBins = scaleBinsWrapper.selectAll(".scale-bins").data(hasLegendBins ? d3.range(_var.legendBins+1) : []);
          scaleBins.exit().remove();
          scaleBins = scaleBins.enter().append('div').attr("class", "scale-bins").merge(scaleBins);
          scaleBins
            .style('width', 'auto')
            .style('margin-bottom', '2px')
            .style('display', 'flex')
            .style('white-space', 'nowrap')
            .style('cursor', 'pointer')
            .html(function(d, i) {

              // Get range values
              var min = _var.legendBinsValues[0] + ((_var.legendBinsValues[1] - _var.legendBinsValues[0])/(_var.legendBins+1)) * i;
              var max  = _var.legendBinsValues[0] + ((_var.legendBinsValues[1] - _var.legendBinsValues[0])/(_var.legendBins+1)) * (i+1);
              var format = _var.mode === 'heat' ? _var.heatFormat : _var.barFormat;

              // Get amount of elements
              var totalSum = d3.sum(_var.data.data[_var.mode], function(d) { return +d.value; });
              var values   = _var.data.data[_var.mode].filter(function(g) { return (i===0 || +g.value>=min) && (i===_var.legendBins || +g.value<max); });
              var amount   = values.length;
              var sum      = d3.sum(values, function(d) { return +d.value; });
              var perc     = ((sum / totalSum) * 100).toFixed(1) + "%";

              // Get text string
              var legendText = _var.data.attrs != null && _var.data.attrs.legendText != null && _var.data.attrs.legendText !== '' ? _var.data.attrs.legendText : "{{amount}} | {{min}} - {{max}}";
              var text = shared.helpers.text.replaceVariables(legendText, { min: format(min), max: format(max), amount: amount, sum: format(sum), perc: perc });

              // Get colors
              var rectColor = _var.mode === 'heat' ? _var.heatScale(min) : _var.barScale(min);
              var color = _var.data.attrs != null && _var.data.attrs.legendColor != null && _var.data.attrs.legendColor !== "" ? _var.data.attrs.legendColor : (_var.mode === 'heat' ? _var.heatScale(min) : _var.barScale(min));

              // Draw legend elements
              var borderColor = shared.helpers.colors.isDark(rectColor) ? 'transparent' : (_var.data.attrs != null && _var.data.attrs.legendBorderColor != null && _var.data.attrs.legendBorderColor !== "" ? _var.data.attrs.legendBorderColor : '#dedede');
              var string = "<div style='display: block; height:18px; border: 1px solid "+borderColor+"; width:18px; background:"+rectColor+"; float:left; margin-right:5px'></div>";
              string += "<div style='display: block; height:18px; line-height:20px; float:left; font-size:12px; font-weight:lighter; color: "+color+";'>"+text+"</div>";
              return string;
            });

          // Mouseover action
          scaleBins.on('mouseover', function(d, i) {

            // Attribute initial values
            var min = _var.legendBinsValues[0] + ((_var.legendBinsValues[1] - _var.legendBinsValues[0])/_var.legendBins) * i;
            var max = _var.legendBinsValues[0] + ((_var.legendBinsValues[1] - _var.legendBinsValues[0])/_var.legendBins) * (i+1);
            var self = this;

            // Fade bars
            _var.g.select('.chart-elements').selectAll('.bar, .bottom-bar, .bar-circle').transition()
              .style('opacity', function(g) { return g.value >= min && g.value < max ? 1 : 0.2; })
              .style("filter", function(g) { return g.value >= min && g.value < max ? "url(#"+_var.shadowId+")" : ""; })

            // Fade map shapes
            _var.g.select('.chart-elements').selectAll('.map-shape').transition()
              .style('opacity', function(g) { return _var.shapeValue(g) >= min && _var.shapeValue(g) < max ? _var.shapeOpacity(g) : 0.2; })
              .style("filter", function(g) { return _var.shapeValue(g) >= min && _var.shapeValue(g) < max ? "url(#"+_var.shadowId+")" : ""; })

            // Fade map legends
            scaleBins.transition()
              .style('opacity', function(g) { return g == d ? 1 : 0.2; })
              //.style("filter",  function(g) { return g == d ? "url(#"+_var.shadowId+")" : ""; })

          // Mouseout action
          }).on('mouseout', function(d,i) {
            _var.g.select('.chart-elements').selectAll('.bar, .bottom-bar, .bar-circle').transition().style('opacity', 1).style("filter", "");
            _var.g.select('.chart-elements').selectAll('.map-shape').transition().style('opacity', _var.shapeOpacity).style("filter", "");
            scaleBins.transition().style('opacity', _var.shapeOpacity).style("filter", "");
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

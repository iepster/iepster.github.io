// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var       = undefined;
  var action     = "start";
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

          switch (action) {

            // First action to be done
            case 'start':

              /* -- Visualization Title -- */
              // Has title flag
              var hasTitle = _var.data.title != null && _var.data.title !== "";
              _var.container.dimensions.title = hasTitle ? 35 : 0;

              // Draw title wrapper
              var titleWrapper = _var.container.outerWrapper.selectAll(".gviz-title-wrapper").data(["gviz-title-wrapper"]);
              titleWrapper.exit().remove();
              titleWrapper = titleWrapper.enter().insert('div', ":first-child").attr('class', "gviz-title-wrapper").merge(titleWrapper);
              titleWrapper
                .style('width', '100%')
                .style('height', '30px')
                .style('line-height', '30px')
                .style('margin', '0px 0px 5px 0px')
                .style('padding', '0px 10px')
                .style('oveflow', 'hidden')
                .style('white-space', 'nowrap')
                .style('text-overflow', 'ellipsis')
                .style('background-color', '#eee')
                .style('color', '#666')
                .style('font-size', '15px')
                .style('font-weight', 'lighter')
                .style('display', hasTitle ? 'block' : 'none')
                .html(_var.data.title)

              /* -- Legend -- */
              var hasLegend = _var.data.legend != null && _var.data.legend.isVisible != null && _var.data.legend.isVisible === true;
              var legendPos = hasLegend && (["top","left","right","bottom"].indexOf(_var.data.legend.position) !== -1) ? _var.data.legend.position : "top";

              // Initialize string
              var string = "";
              var stringObj = {};

              // Iterate nodes
              _var.data.data.forEach(function(d, i) {

                // Get color
                var fillColor = d.color == null ? "#666" : d.color;
                var strokeColor = d.color == null ? "#666" : d.color;
                var mutedColor = d._color == null ? "#bbb" : d._color;
                var shape = 'rect';
                var legend = _var.data.legend != null && _var.data.legend.text != null ? _var.data.legend.text : "{{name}}";
                var legendStr = "";

                // Add rect for obj
                legendStr += "<span class='legend-content "+(legendPos === 'left' || legendPos === 'right' ? 'side' : '')+"' " + (legendPos==='top' || legendPos==='bottom' ? '' : "style='display:block; width: 100%;'") + " title='"+shared.helpers.text.replaceVariables(legend, d)+"'>";
                if(_var.muted) { legendStr += "<span class='"+shape+"' style='background-color:"+mutedColor+"; margin-right: -2px;'></span>"; }
                legendStr += "<span class='"+shape+"' style='background-color:"+fillColor+" ; '></span><span class='name'>";
                legendStr += shared.helpers.text.replaceVariables(legend, d);
                legendStr += "</span>";
                legendStr += "</span>";

                // If the legend str wasnt computed, add to legend
                if(stringObj[legendStr] == null) {
                  stringObj[legendStr] = true;
                  string += legendStr;
                }

              });

              // Set margin left and display style
              var legendWrapper = _var.container.outerWrapper.selectAll(".gviz-legend-wrapper").data(["gviz-legend-wrapper"]);
              legendWrapper.exit().remove();
              legendWrapper = legendWrapper.enter().append("div").attr('class', "gviz-legend-wrapper").merge(legendWrapper);
              legendWrapper
                .style('width', legendPos === "top" || legendPos === "bottom" ? '100%' : '20%')
                .style('min-width', '110px')
                .style('height', 'auto')
                .style('max-height', legendPos === 'top' && legendPos === 'bottom' ? '60px' : '100%')
                .style('line-height', '30px')
                .style('margin', '0px 0px 5px 0px')
                .style('padding', '0px 10px')
                .style('overflow', 'hidden')
                .style('color', '#666')
                .style('font-size', '13px')
                .style('z-index', "1005")
                .style('position', 'absolute')
                .style('left', legendPos === 'right' ? 'unset' : "0px")
                .style('right', legendPos === 'right' ? "0px" : 'unset')
                .style('display', hasLegend ? 'block' : 'none')
                .each(function(d) {

                  // Set margin left and display style
                  var legend = d3.select(this).selectAll(".gviz-legend").data(hasLegend ? ["gviz-legend"] : []);
                  legend.exit().remove();
                  legend = legend.enter().insert('div', ":first-child").attr('class', "gviz-legend").merge(legend);
                  legend
                    .html(string);

                });

              // Set mouse over legend functions
              legendWrapper
                .on('mouseover', function() { if(legendPos === 'top' || legendPos ==='bottom') { d3.select(this).classed('gviz-legend-hover', true); }})
                .on('mouseout', function() { if(legendPos === 'top' || legendPos ==='bottom') { d3.select(this).classed('gviz-legend-hover', false); }})
                .classed('is-pdf', _var.data.attrs != null && _var.data.attrs.isPdf != null && _var.data.attrs.isPdf === true)

              // Set legend dimension
              _var.container.dimensions.legendHeight = hasLegend && (legendPos === 'top' || legendPos === 'bottom') ? (legendWrapper.node().getBoundingClientRect().height + 5) : 0;
              _var.container.dimensions.legendWidth = hasLegend && (legendPos === 'top' || legendPos === 'bottom') ?  0 : (legendWrapper.node().getBoundingClientRect().width);

              // Update legend top position
              legendWrapper
                .style('top', function() {
                  if(legendPos === 'bottom') { return 'unset'; }
                  else if(legendPos === 'top') { return hasTitle ? "35px" : "0px"; }
                  else {
                    var legendHeight = legendWrapper.node().getBoundingClientRect().height + 5;
                    return ((_var.container.outerWrapperClientRect.height - _var.container.dimensions.title) >= _var.container.dimensions.legendHeight ?  (_var.container.outerWrapperClientRect.height/2 - _var.container.dimensions.title - legendHeight/2) : (hasTitle ? "35px" : "0px")) + 'px'; }
                })
                .style('bottom', legendPos === 'bottom' ? "0px" : 'unset')

              // Update container _id, height and client bound rect
              _var.container.d3
                .attr('data-vis-id', _var._id)
                .style('height', (_var.container.outerWrapperClientRect.height - (_var.container.dimensions.title + _var.container.dimensions.legendHeight)) + "px")
                .style('width', (_var.container.outerWrapperClientRect.width - _var.container.dimensions.legendWidth) + "px")
                .style('top', (_var.container.dimensions.title + (legendPos === 'top' ? _var.container.dimensions.legendHeight : 0)) + 'px')
                .style('left', legendPos === 'left' ? 'unset' : '0px')
                .style('right', legendPos === 'left' ? '0px' : 'unset')

              // Update grid background position
              _var.container.outerWrapper.selectAll('.grid-background')
                .style('top', (_var.container.dimensions.title +  (legendPos === 'top' ? _var.container.dimensions.legendHeight : 0)) + 'px')
                .style('left', legendPos === 'left' ? 'unset' : '0px')
                .style('right', legendPos === 'left' ? '0px' : 'unset')

              // Update toggle position
              var hasToggle = _var.data.toggle != null && _var.data.toggle.isVisible != null && _var.data.toggle.isVisible === true;
              _var.container.outerWrapper.selectAll('.gViz-donut-with-toggle-center-toggle')
                .style('display', hasToggle ? 'block' : 'none')
                .style('top', 'calc(50% - 60px)')
                .style('left', function() {
                  if(legendPos === 'top' || legendPos === 'bottom') { return null; }
                  else if(legendPos==='left') { return (_var.container.outerWrapperClientRect.width/2 + _var.container.dimensions.legendWidth/2 - 12)+'px'; }
                  else if(legendPos==='right') { return (_var.container.outerWrapperClientRect.width/2 - _var.container.dimensions.legendWidth/2 - 12)+'px'; }
                });

              // Define height and width
              var scale = _var.data != null && _var.data.attrs != null && _var.data.attrs.scale != null ? _var.data.attrs.scale : 1;
              var containerClientRect = _var.container.d3.node().getBoundingClientRect();
              _var.height = (containerClientRect.height / scale) - (_var.margin.top + _var.margin.bottom);
              _var.width = (containerClientRect.width / scale) - (_var.margin.left + _var.margin.right);

              // NO DATA AVAILABLE
              if (_var.data == null || _var.data.data == null || _var.data.data.length === 0) {
                _var.container.d3.html("<h5 style='line-height: "+(containerClientRect.height)+"px; text-align: center;'>NO DATA AVAILABLE</h5>");
              } else { _var.container.d3.selectAll("h5").remove(); }

              // Set donut size
              _var.size   = d3.min([_var.width, _var.height]) / 2;

              // Initialize arc function
              _var.arc = d3.arc()
                .outerRadius(_var.size)
                .innerRadius(_var.size - _var.radius);

              break;

            // Last action to be done
            case 'end':

              break;
          }
          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','action','components'].forEach(function(key) {

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

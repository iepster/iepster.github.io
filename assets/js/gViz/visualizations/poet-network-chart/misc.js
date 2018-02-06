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
              // Initialize string
              var string = "";
              var stringObj = {};

              // Iterate nodes
              _var.data.data.nodes.forEach(function(d, i) {

                // Get color
                var fillColor = d.color == null ? "#666" : d.color;
                var strokeColor = d.strokeColor == null || shared.helpers.colors.rgb2hex(d3.color(d.strokeColor).toString()) === '#ffffff' ? fillColor : d.strokeColor;
                var shape = d.shape === 'rect' || d.shape === 'diamond' || d.shape === 'triangle-up' || d.shape === 'triangle-down' ? 'rect' : 'circle';
                var legend = _var.data.legend != null && _var.data.legend.text != null ? _var.data.legend.text : "{{name}}";
                var legendStr = "";

                // Add rect for obj
                legendStr += "<span class='legend-content' >";
                legendStr += "<span class='"+shape+"' style='background-color:"+fillColor+"; border:1px solid "+strokeColor+";'></span><span class='name'>";
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
              var hasLegend = _var.data.legend != null && _var.data.legend.isVisible != null && _var.data.legend.isVisible === true;
              var legendWrapper = _var.container.outerWrapper.selectAll(".gviz-legend-wrapper").data(["gviz-legend-wrapper"]);
              legendWrapper.exit().remove();
              legendWrapper = legendWrapper.enter().append("div").attr('class', "gviz-legend-wrapper").merge(legendWrapper);
              legendWrapper
                .style('width', '100%')
                .style('height', 'auto')
                .style('max-height', '60px')
                .style('line-height', '30px')
                .style('margin', '0px 0px 5px 0px')
                .style('padding', '0px 10px')
                .style('overflow', 'hidden')
                .style('color', '#666')
                .style('font-size', '13px')
                .style('z-index', "1005")
                .style('position', 'absolute')
                .style('top', hasTitle ? "35px" : "0px")
                .style('left', "0px")
                .style('display', hasLegend ? 'block' : 'none')
                .each(function(d) {

                  // Set margin left and display style
                  var legend = d3.select(this).selectAll(".gviz-legend").data(hasLegend ? ["gviz-legend"] : []);
                  legend.exit().remove();
                  legend = legend.enter().insert('div', ":first-child").attr('class', "gviz-legend").merge(legend);
                  legend
                    .html(string);

                });

              legendWrapper
                .on('mouseover', function() { d3.select(this).classed('gviz-legend-hover', true); })
                .on('mouseout', function() { d3.select(this).classed('gviz-legend-hover', false); });

              // Set legend dimension
              _var.container.dimensions.legend = hasLegend ? (legendWrapper.node().getBoundingClientRect().height + 5) : 0;

              // Update container _id, height and client bound rect
              _var.container.d3
                .attr('data-vis-id', _var._id)
                .style('height', (_var.container.outerWrapperClientRect.height - (_var.container.dimensions.title + _var.container.dimensions.legend)) + "px")
                .style('top', (_var.container.dimensions.title + _var.container.dimensions.legend) + 'px')

              // Update grid background position
              _var.container.outerWrapper.selectAll('.grid-background')
                .style('top', (_var.container.dimensions.title + _var.container.dimensions.legend) + 'px')


              // Update table tooltip
              _var.container.outerWrapper.select('.gViz-poet-table-tooltip')
                .style('top', (_var.container.dimensions.title + _var.container.dimensions.legend + 10) + 'px')

              // Define height and width
              var containerClientRect = _var.container.d3.node().getBoundingClientRect();
              _var.height = containerClientRect.height - (_var.margin.top + _var.margin.bottom);
              _var.width = containerClientRect.width - (_var.margin.left + _var.margin.right);

              // NO DATA AVAILABLE
              if (_var.data.data == null || _var.data.data.length === 0) {
                _var.container.d3.html("<h5 style='line-height: "+(containerClientRect.height)+"px; text-align: center;'>NO DATA AVAILABLE</h5>");
              } else {
                _var.container.d3.selectAll("h5").remove();
              }

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

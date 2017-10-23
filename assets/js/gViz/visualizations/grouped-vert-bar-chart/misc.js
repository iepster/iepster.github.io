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

              /* -- Axis and Legend -- */
              // Set axis string
              var yTitle = (_var.data.y != null && _var.data.y.title != null && _var.data.y.title !== "" ? "<b>Y - </b>"+_var.data.y.title : "");
              var xTitle = (_var.data.x != null && _var.data.x.title != null && _var.data.x.title !== "" ? "<b>X - </b>"+_var.data.x.title : "");

              // Set axis title
              if(yTitle !== "" && xTitle !== "") { _var.axisTitle = yTitle+" / "+xTitle; }
              else if(yTitle !== "" && xTitle === "") { _var.axisTitle = yTitle; }
              else if(yTitle === "" && xTitle !== "") { _var.axisTitle = xTitle; }
              else { _var.axisTitle = ""; }

              // Iterate over data to get legends for positive and negative values
              var legendDomain = {};
              var legendDomainNeg = {};
              _var.data.data.forEach(function(d) {

                // Add legend
                if(_var.hasWrapper(d.wrap) && d.name != null && d.name !== "") {
                  if(+d.y >= 0) { legendDomain[d.x] = d; }
                  else { legendDomainNeg[d.x] = d; }
                }

                // Iterate over values
                d.values.forEach(function(v) {

                  // Add legend
                  if(+v.y >= 0) { legendDomain[v.x] = v; }
                  else { legendDomainNeg[v.x] = v; }

                });
              });

              // Initialize string
              var string = _var.axisTitle === "" ? "" : "<span class='axis-title'>" + _var.axisTitle + "</span>";
              var stringObj = {};

              // Iterate over legend domains
              var legendDomain = Object.keys(legendDomain).map(function(k) { return legendDomain[k]; })
              var legendDomainNeg = Object.keys(legendDomainNeg).map(function(k) { return legendDomainNeg[k]; })
              legendDomain.concat(legendDomainNeg).forEach(function(d) {

                // Get color
                var fillColor = _var.data.colors[d.x] == null || _var.data.colors[d.x].fill == null ? "#666" : _var.getColor(d);
                var strokeColor = _var.data.colors[d.x] == null || _var.data.colors[d.x].stroke == null ? "#333" : _var.getColor(d, 'stroke');
                var legend = _var.data.legend != null && _var.data.legend.text != null ? _var.data.legend.text : "{{name}}";
                var legendStr = "";

                // Add rect for obj
                legendStr += "<span class='rect' style='background-color:"+fillColor+" ; border-top: 2px solid "+strokeColor+";'></span><span class='name'>";
                legendStr += shared.helpers.text.replaceVariables(legend, d);
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

              // Define height and width
              var containerClientRect = _var.container.d3.node().getBoundingClientRect();
              _var.height = containerClientRect.height - (_var.margin.top + _var.margin.bottom);
              _var.width = containerClientRect.width - (_var.margin.left + _var.margin.right);

              // NO DATA AVAILABLE
              if (_var.data.data == null || _var.data.data.length === 0) {
                _var.container.d3.html("<h5 style='line-height: " + containerClientRect.height + "px; text-align: center;'>NO DATA AVAILABLE</h5>");
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

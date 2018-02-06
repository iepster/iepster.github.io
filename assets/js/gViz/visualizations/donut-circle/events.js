// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var       = null;
  var action     = 'mouseover';
  var components = null;
  var node       = null;
  var _node      = null;
  var nodeSel    = null;

  // Validate attributes
  var validate = function (step) {

    switch (step) {
      case 'run': return true;
      default: return false;
    }
  };

  // Main function
  var main = function (step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Run code
        case 'run':

          // Select groups
          var groups = _var.g.selectAll(".chart-elements").selectAll(".element-group");
          var arcs   = _var.g.selectAll(".chart-elements").selectAll(".element-group").selectAll(".node-arc");

          switch (action) {

            case 'mouseover':

              // Update arc size
              var bigArc = d3.arc()
                .outerRadius(_var.size + 5)
                .innerRadius(_var.size - _var.radius - 5);

              // Fade arcs and add drop shadow
              arcs.transition()
                .attr("d", function(g) { return g.data.id === node.data.id ? bigArc(g) : _var.arc(g); })
                .style('fill', function(g) { return g.data.id === node.data.id ? g.data.color : g.data._color; })
                .style('opacity', function(g) { return g.data.id === node.data.id  ? 1 : 0.3; })
                .style("filter", function(g) { return g.data.id === node.data.id ? "url(#"+_var.shadowId+")" : ""; })

              // Initialize tooltip object
              var tooltipObj = {};

              // Set node attributes to tooltip obj
              Object.keys(node.data).forEach(function(k) { tooltipObj[k] = node.data[k]; });

              // Draw center title
              var centerTitle = _var.g.selectAll("text.center-title").data(["center-title"]);
              centerTitle.exit().remove();
              centerTitle = centerTitle.enter().append('text').attr("class", "center-title").merge(centerTitle);
              centerTitle
                .style('fill', node.data.color)
                .attr('x', 0)
                .attr('y', node.data.img == null || node.data.img === '' ? -20 : -45)
                .attr('text-anchor', 'middle')
                .text(shared.helpers.text.replaceVariables(_var.data.tooltip.title, tooltipObj))
                .style('opacity', 0)
                .transition()
                  .style('opacity', 1)

              break;

            case 'mouseout':

              // Reset arcs and links opacity
              arcs.transition()
                .style('fill', function(g) { return g.data._color; })
                .style('opacity', _var.arcOpacity)
                .style('filter', '')
                .attr("d", _var.arc)

              // Set node
              node = _var.data[_var.metric];

              // Draw center title
              var centerTitle = _var.g.selectAll("text.center-title").data(["center-title"]);
              centerTitle.exit().remove();
              centerTitle = centerTitle.enter().append('text').attr("class", "center-title").merge(centerTitle);
              centerTitle
                .style('fill', _var.data != null && node != null && node.color != null ? node.color : "#666" )
                .attr('y', 0)
                .attr('y', -7)
                .attr('text-anchor', 'middle')
                .text(_var.data != null && node != null && node.title != null ? node.title : "No Title")
                .style('opacity', 0)
                .transition()
                  .style('opacity', 1)

              break;

          }

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','action','components','node','nodeSel'].forEach(function (key) {

    // Attach variables to validation function
    validate[key] = function (_) {
      if (!arguments.length) {
        eval('return ' + key);
      }
      eval(key + ' = _');
      return validate;
    };

    // Attach variables to main function
    return main[key] = function (_) {
      if (!arguments.length) {
        eval('return ' + key);
      }
      eval(key + ' = _');
      return main;
    };
  });

  // Executa a funcao chamando o parametro de step
  main.run = function (_) {
    return main('run');
  };

  return main;
};

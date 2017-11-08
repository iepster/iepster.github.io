// Imports
let d3 = require("d3");
var shared = require("../../../shared/_init.js");

// Module declaration
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var animation = 900;
  var action = 'create';
  var ticks = [];
  var type = 'y';

  // Validate attributes
  var validate = function validate(step) {

    switch (step) {
      case 'run':
        return true;
      default:
        return false;
    }
  };

  // Main function
  var main = function main(step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'run':

          switch (action) {

            case 'create':

              // Create and update X axis
              _var.axes = _var.g.selectAll("g.axes").data(_var.data, function(d) { return d.id; });
              _var.axes.exit().remove();
              _var.axes = _var.axes.enter().append('g').attr("class", "axes").merge(_var.axes);
              _var.axes
                .attr('transform', function(d,i) { return `translate(${_var.offset},${_var.xOut(d.id)})`; })
                .each(function(e, i) {

                // Initialize variables
                var x_ticks = [],
                    y_ticks = [];

                // Switch action to ticks
                action = 'ticks';

                // Create and update X axis
                _var.x_axis = d3.select(this).selectAll(".x.axis").data(['x']);
                _var.x_axis.exit().remove();
                _var.x_axis = _var.x_axis.enter().append('g').attr("class", "x axis").merge(_var.x_axis);
                _var.x_axis.call(_var.xAxis)

                // Change x axis text
                _var.x_axis.selectAll(".tick text").html(function(d, i) { return _var.nodes[d].name.slice(0,4); });

                // Remove lines from x axis
                _var.x_axis.selectAll(".tick line").remove();

                // Get ticks for y
                type = 'y';
                y_ticks = main('run');

                // Create and update Y axis
                _var.y_axis = d3.select(this).selectAll(".y.axis").data(['y']);
                _var.y_axis.exit().remove();
                _var.y_axis = _var.y_axis.enter().append('g').attr("class", "y axis").merge(_var.y_axis);
                _var.y_axis
                  .call(_var.yAxis.tickValues(y_ticks).tickFormat(shared.helpers.number.localePercent))
                  .attr("transform", 'translate(0,' + _var.axesSize + ')')
                  .selectAll(".tick text")
                    .attr('transform', function(d, i) { return 'translate(' + (i === y_ticks.length-1 ? -17 : 0) + ',0)'; })
                    .style('display', e.id == _var.xOut.domain()[0] ? 'block' : 'none' )

                // Path domain first
                _var.y_axis.selectAll('.domain, .tick').sort(d3.ascending);

              });

              // Top and bottom lines
              var lines = _var.g.selectAll("line.axis-line").data(_var.data.concat([{ id: "lineBottom" }]), function(d) { return d.id; });
              lines.exit().remove();
              lines = lines.enter().append("line").attr("class", "axis-line").merge(lines);
              lines
                .attr('x1', 0 )
                .attr('y1', function(d) { return d.id === "lineBottom" ? _var.height : _var.xOut(d.id); })
                .attr('x2', _var.width)
                .attr('y2', function(d) { return d.id === "lineBottom" ? _var.height : _var.xOut(d.id); })

              break;

            case 'ticks':

              switch (type) {

                case 'y':

                  // Get number of bins, size and ticks
                  var bins = d3.max([3, parseInt(_var.height / 140, 10)]);
                  var size = Math.abs(_var.y.domain()[1] - _var.y.domain()[0]) / bins;
                  var ticks = [];

                  // Generate bins
                  __range__(0, bins, true).forEach(function (d, i) { ticks.push((_var.y.domain()[0] + size * i).toFixed(2)); });

                  return ticks;
              }
              break;
          }
          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'animation', 'action', 'ticks', 'type'].forEach(function (key) {

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

function __range__(left, right, inclusive) {
  var range = [];
  var ascending = left < right;
  var end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) { range.push(i); }
  return range;
}

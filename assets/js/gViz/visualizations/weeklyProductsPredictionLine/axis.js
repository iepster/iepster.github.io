// Imports
let d3 = require("d3");
var shared = require("../../shared/_init.js");

// Module declaration
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var animation = 900;
  var action = 'create';
  var ticks = [];
  var type = 'y';
  var chartType = undefined;

  // Validate attributes
  var validate = function validate(step) {

    switch (step) {
      case 'run':
        if (!chartType) console.log('err - charttype')
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

              // Initialize variables
              var x_ticks = [],
                y_ticks = [];

              // Switch action to ticks
              action = 'ticks';

              // Create and update X axis
              _var.x_axis = _var.g.selectAll(".x.axis").data(['x']);
              _var.x_axis.exit().remove();
              _var.x_axis = _var.x_axis.enter().append('g').attr("class", "x axis").merge(_var.x_axis);

              if (chartType == 'linear') {
                _var.xAxis.ticks(4);
                _var.x_axis.call(_var.xAxis).attr("transform", 'translate(0,' + (_var.height + 3) + ')')
                  .selectAll(".tick text")
                  .style('fill','#1D1D1B')
                  .attr('font-size', '14px')
                  .html((d) => `<tspan  x=0> ${d}</tspan>`);
              }

              // Get ticks for y
              type = 'y';
              y_ticks = main('run');

              // Create and update Y axis
              _var.y_axis = _var.g.selectAll(".y.axis").data(['y']);
              _var.y_axis.exit().remove();
              _var.y_axis = _var.y_axis.enter().append('g').attr("class", "y axis").merge(_var.y_axis);
              _var.y_axis.call(_var.yAxis.tickValues(y_ticks));
              _var.xGrid = _var.g.append('g');
                x_ticks.forEach((xVal) => {
               return _var.xGrid.append('line')
                .attr('x1', xVal)
                .attr('x2', xVal)
                .attr('y1', 0)
                .attr('y2', _var.height)
                  .attr('stroke', 'black')
                  .attr('stroke-width', '1px')
              });

              if (chartType == 'linear') {
                //style the y ticks
                _var.y_axis.selectAll(".tick text").style('fill','#1D1D1B').attr('font-size', '14px').text(d => (`${d}%`));
              }

              // Path domain first
              _var.y_axis.selectAll('.domain, .tick').sort(d3.ascending);

              break;

            case 'ticks':

              switch (type) {

                case 'x':

                  // Get number of bins, size and ticks
                  var bins = d3.max([3, parseInt(_var.width / 100, 10)]);
                  var size = (_var.x.domain()[1] - _var.x.domain()[0]) / bins;
                  var ticks = [];

                  // Generate bins
                  __range__(0, bins, true).forEach(function (d, i) { ticks.push(_var.x.domain()[0] + size * i); });

                  return ticks;

                case 'y':

                  // Get number of bins, size and ticks
                  var bins = d3.max([3, parseInt((_var.height - 40) / 40, 10)]);
                  var size = Math.abs(_var.y.domain()[1] - _var.y.domain()[0]) / bins;
                  var ticks = [];

                  // Generate bins
                  __range__(0, bins, true).forEach(function (d, i) { ticks.push((_var.y.domain()[0] + size * i)); });

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
  ['_var', 'animation', 'action', 'ticks', 'type', 'chartType'].forEach(function (key) {

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

// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var data = [];

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

        // Build entire visualizations
        case 'run':

          // Define aggregation method based on json data
          _var.yAggregation = _var.data.y != null && _var.data.y.aggregation != null && ['sum','mean','median','may','min'].indexOf(_var.data.y.aggregation) !== -1 ? _var.data.y.aggregation : 'mean';

          // Initialize scale
          _var.y = d3.scaleLinear().range([_var.height, 0]);

          // Define aux variables
          var min = null,
              max = null,
              diff = null,
              values = { pos: [], neg: [], all: [], aggrPos: null, aggrNeg: null, aggrAll: null };

          // Get bounds
          data.forEach(function(d) {
            d.values.forEach(function(v) {
              if(min == null || min > +v.y) { min = +v.y; }
              if(max == null || max < +v.y) { max = +v.y; }

              // Add v.y to values so the aggregation values can be calculated
              if(+v.y >= 0) { values.pos.push(+v.y); }
              if(+v.y < 0)  { values.neg.push(+v.y); }
              values.all.push(+v.y);
            });
          });

          // Aggregate values for all elements
          values.aggrAll = d3[_var.yAggregation](values.pos);

          // If sum, get maximum sum of positive values and minimum sum of negative values as domain
          if(_var.yAggregation === 'sum') {
            values.aggrPos = d3[_var.yAggregation](values.pos);
            values.aggrNeg = d3[_var.yAggregation](values.pos);
            if(values.aggrNeg !== 0 && min > values.aggrNeg) { min = values.aggrNeg; }
            if(values.aggrPos !== 0 && max < values.aggrPos) { max = values.aggrPos; }
          } else {
            if(values.aggrAll !== 0 && min > values.aggrAll) { min = values.aggrAll; }
            if(values.aggrAll !== 0 && max < values.aggrAll) { max = values.aggrAll; }
          }

          // Get axis target
          if(_var.data.y != null && _var.data.y.target != null && !isNaN(+_var.data.y.target)) {
            _var.yTarget = +_var.data.y.target;
            if(min == null || min > +_var.data.y.target) { min = +_var.data.y.target; }
            if(max == null || max < +_var.data.y.target) { max = +_var.data.y.target; }
          }

          // Check for default values
          if(isNaN(min)) { min = 0; }
          if(isNaN(max)) { max = 1; }

          // Get diff
          var diff = Math.abs(max - min) === 0 ? Math.abs(max * 0.1) : Math.abs(max - min) * 0.05;

          // Add dot fix offset
          var dotFix = 20 * Math.abs((max + diff) - (min == 0 ? min : min - diff)) / _var.height;
          min = min - dotFix;
          max = max + dotFix;

          // Set x domain
          _var.yBounds = [min, max]; //(min == 0 ? min : min - diff), max + diff];
          _var.y.domain(_var.yBounds).nice();

          // Set format
          _var.yFormat = shared.helpers.number.parseFormat(_var.data == null ? null : _var.data.y);

          // Get y axis ticks
          var bins = d3.max([3, parseInt(_var.height / 25, 10)]);

          // Define y axis
          _var.yAxis = d3.axisLeft(_var.y).ticks(bins).tickPadding(10).tickFormat(_var.yFormat);

          // Update margin left and width
          _var.width += _var.margin.left;
          _var.margin.left = 5 + d3.max(_var.yAxis.scale().ticks().map(function(d) { return shared.helpers.text.getSize(_var.yFormat(d)); }));
          _var.width -= _var.margin.left;

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','data'].forEach(function (key) {

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

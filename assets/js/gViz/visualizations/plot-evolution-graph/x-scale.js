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
          _var.xAggregation = _var.data.x != null && _var.data.x.aggregation != null && ['sum','mean','median','max','min'].indexOf(_var.data.x.aggregation) !== -1 ? _var.data.x.aggregation : 'mean';

          // Define scale
          _var.x = d3.scaleLinear().range([0, _var.width]);

          // Define aux variables
          var min = null,
              max = null,
              diff = null,
              values = { pos: [], neg: [], all: [], aggrPos: null, aggrNeg: null, aggrAll: null };

          // Get bounds
          data.forEach(function(d) {
            d.values.forEach(function(v) {
              if(min == null || min > +v.x) { min = +v.x; }
              if(max == null || max < +v.x) { max = +v.x; }

              // Add v.x to values so the aggregation values can be calculated
              if(+v.x >= 0) { values.pos.push(+v.x); }
              if(+v.x < 0)  { values.neg.push(+v.x); }
              values.all.push(+v.x);
            });
          });

          // Aggregate values for all elements
          values.aggrAll = d3[_var.xAggregation](values.pos);

          // If sum, get maximum sum of positive values and minimum sum of negative values as domain
          if(_var.xAggregation === 'sum') {
            values.aggrPos = d3[_var.xAggregation](values.pos);
            values.aggrNeg = d3[_var.xAggregation](values.pos);
            if(values.aggrNeg !== 0 && min > values.aggrNeg) { min = values.aggrNeg; }
            if(values.aggrPos !== 0 && max < values.aggrPos) { max = values.aggrPos; }
          } else {
            if(values.aggrAll !== 0 && min > values.aggrAll) { min = values.aggrAll; }
            if(values.aggrAll !== 0 && max < values.aggrAll) { max = values.aggrAll; }
          }

          // Get axis target
          if(_var.data.x != null && _var.data.x.target != null && !isNaN(+_var.data.x.target)) {
            _var.xTarget = +_var.data.x.target;
            if(min == null || min > +_var.data.x.target) { min = +_var.data.x.target; }
            if(max == null || max < +_var.data.x.target) { max = +_var.data.x.target; }
          }

          // Check for default values
          if(isNaN(min)) { min = 0; }
          if(isNaN(max)) { max = 1; }

          // Get diff
          var diff = Math.abs(max - min) === 0 ? Math.abs(max * 0.1) : 0;

          // Add dot fix offset
          var dotFix = 20 * Math.abs((max + diff) - (min == 0 ? min : min - diff)) / _var.width;
          min = min - dotFix;
          max = max + dotFix;

          // Set x domain
          _var.x.domain([(min == 0 ? min : min - diff), max + diff]).nice();

          // Set format
          _var.xFormat = shared.helpers.number.parseFormat(_var.data == null ? null : _var.data.x);

          // Get x axis ticks
          var bins = d3.max([3, parseInt(_var.width / 100, 10)]);

          // Define axis
          _var.xAxis = d3.axisBottom(_var.x).ticks(bins).tickPadding(10).tickFormat(_var.xFormat);

          // Store _x scale
          if(_var._x == null) { _var._x = _var.x; }

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

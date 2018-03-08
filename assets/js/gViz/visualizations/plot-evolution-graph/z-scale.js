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
          _var.zAggregation = _var.data.z != null && _var.data.z.aggregation != null && ['sum','mean','median','max','min'].indexOf(_var.data.z.aggregation) !== -1 ? _var.data.z.aggregation : 'mean';

          // Initialize scale
          _var.z = d3.scaleLinear().range([5, 20]);

          // Define aux variables
          var min = null,
              max = null,
              diff = null,
              values = { pos: [], neg: [], all: [], aggrPos: null, aggrNeg: null, aggrAll: null };

          // Get bounds
          data.forEach(function(d) {
            d.values.forEach(function(v) {
              if(min == null || min > +v.z) { min = +v.z; }
              if(max == null || max < +v.z) { max = +v.z; }

              // Add v.z to values so the aggregation values can be calculated
              if(+v.z >= 0) { values.pos.push(+v.z); }
              if(+v.z < 0)  { values.neg.push(+v.z); }
              values.all.push(+v.z);
            });
          });

          // Aggregate values for all elements
          values.aggrAll = d3[_var.zAggregation](values.pos);

          // If sum, get maximum sum of positive values and minimum sum of negative values as domain
          if(_var.zAggregation === 'sum') {
            values.aggrPos = d3[_var.zAggregation](values.pos);
            values.aggrNeg = d3[_var.zAggregation](values.pos);
            if(values.aggrNeg !== 0 && min > values.aggrNeg) { min = values.aggrNeg; }
            if(values.aggrPos !== 0 && max < values.aggrPos) { max = values.aggrPos; }
          } else {
            if(values.aggrAll !== 0 && min > values.aggrAll) { min = values.aggrAll; }
            if(values.aggrAll !== 0 && max < values.aggrAll) { max = values.aggrAll; }
          }

          // Check for default values
          if(isNaN(min)) { min = 0; }
          if(isNaN(max)) { max = 1; }

          // Get diff
          var diff = Math.abs(max - min) === 0 ? Math.abs(max * 0.1) : 0;

          // Set x domain
          _var.zBounds = [(min == 0 ? min : min - diff), max + diff];
          _var.z.domain(_var.zBounds);

          // Set format
          _var.zFormat = shared.helpers.number.parseFormat(_var.data == null ? null : _var.data.z);

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

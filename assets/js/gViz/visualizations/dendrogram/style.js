// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var animation = 900;

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

          // Set stroke style function
          _var.strokeStyle = function(d) {
            if(d.data.strokeStyle === "dotted") { return "2,2"; }
            else if(d.data.strokeStyle === "dashed") { return "7,3"; }
            else { return "0,0"; }
          }

          // Set stroke style function
          _var.strokeStyleHtml = function(d) {
            if(d.data.strokeStyle === "dotted" || d.data.strokeStyle === "dashed" || d.data.strokeStyle === "solid" ) { return d.data.strokeStyle; }
            else { return "none"; }
          }

          // Set stroke style function
          _var.strokeColor = function(d) {
            if(d.data.strokeStyle === "dotted" || d.data.strokeStyle === "dashed" || d.data.strokeStyle === "solid" ) { return d.data.strokeColor; }
            else { return d.data.color; }
          }

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'animation'].forEach(function (key) {

    // Attach variables to validation function
    validate[key] = function (_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return validate;
    };

    // Attach variables to main function
    return main[key] = function (_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return main;
    };
  });

  // Executa a funcao chamando o parametro de step
  main.run = _ => main('run');

  return main;
};

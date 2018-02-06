// Imports
var d3 = require("d3");
var common = require("../common");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var data = undefined;
  var _var = undefined;

  // Validate attributes
  let validate = function (step) {
    switch (step) {
      case 'run': {
        if (!data) {
          console.log('valdiation error - data')
        }
        return true;
      };
      default: return false;
    }
  };

  // Main function
  let main = function (step) {

    // Validate attributes if necessary
    if (validate(step)) {
      switch (step) {
        case 'run':
          var layoutType;
          if (data.layoutType) {
            layoutType = data.layoutType;
          }
          //#############################    ASSIGN PROPS _VAR #########################
          _var.layoutType = layoutType;
          break;
      }
    }
    return _var;
  };

  // Expose Global Variables
  ['_id', '_var', 'data'].forEach(function (key) {

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

  // Execute the specific called function
  main.run = _ => main('run');

  return main;
};





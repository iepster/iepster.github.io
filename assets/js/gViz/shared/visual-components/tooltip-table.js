// Imports
var d3 = require("d3");
var helpers = require("../helpers/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var        = undefined;
  var action      = "show";
  var body        = "#333";
  var borderColor = "#333";
  var backgroundColor = null;
  var color       = "#333";
  var content     = "";
  var hasImg      = false;
  var left        = 0;
  var muted       = false;
  var obj         = {};
  var target      = null;
  var title       = 0;
  var top         = null;
  var bottom      = null;

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

            // Show tooltip
            case 'show':
            case 'updateLocation':

              // If is muted
              if(muted) { obj.color = "#666"; color = "#666"; borderColor = "#666"; }

              // Set title content
              title = title == null || title.constructor !== Array ? [] : title;
              title = title.map(function(t, i) {

                return "<div class='node-header' style='color: {{color}}; background-color: " + (backgroundColor == null ? (helpers.colors.isDark(obj.color) ? "#FFF" : "#434343") : backgroundColor) + "; "+( i !== 0 ? 'border-top: 1px solid {{color}}' : '')+"'>" + t + "</div>";

              }).join('');

              // Set body content
              body = body == null || body.constructor !== Array ? [] : body;
              body = body.map(function(d) { return "<div class='node-edge' style='border-top: 1px solid " + borderColor + "; background-color: " + (backgroundColor == null ? "{{color}}" : backgroundColor) + "; color: " + (backgroundColor == null ? (helpers.colors.isDark(obj.color) ? "#FFF" : "#434343") : "{{color}}") + ";'>" + d + "</div>"; }).join('');

              // Join content
              content = helpers.text.replaceVariables(title, obj) + helpers.text.replaceVariables(body, obj);

              // Update tooltip content
              target
                .style("border", "1px solid "+borderColor)
                .style("left", left == null ? null : left + "px")
                .style("top", top == null ? null : top + "px")
                .style("bottom", bottom == null ? null : bottom + "px")
                .html(content)

              break;

            // Hide and remove tooltip
            case 'hide':

              // Hide & Remove
              target
                .style("border", "none")
                .html('');

              break;

          }
          break;
      }
    }
  };

  // Exposicao de variaveis globais
  ['_var','action','body','borderColor','backgroundColor','color','hasImg','left','muted','obj','target','top','bottom','title'].forEach(function(key) {

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

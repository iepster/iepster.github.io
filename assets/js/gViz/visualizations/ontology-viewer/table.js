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

          // Get hashed node
          if(node != null) { _node = _var._data.nodes[node.id]; }

          // Initialize html table string
          var t = (_var.data.node != null && _var.data.node.title != null && _var.data.node.title !== "" ? _var.data.node.title : "Showing properties") + " of";
          var table = "<div class='axis-title' style='background-color:"+node.color+"; color:"+(shared.helpers.colors.isDark(node.color) ? "#FFF" : "#434343")+"; border: 1px solid "+node.color+";'>"+t+"</div>";
          table += "<div class='node-header' style='color:"+node.color+"; background-color:"+(shared.helpers.colors.isDark(node.color) ? "#FFF" : "#434343")+"; border: 1px solid "+node.color+";'>"+node.name+"</div>";

          // Iterate over nodes
          _var.data.data.nodes.forEach(function(d) {

            // Get hashed node
            var n = _var._data.nodes[d.id];

            // Set value
            n._value = _var._clicked == null || _var._clicked.id === d.id ? n.value : (_var._clicked.outEdges[n.id] == null ? 0 : +_var._clicked.outEdges[n.id].value);

            // If its a neighbour
            if(node.outEdges[n.id] != null) {

              // Fill table content
              table += "<div class='node-edge' data-node-id='"+n.id+"'>";
              table += shared.helpers.text.replaceVariables("<span class='metric'>"+_var.data.table.name+"</span>", n);
              table += "<span class='number'>"+(_var.nodeFormat(+shared.helpers.text.replaceVariables(_var.data.table.value, n)))+"</span>";
              table += "</div>";

            }

          });

          // Update tooltip table
          _var.container.d3.closest('.gViz-outer-wrapper').select('.gViz-ontology-viewer-table-tooltip').html(table);

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

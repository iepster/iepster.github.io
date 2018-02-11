// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = null;

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

          // Backup data
          if(_var._data == null) { var _dataBkp = { nodes: {}, links: {} }; }
          else { var _dataBkp = _var._data; }

          // Initialize hash
          _var._data = { nodes: {}, links: {} };

          // Iterate over nodes
          _var.data.data.nodes.forEach(function(d) {

            // Set color
            if(d.color == null) { d.color = _var.colors.d3(d.id); }

            // Set stroke attrs
            if(d.strokeColor == null) { d.strokeColor = "#FFF"; }

            // Set neighbours
            d.outEdges = {};
            d.inEdges = {};

            // Initialize radius
            d.value = 0;
            d._value = 0;

            // Store x and y
            if(_dataBkp.nodes[d.id] != null) {
              d.x = _dataBkp.nodes[d.id].x;
              d.y = _dataBkp.nodes[d.id].y;
            }

            // Store node
            _var._data.nodes[d.id] = d;

          });

          // Filter links
          _var.data.data.links =_var.data.data.links.filter(function(d) {
            return _var._data.nodes[d.source] != null && _var._data.nodes[d.target] != null;
          });

          // Iterate over links
          _var.data.data.links.forEach(function(d) {

            // Set color
            if(d.color == null) { d.color = "#DDD"; }
            if(d.style == null) { d.style = "solid"; }

            // Store neighbour
            _var._data.nodes[d.source].outEdges[d.target] = d;
            _var._data.nodes[d.target].inEdges[d.source] = d;

            // Increase radius
            _var._data.nodes[d.source].value += +d.value;
            _var._data.nodes[d.target].value += +d.value;
            _var._data.nodes[d.source]._value += +d.value;
            _var._data.nodes[d.target]._value += +d.value;

            // Set id
            d.id = shared.helpers.text.removeSpecial(d.source + "----" + d.target);

            // Set values
            _var._data.links[d.id] = d;

          });

          // Remove _dataBkp
          _dataBkp = null;

          // Set _clicked element
          _var._clicked = _var.clicked == null ? null : _var._data.nodes[_var.clicked];

          // Sort nodes
          _var.data.data.nodes = _var.data.data.nodes.sort(function(a,b) { return d3.descending(+_var.nodeRadius(a), +_var.nodeRadius(b)); });

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var'].forEach(function (key) {

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

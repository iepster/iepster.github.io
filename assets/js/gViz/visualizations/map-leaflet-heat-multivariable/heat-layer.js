// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");
var HeatmapOverlay = require("leaflet-heatmap");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;

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

        case 'run':

          // Creates layer if it does not exist
          _var.heatLayer = _var.heatLayer ? _var.heatLayer : L.layerGroup().addTo(_var.map);

          // Initializes gradient
          var gradient = {
            0.0: _var.heatScale(0.0),
            0.1: _var.heatScale(0.1),
            0.2: _var.heatScale(0.2),
            0.3: _var.heatScale(0.3),
            0.4: _var.heatScale(0.4),
            0.5: _var.heatScale(0.5),
            0.6: _var.heatScale(0.6),
            0.7: _var.heatScale(0.7),
            0.8: _var.heatScale(0.8),
            0.9: _var.heatScale(0.9),
            1.0: _var.heatScale(1.0),
          };

          // HeatMap Overlay configuration
          var cfg = {
            "radius": 20,
            "maxOpacity": .8,
            "useLocalExtrema": false,
            latField: 'lat',
            lngField: 'lng',
            valueField: 'count',
            gradient: gradient
          };

          // Data to be plotted
          var points = _var.data.data["heat"].data.map(function(d) {
            return {
              "lat": d["lat"],
              "lng": d["lon"],
              "count": parseFloat(d["value"])
            };
          });

          points = {
            "max": d3.max(points, function(d) { return d["count"]; }),
            "data": points
          };

          _var.heat = new HeatmapOverlay(cfg);

          if(_var.mode["heat"] === true) { _var.heatLayer.addLayer(_var.heat); }
          else { _var.heatLayer.clearLayers(); }

          _var.heat.setData(points);

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

// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  let _id = undefined;
  let _var = undefined;
  let animation = 900;
  let container = undefined;
  var colors = { main: shared.helpers.colors.main, aux: shared.helpers.colors.aux };
  let data = [];
  let height = undefined;
  let margin = { top: 10, right: 10, bottom: 10, left: 10 };
  let width = undefined;
  let chartType = undefined;
  let legendTopPos = undefined;
  let textColor = undefined;

  // Validate attributes
  let validate = function (step) {
    switch (step) {
      case 'run':
        if (!chartType) console.log('err - chartType')
        if (!textColor) console.log('err - textColor')
        if (!data.length) console.log('err - data')
        return true;
      default: return false;
    }
  };

  // Main function
  let main = function (step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'run':

          // Initialize variables
          if (!_var) { _var = {}; }
          _var._id = _id;
          _var.animation = animation;
          _var.colors = colors;
          _var.data = data;
          _var.margin = margin;
          _var.legendTopPos = legendTopPos;
          _var.textColor = textColor;

          _var.margin.top += 40;
          _var.legendTopPos -= 40;

          if (chartType == 'linear') {
            _var.textColor = '#1D1D1B';
          }


          //calculate sums
          data.forEach(e => e.total = d3.sum(e.values, v => v.value))


          // Get container
          _var.container = { selector: container, d3: d3.select(container), el: (typeof container === 'string' || container instanceof String) ? container : d3.select(container).node() };

          // Define height and width
          _var.height = ((height != null) ? height : _var.container.d3.node().getBoundingClientRect().height) - 4 - (_var.margin.top + _var.margin.bottom);
          _var.width = ((width != null) ? width : _var.container.d3.node().getBoundingClientRect().width) - 4 - (_var.margin.left + _var.margin.right);

          // Scales
          _var.x = d3.scaleTime().range([0, _var.width]);
          _var.y = d3.scaleLinear().range([_var.height, 0]);

          // Axis
          _var.xAxis = d3.axisBottom(_var.x).tickPadding(15).tickSize(-_var.height);
          _var.yAxis = d3.axisLeft(_var.y).tickPadding(10).tickSize(-_var.width);

          // Initialize area constructor
          _var.areaConstructor = d3.area()
            .x(function (d) { return _var.x(d.date); })
            .y0(_var.height)
            .y1(function (d) { return _var.y(d.value); })
            .curve(d3.curveMonotoneX);

          // Initialize line constructor
          _var.lineConstructor = d3.line()
            .x(function (d) { return _var.x(d.date); })
            .y(function (d) { return _var.y(d.value); });

          switch (chartType) {
            case 'linear':
              _var.lineConstructor.curve(d3.curveLinear);
              break;
            case 'curved':
              _var.lineConstructor.curve(d3.curveMonotoneX);
              break;
          }




          _var.linearLineConstructor = d3.line()
            .x(function (d) { return _var.x(d.date); })
            .y(function (d) { return _var.y(d.value); })
            .curve(d3.curveLinear);




          // Set attribute _id to container
          _var.container.d3.attr('data-vis-id', _var._id);


          _var.replaceWithProps = function (text, obj) {
            var keys = Object.keys(obj)
            keys.forEach(key => {
              var stringToReplace = `{${key}}`;
              var re = new RegExp(stringToReplace, 'g');
              text = text.replace(re, obj[key]);
            })
            return text;
          }

          break;
      }
    }

    return _var;
  };

  // Expose global variables
  ['_id', '_var', 'animation', 'container', 'colors', 'data', 'height', 'margin', 'scale', 'width', 'sumLevel', 'zHeight', 'zWidth', 'chartType', 'legendTopPos', 'textColor'].forEach(function (key) {

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

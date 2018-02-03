// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

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

        // Build entire visualizations
        case 'run':

          switch (_var.tAxis.type) {

            // Build entire visualizations
            case 'time':

              // Time extent
              var extent = [null, null];

              // Get quarter function
              var getQuarter = function(month) {
                if(+month <= 3) { return "1"; }
                else if(+month >= 4 && +month <= 6) { return "2"; }
                else if(+month >= 7 && +month <= 9) { return "3"; }
                else if(+month >= 10) { return "4"; }
              }

              // Get quarter function
              var getWeekM = function(day) {
                if(+day <= 7) { return "1"; }
                else if(+day >= 8 && +day <= 14) { return "2"; }
                else if(+day >= 15 && +day <= 21) { return "3"; }
                else if(+day >= 22) { return "4"; }
              }

              var getMonthName = function(date, format="%Y-%m", mFormat="%b") {
                return d3.timeFormat(mFormat)(d3.timeParse(format)(date));
              }

              // Get time extent
              _var.data.data.forEach(function(d) {
                d.values.forEach(function(v) {

                  // Parse time data
                  if(v._t == null) { v._t = d3.timeParse(_var.tAxis.format)(v.t); }

                  // Get time params
                  v._year    = d3.timeFormat("%Y")(v._t);
                  v._quarter = getQuarter(d3.timeFormat("%m")(v._t));
                  v._month   = d3.timeFormat("%m")(v._t);
                  v._week    = d3.timeFormat("%W")(v._t);
                  v._weekM   = getWeekM(d3.timeFormat("%d")(v._t));
                  v._day     = d3.timeFormat("%d")(v._t);
                  v._hour    = d3.timeFormat("%H")(v._t);
                  v._minute  = d3.timeFormat("%M")(v._t);
                  v._second  = d3.timeFormat("%S")(v._t);
                  v._tValue  = v._t.getTime();

                  // Get bounds
                  if(extent[0] == null || v._t < extent[0]._t) { extent[0] = v; }
                  if(extent[1] == null || v._t > extent[1]._t) { extent[1] = v; }

                });
              });

              // Define the unit
              var totalWidth = (_var.width + _var.margin.left + _var.margin.right - 2*_var.margin.tOffset);
              //if(totalWidth/shared.helpers.date.helpers.diff(extent[1]._t,extent[0]._t,'second') > 10) { _var.tAxis.unit = 6; }
              //else if(totalWidth/shared.helpers.date.helpers.diff(extent[1]._t,extent[0]._t,'minute') > 10) { _var.tAxis.unit = 5; }
              //else if(totalWidth/shared.helpers.date.helpers.diff(extent[1]._t,extent[0]._t,'hour') > 10) { _var.tAxis.unit = 4; }
              //else if(totalWidth/shared.helpers.date.helpers.diff(extent[1]._t,extent[0]._t,'day') > 10) { _var.tAxis.unit = 3; }
              if     (totalWidth/shared.helpers.date.helpers.diff(extent[1]._t,extent[0]._t,'week') > 16) { _var.tAxis.unit = 2; }
              else if(totalWidth/shared.helpers.date.helpers.diff(extent[1]._t,extent[0]._t,'month') > 34) { _var.tAxis.unit = 1; }
              else if(totalWidth/shared.helpers.date.helpers.diff(extent[1]._t,extent[0]._t,'quarter') > 16) { _var.tAxis.unit = 0; }

              // Initialize variables
              var y0 = extent[0]._year, y1 = extent[1]._year;
              var q0 = extent[0]._quarter, q1 = extent[1]._quarter;
              var m0 = extent[0]._month, m1 = extent[1]._month;
              var w0 = extent[0]._weekM, w1 = extent[1]._weekM;
              var d0 = extent[0]._day, d1 = extent[1]._day;
              var numbers = d3.range(1,61);

              // Initialize root
              _var.root = { id: "Root Node", children: [] };

              // Years
              var years = d3.range(+y0, +y1 + 1);
              var yInd, qInd, mInd, wInd, dInd;

              // Iterate over years
              years.map(function(d) { return d.toString(); }).forEach(function(y) {

                // Set year and get index
                yInd = _var.root.children.findIndex(function(d) { return d.id === y; });
                if(yInd === -1) {

                  // Define obj
                  var yObj = {
                    id: 'Y' + y,
                    type: 'year',
                    label: 'Y',
                    name: y,
                    values: [(new Date(+y, 0, 1)).getTime(), (new Date(+y, 12, 0)).getTime()],
                    children: []
                  };

                  // Store year obj
                  _var.root.children.push(yObj);

                  // Get index
                  yInd = _var.root.children.length-1;
                }

                if(_var.tAxis.unit >= 0) {

                  // Quarters
                  var quarters = numbers.slice(0,4);
                  if(y === y0 && y === y1) { quarters = numbers.slice(+q0-1, +q1); }
                  else if(y === y0) { quarters = numbers.slice(+q0-1, 4); }
                  else if(y === y1) { quarters = numbers.slice(0, +q1); }

                  // Iterate over quarters
                  quarters.map(function(d) { return d.toString(); }).forEach(function(q) {

                    // Set quarter and get index
                    qInd = _var.root.children[yInd].children.findIndex(function(d) { return d.id === q; });
                    if(qInd === -1) {

                      // Define obj
                      var qObj = {
                        id: 'Y'+y+'Q'+q,
                        type: 'quarter',
                        label: 'Q',
                        name: 'Q'+q,
                        values: [(new Date(y,(3 * (+q-1)), 1)).getTime(), (new Date(y, (3 * (+q-1) + 3), 0)).getTime()],
                        children: []
                      };

                      // Store quarter obj
                      _var.root.children[yInd].children.push(qObj);

                      // Get index
                      qInd = _var.root.children[yInd].children.length-1;

                      // Set value
                      if(_var.tAxis.unit === 0) { _var.root.children[yInd].children[qInd].v = 1; }
                    }

                    if(_var.tAxis.unit >= 1) {

                      // Months
                      var months = numbers.slice(3 * (+q-1), 3 * (+q-1) + 3);
                      if(y === y0 && y === y1 && q === q0 && q === q1) { months = numbers.slice(+m0-1, +m1); }
                      else if(y === y0 && q === q0) { months = numbers.slice(+m0-1, 3 * (+q-1) + 3); }
                      else if(y === y1 && q === q1) { months = numbers.slice(3 * (+q-1), +m1); }

                      // Iterate over months
                      months.map(function(d) { return d.toString().length === 1 ? ("0" + d.toString()) : d.toString(); }).forEach(function(m) {

                        // Set month and get index
                        mInd = _var.root.children[yInd].children[qInd].children.findIndex(function(d) { return d.id === m; });
                        if(mInd === -1) {

                          // Define obj
                          var mObj = {
                            id: 'Y'+y+'Q'+q+'M'+m,
                            type: 'month',
                            label: 'M',
                            name: getMonthName(y+'-'+m),
                            values: [(new Date(+y, +m-1, 1)).getTime(), (new Date(+y, +m, 0)).getTime()],
                            children: []
                          };

                          // Store month obj
                          _var.root.children[yInd].children[qInd].children.push(mObj);

                          // Get index
                          mInd = _var.root.children[yInd].children[qInd].children.length-1;

                          // Set value
                          if(_var.tAxis.unit === 1) { _var.root.children[yInd].children[qInd].children[mInd].v = 1; }
                        }

                        if(_var.tAxis.unit >= 2) {

                          // Weeks
                          var weeks = numbers.slice(0, 4);
                          if(y === y0 && y === y1 && q === q0 && q === q1 && m === m0 && m === m1) { weeks = numbers.slice(+w0-1, +w1); }
                          else if(y === y0 && q === q0 && m === m0) { weeks = numbers.slice(+w0-1, 4); }
                          else if(y === y1 && q === q1 && m === m1) { weeks = numbers.slice(0, +w1); }

                          // Iterate over weeks
                          weeks.map(function(d) { return d.toString(); }).forEach(function(w) {

                            // Set weekand get index
                            wInd = _var.root.children[yInd].children[qInd].children[mInd].children.findIndex(function(d) { return d.id === w; });
                            if(wInd === -1) {

                              var wObj = {
                                id: 'Y'+y+'Q'+q+'M'+m+'W'+w,
                                type: 'week',
                                label: 'W',
                                name: 'W'+w,
                                values: [(new Date(+y, +m-1, (7 * (+w-1) + 1))).getTime(),
                                  (+w !== 4 ? new Date(+y, +m-1, (7 * (+w-1) + 7)) : new Date(+y, +m, 0)).getTime()
                                ],
                                children: []
                              };

                              // Store obj
                              _var.root.children[yInd].children[qInd].children[mInd].children.push(wObj);

                              // Get index
                              wInd = _var.root.children[yInd].children[qInd].children[mInd].children.length-1;

                              // set value
                              if(_var.tAxis.unit === 2) { _var.root.children[yInd].children[qInd].children[mInd].children[wInd].v = 1; }
                            }

                          });
                        }
                      });
                    }
                  });
                }
              });

              // Copy root
              _var._root = _var.root;

              // Update tSize
              _var.margin.tSize = _var.tAxis.height * (_var.tAxis.unit + 3);

              // Update height and width
              _var.height -= _var.margin.tSize;

              break;

          }
          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var'].forEach(function (key) {

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

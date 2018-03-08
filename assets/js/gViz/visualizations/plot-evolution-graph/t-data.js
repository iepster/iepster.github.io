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
              var hasLevels = _var.data != null && _var.data.t != null && _var.data.t.levels != null && _var.data.t.levels.length !== 0;
              var years = d3.range(+y0, +y1 + 1);
              var yInd, qInd, mInd, wInd, dInd;
              var yVisible = !hasLevels || _var.data.t.levels.indexOf('year') !== -1;
              var qVisible = !hasLevels || _var.data.t.levels.indexOf('quarter') !== -1;
              var mVisible = !hasLevels || _var.data.t.levels.indexOf('month') !== -1;
              var wVisible = !hasLevels || _var.data.t.levels.indexOf('week') !== -1;

              // Iterate over years
              years.map(function(d) { return d.toString(); }).forEach(function(y) {

                if(yVisible) {

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
                    yInd = _var.root.children.length-1;
                    if(!qVisible && !mVisible && !wVisible) { _var.root.children[yInd].v = 1; }
                  }
                }

                if(_var.tAxis.unit >= 0) {

                  // Quarters
                  var quarters = numbers.slice(0,4);
                  if(y === y0 && y === y1) { quarters = numbers.slice(+q0-1, +q1); }
                  else if(y === y0) { quarters = numbers.slice(+q0-1, 4); }
                  else if(y === y1) { quarters = numbers.slice(0, +q1); }

                  // Iterate over quarters
                  quarters.map(function(d) { return d.toString(); }).forEach(function(q) {

                    if (qVisible) {

                      // Set quarter and get index
                      if(yVisible) { qInd = _var.root.children[yInd].children.findIndex(function(d) { return d.id === q; });
                      } else { qInd = _var.root.children.findIndex(function(d) { return d.id === q; }); }

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

                        // Store quarter obj, get index and set value
                        if(yVisible) {
                          _var.root.children[yInd].children.push(qObj);
                          qInd = _var.root.children[yInd].children.length-1;
                          if(_var.tAxis.unit === 0 || (!mVisible && !wVisible)) { _var.root.children[yInd].children[qInd].v = 1; }
                        } else {
                          _var.root.children.push(qObj);
                          qInd = _var.root.children.length-1;
                          if(_var.tAxis.unit === 0 || (!mVisible && !wVisible)) { _var.root.children[qInd].v = 1; }
                        }
                      }
                    }

                    if(_var.tAxis.unit >= 1) {

                      // Months
                      var months = numbers.slice(3 * (+q-1), 3 * (+q-1) + 3);
                      if(y === y0 && y === y1 && q === q0 && q === q1) { months = numbers.slice(+m0-1, +m1); }
                      else if(y === y0 && q === q0) { months = numbers.slice(+m0-1, 3 * (+q-1) + 3); }
                      else if(y === y1 && q === q1) { months = numbers.slice(3 * (+q-1), +m1); }

                      // Iterate over months
                      months.map(function(d) { return d.toString().length === 1 ? ("0" + d.toString()) : d.toString(); }).forEach(function(m) {

                        if(mVisible) {

                          // Set month and get index
                          if(yVisible && qVisible) {
                            mInd = _var.root.children[yInd].children[qInd].children.findIndex(function(d) { return d.id === m; });
                          } else if(yVisible) {
                            mInd = _var.root.children[yInd].children.findIndex(function(d) { return d.id === m; });
                          } else if(qVisible) {
                            mInd = _var.root.children[qInd].children.findIndex(function(d) { return d.id === m; });
                          } else {
                            mInd = _var.root.children.findIndex(function(d) { return d.id === m; });
                          }

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

                            // Store month obj, get index and set value
                            if(yVisible && qVisible) {
                              _var.root.children[yInd].children[qInd].children.push(mObj);
                              mInd = _var.root.children[yInd].children[qInd].children.length-1;
                              if(_var.tAxis.unit === 1 || !wVisible) { _var.root.children[yInd].children[qInd].children[mInd].v = 1; }
                            } else if(yVisible) {
                              _var.root.children[yInd].children.push(mObj);
                              mInd = _var.root.children[yInd].children.length-1;
                              if(_var.tAxis.unit === 1 || !wVisible) { _var.root.children[yInd].children[mInd].v = 1; }
                            } else if(qVisible) {
                              _var.root.children[qInd].children.push(mObj);
                              mInd = _var.root.children[qInd].children.length-1;
                              if(_var.tAxis.unit === 1 || !wVisible) { _var.root.children[qInd].children[mInd].v = 1; }
                            } else {
                              _var.root.children.push(mObj);
                              mInd = _var.root.children.length-1;
                              if(_var.tAxis.unit === 1 || !wVisible) { _var.root.children[mInd].v = 1; }
                            }
                          }
                        }

                        if(_var.tAxis.unit >= 2) {

                          // Weeks
                          var weeks = numbers.slice(0, 4);
                          if(y === y0 && y === y1 && q === q0 && q === q1 && m === m0 && m === m1) { weeks = numbers.slice(+w0-1, +w1); }
                          else if(y === y0 && q === q0 && m === m0) { weeks = numbers.slice(+w0-1, 4); }
                          else if(y === y1 && q === q1 && m === m1) { weeks = numbers.slice(0, +w1); }

                          // Iterate over weeks
                          weeks.map(function(d) { return d.toString(); }).forEach(function(w) {

                            if(wVisible) {

                              // Set weekand get index
                              if(yVisible && qVisible && mVisible) {
                                wInd = _var.root.children[yInd].children[qInd].children[mInd].children.findIndex(function(d) { return d.id === w; });
                              } else if(yVisible && qVisible) {
                                wInd = _var.root.children[yInd].children[qInd].children.findIndex(function(d) { return d.id === w; });
                              } else if(yVisible && mVisible) {
                                wInd = _var.root.children[yInd].children[mInd].children.findIndex(function(d) { return d.id === w; });
                              } else if(qVisible && mVisible) {
                                wInd = _var.root.children[qInd].children[mInd].children.findIndex(function(d) { return d.id === w; });
                              } else if(qVisible) {
                                wInd = _var.root.children[qInd].children.findIndex(function(d) { return d.id === w; });
                              } else if(mVisible) {
                                wInd = _var.root.children[mInd].children.findIndex(function(d) { return d.id === w; });
                              } else {
                                wInd = _var.root.children.findIndex(function(d) { return d.id === w; });
                              }

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

                                // Store obj, get index and set value
                                if(yVisible && qVisible && mVisible) {
                                  _var.root.children[yInd].children[qInd].children[mInd].children.push(wObj);
                                  wInd = _var.root.children[yInd].children[qInd].children[mInd].children.length-1;
                                  if(_var.tAxis.unit === 2) { _var.root.children[yInd].children[qInd].children[mInd].children[wInd].v = 1; }
                                } else if(yVisible && qVisible) {
                                  _var.root.children[yInd].children[qInd].children.push(wObj);
                                  wInd = _var.root.children[yInd].children[qInd].children.length-1;
                                  if(_var.tAxis.unit === 2) { _var.root.children[yInd].children[qInd].children[wInd].v = 1; }
                                } else if(yVisible && mVisible) {
                                  _var.root.children[yInd].children[mInd].children.push(wObj);
                                  wInd = _var.root.children[yInd].children[mInd].children.length-1;
                                  if(_var.tAxis.unit === 2) { _var.root.children[yInd].children[mInd].children[wInd].v = 1; }
                                } else if(qVisible && mVisible) {
                                  _var.root.children[qInd].children[mInd].children.push(wObj);
                                  wInd = _var.root.children[qInd].children[mInd].children.length-1;
                                  if(_var.tAxis.unit === 2) { _var.root.children[qInd].children[mInd].children[wInd].v = 1; }
                                } else if(yVisible) {
                                  _var.root.children[yInd].children.push(wObj);
                                  wInd = _var.root.children[yInd].children.length-1;
                                  if(_var.tAxis.unit === 2) { _var.root.children[yInd].children[wInd].v = 1; }
                                } else if(qVisible) {
                                  _var.root.children[qInd].children.push(wObj);
                                  wInd = _var.root.children[qInd].children.length-1;
                                  if(_var.tAxis.unit === 2) { _var.root.children[qInd].children[wInd].v = 1; }
                                } else if(mVisible) {
                                  _var.root.children[mInd].children.push(wObj);
                                  wInd = _var.root.children[mInd].children.length-1;
                                  if(_var.tAxis.unit === 2) { _var.root.children[mInd].children[wInd].v = 1; }
                                } else {
                                  _var.root.children.push(wObj);
                                  wInd = _var.root.children.length-1;
                                  if(_var.tAxis.unit === 2) { _var.root.children[wInd].v = 1; }
                                }
                              }
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

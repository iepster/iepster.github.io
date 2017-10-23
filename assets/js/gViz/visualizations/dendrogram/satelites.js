// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var       = null;
  var animation  = 900;
  var action     = 'draw';
  var components = null;
  var delay      = 0;
  var node       = null;
  var nodeObj    = null;
  var pRadius    = 16;
  var x          = 0;
  var y          = 0;
  var zoomed     = false;

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

            // Build entire visualizations
            case 'draw':

              // Get node selection
              var nodeSel = d3.select(nodeObj);

              // Get satelites
              var satelites = _var.getSatelites(node, zoomed ? 35 : 5);

              // Insert / Update circle
              //var circle = nodeSel.selectAll('circle.satelite').data(node.data.id === _var.zoomNode ? [] : satelites);
              var circle = nodeSel.selectAll('circle.satelite').data(satelites);
              circle.exit().remove();
              circle = circle.enter().append('circle').attr('class', 'satelite').merge(circle);
              circle
                .transition().duration(animation).delay(node.data.id === _var.zoomNode ? 0 : (delay))
                .attr("transform", function(c, i) { return `translate(${c.satAttrs.x}, ${c.satAttrs.y})`; })
                .attr("r", 1.7)
                .style('opacity', 1)
                .style('fill', function(d) { return d.data.color; })

              // Insert / Update path
              var path = nodeSel.selectAll('path.satelite').data([{ id: node.data.id, satelites: satelites}], function(d) { return d.id; });
              path.exit().remove();
              path = path.enter().insert('path', ':first-child').attr('class', 'satelite').style('fill', 'transparent').merge(path);
              path
                .attr('stroke-width', 1 / _var.scale)
                .style('fill', 'transparent')
                .style('opacity', node.data.id === _var.zoomNode ? 1 : 0)
                .transition().duration(animation).delay(node.data.id === _var.zoomNode ? 0 : (delay))
                .attr("d", function(d, i) {
                  var s = d.satelites;
                  if(s.length <= 2) {
                    var cx = 0, cy = 0, r = _var.attrs.satelites.s.toFixed(3);
                    return `M ${cx} ${cy} m ${-r}, 0 a ${r},${r} 0 1,0 ${(r * 2)},0 a ${r},${r} 0 1,0 ${-(r * 2)},0`;
                  } else if(s.length > 2 && s.length <= 8) {
                    var points = s.map(function(p) { return `${p.satAttrs.x} ${p.satAttrs.y}`; }).join(' ');
                    return `M ${points} Z`;
                  } else {
                    var points = s.map(function(p) {
                      var index = p.satAttrs.index;
                      var indexP1 = index+8, indexP2 = index+16, indexP3 = index === 0 ? 15 : (index+(p.satAttrs.lvl % 2 === 1 ? 9 : 7)), indexP4 = index+1;
                      var p0 = `${p.satAttrs.x} ${p.satAttrs.y}`;
                      var p1 = s[indexP1] == null ? "" : `${s[indexP1].satAttrs.x} ${s[indexP1].satAttrs.y}`;
                      var p2 = s[indexP2] == null ? "" : `${s[indexP2].satAttrs.x} ${s[indexP2].satAttrs.y}`;
                      var p3 = s[indexP3] == null ? "" : `${s[indexP3].satAttrs.x} ${s[indexP3].satAttrs.y}`;
                      var p4 = index < 8 ? s[indexP4] == null ? "" : `${s[indexP4].satAttrs.x} ${s[indexP4].satAttrs.y}`: '';
                      return ` M ${p0} ${p1} ${p2} ${p0} ${p3} ${p2} ${p0} ${p4}`;
                    }).join(' ');
                    return `${points}`;
                  }
                })
                .style('opacity', 1)

              break

          }
          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','animation','action','delay','components','node','nodeObj','x','y','zoomed'].forEach(function(key) {

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

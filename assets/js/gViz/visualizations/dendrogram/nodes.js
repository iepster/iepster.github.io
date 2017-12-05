// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var       = null;
  var animation  = 900;
  var delay      = 0;
  var action     = 'draw';
  var components = null;
  var bindClick  = true;
  var bindHover  = true;
  var isSatelite = false;
  var mainValue  = false;
  var node       = null;
  var nodeObj    = null;
  var parent     = null;
  var source     = null;
  var radius     = 16;
  var textOffset = -27;
  var x          = null;
  var y          = null;
  var x0         = 0;
  var y0         = 0;
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

            // Create nodes
            case 'draw':

              // Insert / Update node
              var nodeSel = d3.select(nodeObj);

              // Shapes outer group
              var shapesOuterG = nodeSel.selectAll('g.shapes-outer-g').data(["shapes-outer-g"]);
              shapesOuterG.exit().remove();
              shapesOuterG = shapesOuterG.enter().append('g').attr('class', 'shapes-outer-g').merge(shapesOuterG);

              // Shapes group
              var shapesG = shapesOuterG.selectAll('g.shapes-g').data(["shapes-g"]);
              shapesG.exit().remove();
              shapesG = shapesG.enter().append('g').attr('class', 'shapes-g').merge(shapesG);

              // Timer
              node.timer = d3.timer(function() {});
              node.angle = 0;
              node.speed = 100;

              // Bind click
              nodeSel

                // On mouse over
                .on('mouseenter', function(d) {
                  if(bindHover) {

                    // Set mouse over
                    components.events()
                      ._var(_var)
                      .action('mouseover')
                      .nodeSel(nodeSel)
                      .nodeObj(this)
                      .node(d)
                      .run();

                    // Dispatch hover node event
                    _var.hover.fn(d);

                  } else { return null; }

                // On mouse out
                }).on('mouseleave', function(d) {

                    // Set mouse over
                    components.events()
                      ._var(_var)
                      .action('mouseout')
                      .nodeSel(nodeSel)
                      .nodeObj(this)
                      .node(d)
                      .run();

                  // Dispatch hover node event
                  _var.hover.fn(null);

                // On click
                }).on('click', function(d) {

                  // If bind click is set to true
                  if(bindClick && (d.isSum == null || !d.isSum)) {

                    // Set mouse over
                    components.events()
                      ._var(_var)
                      .action('click')
                      .nodeSel(nodeSel)
                      .nodeObj(this)
                      .node(d)
                      .run();

                    // Zoom to specific node
                    components.zoom()
                      ._var(_var)
                      .components(components)
                      .parent(parent)
                      .action('toNode')
                      .node(d.isSum != null && d.isSum ? d.parent : d)
                      .nodeObj(this)
                      .x(x)
                      .y(y)
                      .run();

                    // Remove hover
                    _var.g.selectAll(".node-group, path.link, path.left-link").style('opacity', 1);
                    _var.g.selectAll("path.link").style('opacity', 1);
                    nodeSel.selectAll('.node-s-abbr, .node-link')
                      .style("opacity", function(n) { return n.parent && n.satAttrs && n.satAttrs.lvl >= n.parent.maxSatLvl-1 ? 1 : 0; } )

                    // Dispatch click node event
                    _var.click.fn(d);

                  }

                })
                .attr("transform", function (d) { return "translate(" + (y0) + "," + (x0) + ")"; })
                .transition().duration(animation).delay(delay)
                  .attr("transform", function (d) { return "translate(" + (y) + "," + (x) + ")"; })

              // Insert / Update circle
              var circle = shapesG.selectAll('circle.node').data([node], function (d) { return d.data.id; });
              circle.exit().remove();
              circle = circle.enter().append('circle').attr('class', 'node').merge(circle);
              circle
                .style('opacity', 0)
                .transition().duration(animation).delay(node.data.id === _var.zoomNode ? delay : animation + delay)
                .attr('r', 3 / _var.scale)
                .attr('cursor', 'pointer')
                .style('fill', function(d) { return d.data.color; })
                .style('opacity', 1)

              // Get position for satelite legends
              var leg = {
                text: (isSatelite ? node.satAttrs.textLeg : [0,0]),
                path: (isSatelite && node.satAttrs ? node.satAttrs.pathLeg : [0,0]),
                anchor: "middle"
              };

              // Set anchor
              if(isSatelite && Math.abs(leg.text[0]) > 10) { leg.anchor = leg.text[0] > 0 ? "start" : "end"; }

              // Insert / Update labels for the nodes
              var text = nodeSel.selectAll('text.node-abbr').data(isSatelite ? [] : [node], function (d) { return d.data.id; });
              text.exit().remove();
              text = text.enter().append('text').attr('class', 'node-abbr').merge(text);
              text
                .attr("x", 0).attr('y', 0)
                .attr("text-anchor", leg.anchor )
                .style("opacity", 0)
                .attr("dy", textOffset)
                .transition().duration(animation).delay(delay)
                .style("opacity", 1)
                .style("font-size", `${(zoomed ? 13 : 11) / _var.scale}px`)
                .text(function (d) { return d.data.abbr == null || zoomed ? d.data.name : d.data.abbr; });

              // Insert / Update node values
              var values = mainValue && _var.mainValue && node.data.values && node.data.values[_var.mainValue] ? [node] : [];
              var text = nodeSel.selectAll('text.node-value').data(values, function (d) { return d.data.id; });
              text.exit().remove();
              text = text.enter().append('text').attr('class', 'node-value').merge(text);
              text
                .attr("x", 0 )
                .attr("y", 15 )
                .attr("text-anchor", "middle" )
                .style("opacity", 0)
                .transition().duration(animation).delay(isSatelite ? animation + delay : delay)
                .style("opacity", 1)
                .style("font-size", `${9/_var.scale}px`)
                .style('fill', function(d) { return d.data.color; })
                .text(function (d) { return (isSatelite ? '' : 'Sales ') +shared.helpers.number.localeK(d.data.values[_var.mainValue]); });

              // Insert / Update node year over year
              var values = !isSatelite && mainValue && _var.mainValue && node.data.values && node.data.values[_var.mainValue] ? [node] : [];
              var text = nodeSel.selectAll('text.node-yoy').data(values, function (d) { return d.data.id; });
              text.exit().remove();
              text = text.enter().append('text').attr('class', 'node-yoy').merge(text);
              text
                .attr("x", 0 )
                .attr("y", 28 )
                .attr("text-anchor", "middle" )
                .style("opacity", 0)
                .transition().duration(animation).delay(delay)
                .style("opacity", 1)
                .style("font-size", `${9/_var.scale}px`)
                .style('fill', function(d) { return d.data.color; })
                .text(function (d) { return 'Contribution ' + shared.helpers.number.localePercent(d.data.values[_var.mainValue] - d.data.values.pYear); });

              // Insert / Update left path
              if(!isSatelite) {
                var leftLink = _var.g.selectAll('.left-link').data(zoomed ? [node] : [], function (d) { return d.data.id; });
                leftLink.exit().remove();
                leftLink = leftLink.enter().append('path').attr('class', 'left-link').merge(leftLink);
                leftLink
                  .attr('d', `M ${y},${x} L ${y},${x}`)
                  .transition().delay(delay + animation).duration(animation/2)
                    .attr('d', `M ${0},${x} L ${y},${x}`)
                    .style('opacity', 1)
              }

              // Insert / Update labels for the nodes
              text = nodeSel.selectAll('text.node-s-abbr').data(isSatelite ? [node] : [], function (d) { return d.data.id; });
              text.exit().remove();
              text = text.enter().append('text').attr('class', 'node-s-abbr').merge(text);
              text
                .attr("transform", `translate(${leg.text[0]},${leg.text[1]})`)
                .attr("text-anchor", leg.anchor )
                .style("font-size", `${10 / _var.scale}px`)
                .style("opacity", 0)
                .transition().duration(animation).delay(isSatelite ? animation + delay : delay)
                .style("opacity", node.parent && node.satAttrs && node.satAttrs.lvl >= node.parent.maxSatLvl-1 ? 1 : 0 )
                .text(function (d) { return d.data.abbr == null ? d.data.name : d.data.abbr; });

              // Insert / Update path to label
              var nodeLink = nodeSel.selectAll('.label-link').data(isSatelite ? [node] : [], function (d) { return d.data.id; });
              nodeLink.exit().remove();
              nodeLink = nodeLink.enter().append('path').attr('class', 'label-link').merge(nodeLink);
              nodeLink
                .style("opacity", 0)
                .transition().duration(animation).delay(isSatelite ? animation + delay : delay)
                .style("opacity", node.parent && node.satAttrs && node.satAttrs.lvl >= node.parent.maxSatLvl-1 ? 1 : 0 )
                .attr('d', `M ${0},${0} L ${leg.path[0]},${leg.path[1]} Z`)

              // Insert / Update circle label
              var nodeCircle = nodeSel.selectAll('.label-circle').data(isSatelite ? [node] : [], function (d) { return d.data.id; });
              nodeCircle.exit().remove();
              nodeCircle = nodeCircle.enter().append('circle').attr('class', 'label-circle').merge(nodeCircle);
              nodeCircle
                .style("opacity", 0)
                .transition().duration(animation).delay(isSatelite ? animation + delay : delay)
                .style("opacity", node.parent && node.satAttrs && node.satAttrs.lvl >= node.parent.maxSatLvl-1 ? 1 : 0 )
                .attr('cx', leg.path[0])
                .attr('cy', leg.path[1])
                .attr('r', 2)

              // Draw bg path
              components.backgrounds()
                ._var(_var)
                .container(shapesG)
                .data(zoomed && !isSatelite ? [] : ["bg"])
                .radius(radius)
                .run();

              // Set sitelite size
              _var.attrs.satelites.s = radius;

              // Draw node satelites
              components.satelites()
                ._var(_var)
                .action('draw')
                .delay(animation + delay)
                .node(node)
                .nodeObj(shapesG.node())
                .zoomed(zoomed)
                .run();

              break
          }
        break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','animation','action','bindClick','bindHover','isSatelite','components','delay','mainValue','node','nodeObj','parent','source','radius','textOffset','x','y','x0','y0','zoomed'].forEach(function(key) {

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

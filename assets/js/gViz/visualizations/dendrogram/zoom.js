// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  var _var       = null;
  var animation  = 900;
  var action     = 'toNode';
  var components = null;
  var node       = null;
  var nodeObj    = null;
  var parent     = null;
  var scale      = 4;
  var x          = null;
  var y          = null;

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
            case 'toNode':

              // Get satelites
              var satelites = _var.getSatelites(node);
              var satelites_ids = satelites.map(function(s) { return s.data.id; });

              // Filter nodes
              var nodesToRemove = _var.g.selectAll('g.node-group').filter(function(d) { return d != node; });
              var pathLink      = _var.g.selectAll('path.link, path.left-link');

              // Draw secondary g and append nodes to remove
              _var._g = _var.wrap.selectAll("g.chart-wrap-secondary").data(["chart-wrap-secondary"]); // svg:g
              _var._g.exit().remove();
              _var._g = _var._g.enter().append('g').attr('class', "chart-wrap-secondary").merge(_var._g);
              _var._g
                .attr("transform", `translate(${_var.margin.left},${_var.margin.top})`)
                .each(function(e) {
                  var parentNode = this;
                  nodesToRemove.each(function(d) { parentNode.appendChild(this); })
                  pathLink.each(function(d) { parentNode.appendChild(this); })
                });

              var translateX = (_var.margin.top  + (_var.zHeight/2 + _var.margin.top/4) - x*scale) / scale;
              var translateY = (_var.margin.left + (_var.zWidth/2) - y*scale) / scale;

              _var._g
                .transition().duration(animation)
                .attr('transform', 'scale('+scale+') translate('+translateY+','+translateX+')')
                .style('opacity', 0)
                .on('end', function() { d3.select(this).remove() });

              // Set zoom node
              _var.zoomNode = node != null && node.data != null && node.data.id != null ? node.data.id : null;

              // Set zoom level
              _var.zoomLevel = node.depth;

              // Set bounded height and Width
              _var.height = _var.zHeight;
              _var.width = _var.zWidth;

              // Update outer dimensions
              _var.wrap
                .attr("width", _var.zWidth + _var.margin.left + _var.margin.right)
                .attr("height", _var.zHeight + _var.margin.top + _var.margin.bottom - 5);

              // Set wrappers height
              _var.container.d3.style("height", parseInt(_var.zHeight + _var.margin.top + _var.margin.bottom) + 'px');

              // Insert / Update nodes
              var nodeSel = _var.g.selectAll(`g.node-group`).filter(function(d) { return d == node; }).data([node], function (d) { return d.data.id; });
              nodeSel.exit().remove();
              nodeSel = nodeSel.enter().insert('g', ':first-child').attr('class', 'node-group').merge(nodeSel);
              nodeSel.each(function(n) {

                // Update main node
                components.nodes()
                  ._var(_var)
                  .components(components)
                  .parent(parent)
                  .action('draw')
                  .bindClick(false)
                  .bindHover(false)
                  .mainValue(true)
                  .node(n)
                  .nodeObj(this)
                  .radius(100)
                  .textOffset(-12)
                  .x0(x)
                  .y0(y)
                  .x(_var.zHeight/2 + _var.margin.top/4)
                  .y(_var.zWidth/2)
                  .zoomed(true)
                  .run();

              });

              // Insert / Update satelites as nodes
              nodeSel = _var.g.selectAll('g.node-group').filter(function(d) { return d != node; }).data(satelites, function (d) { return d.data.id; });
              nodeSel.exit().remove();
              nodeSel = nodeSel.enter().append('g').attr('class', 'node-group').merge(nodeSel);
              nodeSel.each(function(n) {

                // Draw nodes
                components.nodes()
                  ._var(_var)
                  .components(components)
                  .parent(parent)
                  .action('draw')
                  .isSatelite(true)
                  .mainValue(true)
                  .node(n)
                  .nodeObj(this)
                  .radius(25)
                  .x0(x)
                  .y0(y)
                  .x(_var.zHeight/2 + _var.margin.top/4 + n.satAttrs.y)
                  .y(_var.zWidth/2 + n.satAttrs.x)
                  .run();

              });

              // Create gradient bg
              components.gradients()
                .container(_var.wrap)
                .id("diwo-gradient-bg")
                .type('radialGradient')
                .gData([{ colors: [ {offset:"0%", color:"rgba(255,255,255,0.15)"},{offset:"50%", color:"transparent"}]}])
                .run();

              // Draw Background rect
              var bg_rect = _var.g.selectAll("rect.bg-rect").data(["bg-rect"]);
              bg_rect.remove().exit().remove();
              bg_rect = bg_rect.enter().insert('rect', ':first-child').attr("class", "bg-rect").merge(bg_rect);
              bg_rect
                .attr("x", _var.zWidth > _var.zHeight ? 0 : -((_var.zHeight - _var.zWidth)/2))
                .attr("y", _var.zWidth > _var.zHeight ? -((_var.zWidth - _var.zHeight)/2) : 0)
                .attr('width',  _var.zWidth > _var.zHeight ? _var.zWidth : _var.zHeight)
                .attr("height", _var.zWidth > _var.zHeight ? _var.zWidth : _var.zHeight)
                .style('fill', "url(#diwo-gradient-bg)")

              // Update breadcrumbs
              components.breadcrumbs()
                ._var(_var)
                .components(components)
                .node(node)
                .parent(parent)
                .run();

              break;
          }
          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','animation','action','components','node','nodeObj','parent','scale','x','y'].forEach(function(key) {

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

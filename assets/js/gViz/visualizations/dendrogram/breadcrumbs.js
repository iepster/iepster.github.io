// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
'use strict';

  // Get attributes values
  var _var = undefined;
  var duration = 500;
  var components = null;
  var node = null;
  var parent = null;

  // Validate attributes
  var validate = function validate(step) {
    switch (step) {
      case 'run': return true;
      default: return false;
    }
  };

  // Main function
  var main = function main(step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'run':

          // Create breadcrumbs array based on node
          _var.createBreadcrumbs = function(d, bc) {
            bc.push(d);
            bc.push({ data: { id: 'arrow', abbr: '&#x25b6;' } });
            if(d.parent != null) { _var.createBreadcrumbs(d.parent, bc); }
            return bc;
          }

          // Hide level labels
          _var.g.selectAll(`text.level-label`).style('display', 'none');

          // Clean breadcrumbs
          _var.container.d3.select('[data-id="gViz-wrapper-breadcrumbs"]')
            .style('top', "15px")
            .style('left', "70px")
            .html('');

          // Breadcrumbs items
          var items = [{ data: { id: 'reset-vis', abbr: 'Graph View' } }].concat(_var.createBreadcrumbs(node, []).reverse());

          // Insert / Update breadcrumbs texts
          var bcSel = _var.container.d3.select('[data-id="gViz-wrapper-breadcrumbs"]').selectAll('breadcrumb-item').data(items);
          bcSel.exit().remove();
          bcSel = bcSel.enter().append('span').attr('class', 'breadcrumb-item').merge(bcSel);
          bcSel
            .html(function(d) { return d.data.abbr == null ? d.data.name : d.data.abbr; })
            .attr('data-id', function(d) { return d.data.id; })
            .on('click', function(d, i) {

              // If it is the first item
              if(i === 0) {

                // Reset zoom node
                _var.zoomNode = null;

                // Clean breadcrumbs and prev/next arrows
                _var.container.d3.select('[data-id="gViz-wrapper-breadcrumbs"]').html('');
                _var.g.selectAll("g.prev-next-group, rect.bg-rect, .node-group").remove();

                // Reset height/width
                _var.height = _var._height;
                _var.width = _var._width;

                // Return to initial graph
                parent('create')
                parent('setup')

                // Dispatch click node event
                _var.click.fn(null);

              // If it isnt the last item
              } else if(i !== items.length-1 || d.data.id !== 'arrow') {

                // Clean Elements
                _var.g.selectAll(".node-group, .left-link").remove();

                // Zoom to specific node
                components.zoom()
                  ._var(_var)
                  .components(components)
                  .parent(parent)
                  .action('toNode')
                  .node(d)
                  .nodeObj(this)
                  .scale(1)
                  .x(_var.zHeight/2 + _var.margin.top/2)
                  .y(_var.zWidth/2)
                  .run();

                // Dispatch click node event
                _var.click.fn(d);

              }

          }).classed('last', function(d,i) { return i === items.length-1; });

          // Get next and previous nodes
          var prev = null, next = null;
          if(node.parent != null) {
            var children = _var.getSatelites(node.parent);
            children.forEach(function(d,i) {
              if(d.data.id == node.data.id) {
                if(i != 0) { prev = { side: "prev", node: children[i-1] }; }
                if(i != children.length-1) { next = { side: "next", node: children[i+1] }; }
              }
            });
          }

          // Initialize sizes
          var w = _var.width/2, h = _var.margin.top/2, s = 20;

          // Insert / Update Previous and next links
          var pnSel = _var.g.selectAll("g.prev-next-group").data([prev,next].filter(function(d) { return d != null; }));
          pnSel.exit().remove();
          pnSel = pnSel.enter().append('g').attr('class', 'prev-next-group').merge(pnSel);
          pnSel
            .attr("transform", function(d) { return `translate(${w},${d.side === "prev" ? (-_var.margin.top+s/2) : (_var.height - s/4 - 2) })`; })
            .each(function(e) {

              var pathSel = d3.select(this).selectAll("path.prev-next").data([e]);
              pathSel.exit().remove();
              pathSel = pathSel.enter().append('path').attr('class', 'prev-next').merge(pathSel);
              pathSel
                .attr("d", function(d) {
                  if(d.side === "prev") {
                    return `M ${-s} ${2*h + s/4} 0 ${2*h-s/4} ${s} ${2*h+s/4}`;
                  } else {
                    return `M ${-s} ${-s/4} 0 ${s/4} ${s} ${-s/4}`;
                  }
                });

              var textSel = d3.select(this).selectAll("text.prev-next").data([e]);
              textSel.exit().remove();
              textSel = textSel.enter().append('text').attr('class', 'prev-next').merge(textSel);
              textSel
                .attr("dy", function(d) { return d.side === "prev" ? 2*h+s*1.5 : -s; })
                .attr("text-anchor", "middle")
                .text(function(d) { return d.node.data.name == null ? d.node.data.abbr : d.node.data.name; })
                .style('fill', "none")
                .style('opacity', 0)

              // // Create gradient bg
              // components.gradients()
              //   .container(_var.wrap)
              //   .id("diwo-gradient-glows")
              //   .type('radialGradient')
              //   .gData([{ colors: [ {offset:"0%", color:"rgba(6,19,36,1)"},{offset:"70%", color:"transparent"}]}])
              //   .run();

              // // Draw Background rect
              // var bg_glow = d3.select(this).selectAll("rect.bg-glow").data(["bg-rect"]);
              // bg_glow.exit().remove();
              // bg_glow = bg_glow.enter().insert('rect', ':first-child').attr("class", "bg-glow").merge(bg_glow);
              // bg_glow
              //   .attr("x", -4*s)
              //   .attr('y', (e.side ==='prev' ? (3*h + 0.5*s) : 0) -3*s)
              //   .attr('width',  8*s)
              //   .attr("height", 6*s)
              //   .style('fill', "none")
              //   .style('opacity', 0)

          // Hover
          }).on('mouseover', function(d) {
            // d3.select(this).selectAll("rect.bg-glow").style('fill', "url(#diwo-gradient-glows)").transition().duration(200).style('opacity', 1);
            d3.select(this).selectAll("text").style('fill', "#FFF").transition().duration(200).style('opacity', 1);
            _var.g.selectAll(".node-group, .left-link").style('opacity', 0.4);
            _var.g.selectAll("path.link").style('stroke', "#bb4f78");
          }).on('mouseout', function(d) {
            // d3.select(this).selectAll("rect.bg-glow, text").style('fill', "none").transition().duration(200).style('opacity', 0);
            d3.select(this).selectAll("text").style('fill', "none").transition().duration(200).style('opacity', 0);
            _var.g.selectAll(".node-group, .left-link").style('opacity', 1);
            _var.g.selectAll("path.link").style('stroke', "#bb4f78");

          // Click
          }).on('click', function(d) {

            // Zoom to specific node
            components.zoom()
              ._var(_var)
              .components(components)
              .parent(parent)
              .action('toNode')
              .node(d.node)
              .nodeObj(null)
              .scale(1)
              .x(d.side === 'prev' ? -(_var.zHeight/2 + _var.margin.top/2) : (_var.zHeight*1.5 + _var.margin.top/2))
              .y(_var.zWidth/2)
              .run();

            // Dispatch click node event
            _var.click.fn(d.node);

          });


          break;
      }
    }

    return _var;
  };

  // Expose global variables
  ['_var','duration','components','node','parent'].forEach(function(key) {

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

  // Execute the specific called function
  main.run = _ => main('run');

  return main;
};

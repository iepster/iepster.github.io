// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var animation = 900;
  var components = {};

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

          // Update scales domains
          _var.nodeScale.domain(d3.extent(_var.data.data.nodes, function(d) { return +_var._data.nodes[d.id].value; }));
          _var.nodeTextScale.domain(d3.extent(_var.data.data.nodes, function(d) { return +_var._data.nodes[d.id].value; }));
          _var.linkScale.domain(d3.extent(_var.data.data.links, function(d) { return +d.value; }));

          // Create/Update defs
          var defs = _var.wrap.selectAll("defs.arrow-defs").data(["arrow-defs"]);
          defs.exit().remove();
          defs = defs.enter().insert('defs',':first-child').attr("class", "arrow-defs").merge(defs);
          defs.each(function() {

            // Create/Update arrows
            var arrowMarkersEnd = d3.select(this).selectAll(".arrow-marker-end").data(_var.data.data.links.filter(function(d) { return d.direction === 'both' || d.direction === 'target'; }));
            arrowMarkersEnd.exit().remove();
            arrowMarkersEnd = arrowMarkersEnd.enter().append('marker').attr("class", "arrow-marker-end").merge(arrowMarkersEnd);
            arrowMarkersEnd
              .attr("id", function(d) { return d.id + '-marker-end'; })
              .attr("viewBox", "0 -5 10 10")
              .attr("refX", 10)
              .attr("refY", 0)
              .attr("markerWidth", 10)
              .attr("markerHeight", 6)
              .attr("orient", "auto")
              .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5")
                .style("fill", function(d) { return d.color; })

            // Create/Update arrows
            var arrowMarkersStart = d3.select(this).selectAll(".arrow-marker-start").data(_var.data.data.links.filter(function(d) { return d.direction === 'both' || d.direction === 'source'; }));
            arrowMarkersStart.exit().remove();
            arrowMarkersStart = arrowMarkersStart.enter().append('marker').attr("class", "arrow-marker-start").merge(arrowMarkersStart);
            arrowMarkersStart
              .attr("id", function(d) { return d.id + '-marker-start'; })
              .attr("viewBox", "-10 -5 10 10")
              .attr("refX", -10)
              .attr("refY", 0)
              .attr("markerWidth", 10)
              .attr("markerHeight", 6)
              .attr("orient", "auto")
              .append("svg:path")
                .attr("d", "M0,-5L-10,0L0,5")
                .style("fill", function(d) { return d.color; })


          });

          // Draw links Groups
          _var.linksG = _var.g.selectAll("g.links-group").data(["links-group"]); // svg:g
          _var.linksG.exit().remove();
          _var.linksG = _var.linksG.enter().append('g').attr('class', "links-group").merge(_var.linksG);
          _var.linksG.each(function(g) {

            // Draw links
            _var.links = d3.select(this).selectAll("path.link").data(_var.data.data.links, function(d) { return d.id; }); // svg:g
            _var.links.exit().remove();
            _var.links = _var.links.enter().append('path').attr('class', "link").merge(_var.links);
            _var.links
              .style("stroke-dasharray", _var.strokeStyle )
              .style("stroke-width", function(d) { return _var.linkScale(+d.value) / _var.zoomTransform.k; })
              .style("stroke", function(d) { return d.color; })
              .style("fill", "none")
              .attr("marker-start", function(d) { return d.direction === 'both' || d.direction === 'source' ? "url(#"+d.id+"-marker-start)" : ''; })
              .attr("marker-end", function(d) { return d.direction === 'both' || d.direction === 'target' ? "url(#"+d.id+"-marker-end)" : ''; })
              .style('display', function(g) {
                return _var.clicked == null || g.source === _var.clicked || g.source.id === _var.clicked || (_var._clicked != null && (g.source === _var._clicked.id || g.source.id === _var._clicked.id)) ? 'block' : 'none';
              });

          });

          // Draw Nodes Groups
          _var.nodesG = _var.g.selectAll("g.nodes-group").data(["nodes-group"]); // svg:g
          _var.nodesG.exit().remove();
          _var.nodesG = _var.nodesG.enter().append('g').attr('class', "nodes-group").merge(_var.nodesG);
          _var.nodesG.each(function(g) {

            // Draw nodes shapes
            _var.nodes = d3.select(this).selectAll(".node").data(_var.data.data.nodes, function(d) { return d.id; }); // svg:g
            _var.nodes.exit().remove();
            _var.nodes = _var.nodes.enter().append('path').attr('class', "node").merge(_var.nodes);
            _var.nodes
              .style('stroke-width', (1 / _var.zoomTransform.k) + 'px')
              .style("stroke", _var.strokeColor)
              .style("stroke-dasharray", _var.strokeStyle )
              .style("fill", function(d) { return d.color; })
              .style('display', function(g) {
                return _var.clicked == null || g.id === _var.clicked || (_var._clicked != null && (g.id === _var._clicked.id || _var._clicked.outEdges[g.id] || _var._clicked.inEdges[g.id] != null)) ? 'block' : 'none';
              })
              .style("filter", function(g) { return (_var._clicked != null && g.id === _var._clicked.id) ? "url(#"+_var.shadowId+")" : ""; })
              .call(d3.drag()
                .on("start", _var.dragstarted)
                .on("drag", _var.dragging)
                .on("end", _var.dragended));


            // Get nodes with text
            var nodesWithText = _var.data.data.nodes.filter(function(d) { return 2 * _var.nodeRadius(d) * _var.zoomTransform.k - 10 > 30; }).slice(0,50);

            // Draw nodes text
            _var.nodesText = d3.select(this).selectAll(".node-text").data(nodesWithText, function(d) { return d.id; }); // svg:g
            _var.nodesText.exit().remove();
            _var.nodesText = _var.nodesText.enter().append('text')
              .attr('class', "node-text")
              .text(function(d) { return d.name; })
              .style('font-size', _var.nodeTextSize)
              .each(function(d) { shared.helpers.text.wrap(d3.select(this), 100); })
              .merge(_var.nodesText);

            _var.nodesText
              .attr('transform', function(d) { return "translate(" + _var.nodeTextX(d) + "," + _var.nodeTextY(d, this) + ")"; })
              .attr('text-anchor', 'middle')
              .style('fill', _var.nodeTextColor)
              .style('font-size', _var.nodeTextSize)
              .style('display', function(g) {
                return _var.clicked == null || (_var._clicked != null && (g.id === _var._clicked.id || _var._clicked.outEdges[g.id] != null)) ? 'block' : 'none';
              })
              .attr("paint-order", "stroke")
              .attr("stroke", function(d) { return shared.helpers.colors.isDark(d.color) ? "#000" : "none"; })
              .attr('stroke-width', (2.5 / _var.zoomTransform.k) + 'px')
              .attr("stroke-opacity", 0.6)
              .attr("stroke-linecap", "butt")
              .attr("stroke-linejoin", "miter")
              .call(d3.drag()
                .on("start", _var.dragstarted)
                .on("drag", _var.dragging)
                .on("end", _var.dragended));

            // Update dy
            _var.nodesText.selectAll('tspan').attr('dy', _var.nodeTextDy)

          });

          _var.bindNodes = function() {

            // Hover action
            _var.nodesG.selectAll(".node, .node-text").on('mouseover', function(e) {

              // Set hovered node
              _var.hovered  = e.id;
              _var._hovered = _var._data.nodes[e.id];

              // Mouseover event
              components.events()
                ._var(_var)
                .action("mouseover")
                .components(components)
                .node(e)
                .run();

            // Move mouse hover action
            }).on('mousemove', function(e) {

              // Set hovered node
              _var.hovered  = e.id;
              _var._hovered = _var._data.nodes[e.id];

              // Mouseover event
              components.events()
                ._var(_var)
                .action("mousemove")
                .components(components)
                .node(e)
                .run();

            // Mouseout action
            }).on('mouseout', function(e) {

              // Reset hovered node
              _var.hovered  = null;
              _var._hovered = null;

              // Mouseout event
              components.events()
                ._var(_var)
                .action("mouseout")
                .components(components)
                .node(e)
                .run();

            // Click action
            }).on('click', function(e) {

              // Set clicked node
              _var.clicked  = _var.clicked  != null && _var.clicked === e.id ? null : e.id;
              _var._clicked = _var._clicked != null && _var._clicked.id === e.id ? null : _var._data.nodes[e.id];

              // Mouseout event
              components.events()
                ._var(_var)
                .action("click")
                .components(components)
                .node(e)
                .nodeSel(this)
                .run();

            });

          }

          // Bind nodes
          _var.bindNodes();

          // Initialize clicked element
          if(_var._clicked != null) {

            // Mouseout event
            components.events()
              ._var(_var)
              .action("click")
              .components(components)
              .node(_var._clicked)
              .run();

          }

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'animation', 'components'].forEach(function (key) {

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

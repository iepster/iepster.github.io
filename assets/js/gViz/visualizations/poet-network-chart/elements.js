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
          _var.linkScale.domain(d3.extent(_var.data.data.links, function(d) { return +d.value; }));

          // Draw links Groups
          _var.linksG = _var.g.selectAll("g.links-group").data(["links-group"]); // svg:g
          _var.linksG.exit().remove();
          _var.linksG = _var.linksG.enter().append('g').attr('class', "links-group").merge(_var.linksG);
          _var.linksG.each(function(g) {

            // Draw links
            _var.links = d3.select(this).selectAll("path.link").data(_var.data.data.links); // svg:g
            _var.links.exit().remove();
            _var.links = _var.links.enter().append('path').attr('class', "link").merge(_var.links);
            _var.links.style("stroke-width", function(d) { return _var.linkScale(+d.value) / _var.zoomTransform.k; });

          });

          // Draw Nodes Groups
          _var.nodesG = _var.g.selectAll("g.nodes-group").data(["nodes-group"]); // svg:g
          _var.nodesG.exit().remove();
          _var.nodesG = _var.nodesG.enter().append('g').attr('class', "nodes-group").merge(_var.nodesG);
          _var.nodesG.each(function(g) {

            // Draw Nodes Groups
            _var.nodes = d3.select(this).selectAll(".node").data(_var.data.data.nodes); // svg:g
            _var.nodes.exit().remove();
            _var.nodes = _var.nodes.enter().append('circle').attr('class', "node").merge(_var.nodes);
            _var.nodes
              .attr('r', function(d) { return _var.getRadius(d); })
              .attr('stroke-width', (1.5 / _var.zoomTransform.k) + 'px')
              .attr("fill", function(d) { return d.color; })
              .call(d3.drag()
                .on("start", _var.dragstarted)
                .on("drag", _var.dragging)
                .on("end", _var.dragended));

            // Hover action
            _var.nodes.on('mouseover', function(e) {

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

            })
          });

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

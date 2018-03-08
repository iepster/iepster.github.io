// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = null;

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

          // Zoom functions
          _var.zoom_actions = function(){

            // Set zoom transform
            _var.zoomTransform = d3.event.transform;

            // Transform outer g
            _var.g.attr("transform", d3.event.transform)

            // Transform links
            _var.links
              .style("stroke-width", function(d) { return (_var.linkScale(+d.value) / _var.zoomTransform.k) + 'px'; })
              .style("stroke-dasharray", _var.strokeStyle )

            // Transform nodes
            _var.nodes
              .attr('d', _var.shapeStyle)
              .style("stroke-width", function(d) { return (1 / _var.zoomTransform.k) + 'px'; })
              .style("stroke-dasharray", _var.strokeStyle )

            // Get nodes with text
            var nodesWithText = _var.data.data.nodes.filter(function(d) { return 2 * _var.nodeRadius(d) * _var.zoomTransform.k - 10 > 30; }).slice(0,50);

            // Draw nodes text
            _var.nodesText = _var.nodesG.selectAll(".node-text").data(nodesWithText, function(d) { return d.id; }); // svg:g
            _var.nodesText.exit().remove();
            _var.nodesText = _var.nodesText.enter().append('text')
              .attr('class', "node-text")
              .style('font-size', _var.nodeTextSize)
              .text(function(d) { return d.name; })
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
                .on("end", _var.dragended)
                .touchable(true));

            // Update dy
            _var.nodesText.selectAll('tspan').attr('dy', _var.nodeTextDy)

            // Bind nodes
            _var.bindNodes();

            // Update nodes and links
            _var.ticked();

            // Draw shadow
            shared.visualComponents.shadow()
              ._var(_var)
              .id(_var.shadowId)
              .stdDeviation(2 / _var.zoomTransform.k)
              .x(-2 / _var.zoomTransform.k)
              .y(2 / _var.zoomTransform.k)
              .wrap(_var.wrap)
              .run();

          }

          // Add zoom capabilities
          _var.zoom_handler = d3.zoom()
            .on("zoom", _var.zoom_actions)
            .on("start", function() { _var.wrap.classed('grabbing', true) })
            .on("end",   function() { _var.wrap.classed('grabbing', false) });

          // Bind zoom to svg
          _var.wrap
            .call(_var.zoom_handler)
            .call(_var.zoom_handler.transform, d3.zoomIdentity.translate(_var.zoomTransform.x, _var.zoomTransform.y).scale(_var.zoomTransform.k))

          // Reset visualization zoom
          _var.container.d3.closest('.gViz-outer-wrapper').select("[data-action='reset']").on('click', function(d) {
            _var.wrap.transition().call(_var.zoom_handler.transform, d3.zoomIdentity);
          });

          // Bind zoom in
          _var.container.d3.closest('.gViz-outer-wrapper').select("[data-action='zoom-in']").on('click', function(d) {
            _var.zoom_handler.scaleBy(_var.wrap.transition(), 1.3);
          });

          // Bind zoom out
          _var.container.d3.closest('.gViz-outer-wrapper').select("[data-action='zoom-out']").on('click', function(d) {
            _var.zoom_handler.scaleBy(_var.wrap.transition(), 1/1.3);
          });

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var'].forEach(function (key) {

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

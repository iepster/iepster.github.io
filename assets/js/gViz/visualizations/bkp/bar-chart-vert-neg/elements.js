// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var components = null;

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

          // Insert/Update filter
          _var = components.shadow()
            ._var(_var)
            .run();

          // Insert/Update target lines
          _var = components.target()
            ._var(_var)
            .action('create')
            .run();

          // Element canvas
          var elements = _var.g.selectAll(".chart-elements").data(["chart-elements"]);
          elements.exit().remove();
          elements = elements.enter().append("g").attr("class", "chart-elements").merge(elements);

          // Create bar groups
          var groups = elements.selectAll(".element-group").data(_var.data.data, function (d) { return d.id; });
          groups.exit().remove();
          groups = groups.enter().append("g").attr("class", "element-group").merge(groups);

          // For each element in group
          groups
            .attr("transform", function (d) { return `translate(${_var.x(+d.x)},0)`; })
            .each(function (e, i) {

              // Set bars component
              components.bars()
                ._var(_var)
                .components(components)
                .nodeObj(this)
                .node(e)
                .nodeIndex(i)
                .run();

            }).on("mouseover", function(e, i) {

              // Get content
              var content =  "";

              // Set title
              content += "<span class='title "+(e.img == null || e.img === "" ? '' : 'with-image')+"' style='color: "+e.color+";'>"
              if(e.img == null || e.img === "") {
                content += e.name;
              } else {
                content += "<span class='title-img' style='border-right: 1px solid "+e.color+"'><img src='"+e.img+"'/></span>";
                content += "<span class='title-text'>"+e.name+"</span>";
              }
              content += "</span>";

              // Set text
              content += "<span class='text' style='background-color: "+e.color+"; color: #FFF;'>";
              content += "<span class='metric'>"+(_var.data.y != null && _var.data.y.tooltip != null ? _var.data.y.tooltip : 'Contribution')+"</span>";
              content += "<span class='number'>"+(_var.yFormat(+e.y))+"</span>";
              content += "</span>";

              // Set bars component
              shared.visualComponents.tooltip()
                ._var(_var)
                .content(content)
                .borderColor(e.color)
                .left(_var.wrap.node().getBoundingClientRect().left +_var.margin.left + _var.x(+e.x))
                .top(_var.wrap.node().getBoundingClientRect().top + _var.margin.top + _var.getY(e) + _var.barWidth/4)
                .run();

              // Set filters
              d3.select(this).selectAll("rect.bar").transition().delay(100).style("filter", "url(#drop-shadow)")

            }).on("mouseout", function(e, i) {

              // Set bars component
              shared.visualComponents.tooltip()
                ._var(_var)
                .action("hide")
                .run();

              // Remove filters
              d3.select(this).selectAll("rect.bar").transition().delay(250).style("filter", "");

            });

          // Draw Background rect
          var bg_rect = _var.g.selectAll("rect.bg-rect").data(["bg-rect"]);
          bg_rect.exit().remove();
          bg_rect = bg_rect.enter().insert('rect', ':first-child').attr("class", "bg-rect").style('fill', 'transparent').merge(bg_rect);
          bg_rect.style('fill', 'transparent').attr("x", 0).attr('y', 0).attr('width', _var.width).attr("height", _var.height);

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','components'].forEach(function (key) {

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

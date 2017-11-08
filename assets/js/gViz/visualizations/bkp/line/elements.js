// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var animation = 900;
  var legendRectWidth = 20;
  var legendRectHeight = 10;
  var legendWidth = 90
  var textColor = '#8D7799';
  var hasPoints = undefined;
  var hasTooltip = undefined;
  var legendTopPos = undefined;
  var chartType = undefined;
  var showTotals = undefined;
  var legendWrapperStartX = -50;
  var axisLineThicknes = 1;
  var axisLineFill = '#7C767C';

  //TODO change urlLocation with correct url, pass as param maybe
  var urlLocation = 'decide';  // shadows and gradients need correct url 

  // Validate attributes
  var validate = function (step) {
    switch (step) {
      case 'run':
        if (!legendTopPos) console.log('err - legendTopPos')
        if (!chartType) console.log('err - chartType');
        if (!showTotals) console.log('err - showTotals');
        return true;
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


          // Create a shared transition for anything we're animating
          var t = d3.transition()
            .duration(3000)
            .ease(d3.easeLinear);

          // Element canvas
          var elements = _var.g.selectAll(".chart-elements").data(["chart-elements"]);
          elements.exit().remove();
          elements = elements.enter().append("g").attr("class", "chart-elements").merge(elements);



          // Create line/area groups
          var groups = elements.selectAll(".element-group").data(_var.data.sort(function (a, b) { return d3.ascending(a.median, b.median); }), function (d) { return d.id; });
          groups.exit().remove();
          groups = groups.enter().append("g").attr("class", "element-group").merge(groups);


          var rectClipId = 'rectClip' + Math.floor(Math.random() * 1000000) + Date.now();
          elements.append("clipPath")
            .attr("id", rectClipId)
            .append("rect")
            .attr("width", 0)
            .attr("height", 800);


          //hasTooltip           
          _var.container.d3.selectAll('.tooltip').remove();

          let div = _var.container.d3
            .append("div")
            .attr("class", "tooltip")
            .style('position', 'absolute')
            .style("opacity", 0)
            .style("box-shadow", "1px 7px 18px rgba(0, 0, 0, 0.6)")
            .style("padding", "10px")
            .style("padding-left", "13px")
            .style("padding-right", "13px")
            .style("background-color", "#FFB519")
            .style("color", "white")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .style('pointer-events', 'none')



          // For each element in group
          groups.each(function (e, i) {

            // copy colors from line to legend
            e.colors.legend = e.colors.line;

            var elementRootColor = e.colors.line[0].color;



            var random = Math.floor(Math.random() * 1000000) + '' + Date.now();

            // Update gradients
            var gradientData = [{
              data: e,
              id: 'line' + e.id + random,
              type: 'line'
            }, {
              data: e,
              id: 'area' + e.id + random,
              type: 'area',
            }, {
              data: e,
              id: 'legend' + e.id + random,
              type: 'legend'
            }]

            var gradient = _var.wrap.selectAll(`.linear .gradient`).data(gradientData, function (d) { return d.id; });
            gradient.exit().remove();
            gradient = gradient.enter().append("linearGradient").attr('id', function (d) { return d.id; }).attr("class", 'linear gradient').merge(gradient);
            gradient

              .attr("gradientUnits", function (d) {
                //if (d.type == 'legend') return 'objectBoundingBox';
                return "objectBoundingBox";
              })

              .attr("x1", function (d) { return "100%"; _var.x(d.data.values[d.data.values.length - 1].date); })
              .attr("y1", function (d) { return "0%"; _var.y(d.data.values[d.data.values.length - 1].value); })
              .attr("x2", function (d) { return "0%"; _var.x(d.data.values[0].date); })
              .attr("y2", function (d) { return "0%"; _var.y(d.data.values[0].value); })
              .each(function (g) {
                if (g.data.colors[g.type]) {
                  // Update gradient stops
                  var stop = d3.select(this).selectAll(`stop`).data(g.data.colors[g.type]);
                  stop.exit().remove();
                  stop = stop.enter().append("stop").merge(stop);
                  stop
                    .attr("offset", function (d) { return d.offset; })
                    .attr("stop-color", function (d) {
                      return d.color;
                    });
                }


              });





            // Update area
            var area = d3.select(this).selectAll('.area.element').data([e], function (d) { return d.id; });
            area.exit().remove();
            area.enter().append("path").attr("class", 'area element').merge(area)
              .style('stroke', 'none')
              .style('fill', function (d) { return 'url(' + urlLocation + '#area' + e.id + random + ')'; })
              .attr("d", function (d) { return _var.areaConstructor(d.values.map(v => { return v; return { "_date": v._date, value: 1 }; })); })
              .attr("clip-path", "url(" + urlLocation + "#" + rectClipId + ")")
              .attr('pointer-events', 'none');



            // Update line
            var line = d3.select(this).selectAll('.line.element').data([e], function (d) { return d.id; });
            line.exit().remove();

            var updatedLine = line.enter().append("path").attr("class", 'line element').merge(line);


            updatedLine.style('stroke', function (d) { return 'url(' + urlLocation + '#line' + e.id + random + ')'; /*return d.colors.line;*/ })
              .style('fill', 'none')
              // .attr("stroke-dasharray", function (d) {
              //   console.log('stroke-dasharray -',this,this.getTotalLength);
              //    return this.getTotalLength() 
              // })
              // .attr("stroke-dashoffset", function (d) { return this.getTotalLength() })
              .attr("d", function (d) { return _var.lineConstructor(d.values); })
              .attr('data-line-id', e.id + random)
              .attr("stroke-dasharray", 8 * _var.width)
              .attr('class', 'line element')
              .style('stroke-width', d => { return chartType == 'linear' ? 3 : 7 })
              .attr("clip-path", "url(" + urlLocation + "#" + rectClipId + ")");


            updatedLine.on('mouseenter', function (d) {
              if (chartType == 'linear') {
                var hoveredLineId = d3.select(this).attr('data-line-id');

                _var.g
                  .selectAll('.line.element')
                  .filter(d => d.id + "" + random == hoveredLineId)
                  .style("filter", "url(" + urlLocation + "#" + _var.dropShadowUrl + ")")
              }
            })
              .on('mouseleave', function (d) {
                if (chartType == 'linear') {
                  _var.g
                    .selectAll('.line.element')
                    .style("filter", "none")
                }
              })


            if (chartType !== 'linear') {
              updatedLine.style("filter", "url(" + urlLocation + "#" + _var.dropShadowUrl + ")")
            }



            if (hasPoints) {
              var points = d3.select(this).selectAll('.point.element').data(e.values.map(d => { d.color = e.colors.line[0].color; return d; }));
              // points.exit().remove();

              points = points.enter()
                .append('g')
                .attr('data-line-id', e.id + random)
                .attr('class', 'point element')



              points
                .attr('cursor', 'pointer')
                .attr('transform', d => 'translate(' + _var.x(d.date) + ',' + (_var.y(d.value) - 6) + ')')
                .append('rect').attr('width', 8).attr('height', 8).attr('transform', 'rotate(45)').attr('fill', d => d.color)

              if (hasTooltip) {
                points
                  .on("mouseenter", function (d) {
                    var tooltip = _var.wrap.select('.square-arrowed-line-tooltip')
                      .style('display', 'initial');

                    tooltip.select('text').text(`$${d.value}M`);
                    tooltip.select('path').attr('fill', d.color).style("filter", "url(" + urlLocation + "#" + _var.dropShadowUrl + ")");
                    tooltip.attr('transform', `translate(${_var.x(d.date) + 9},${_var.y(d.value) - 3})`)


                    //---------------------------
                    var hoveredLineId = d3.select(this).attr('data-line-id');
                    _var.g
                      .selectAll('.line.element')
                      .filter(d => d.id + '' + random == hoveredLineId)
                      .style("filter", "url(" + urlLocation + "#" + _var.dropShadowUrl + ")")


                    // div
                    //   .style('background-color', d.color)

                    //   .style("opacity", 1);

                    // div.html(
                    //   `<div >$${d.value} M
                    //      <div style="left:32px;bottom:-15px;position:absolute;width:0;height:0;border-left: 15px solid transparent;border-right: 15px solid transparent;border-top: 15px solid ${d.color};" class="arrow-down"></div>
                    //   </div>
                    //   `
                    // )
                    //   .style("left", (_var.x(d.date)+13) + "px")
                    //   .style("top", (_var.y(d.value)) + "px");
                  })
                  .on("mouseleave", function (d) {
                    _var.wrap.select('.square-arrowed-line-tooltip').style('display', 'none');
                    if (chartType == 'linear') {
                      _var.g
                        .selectAll('.line.element')
                        .style("filter", "none")
                    }

                  });

              }

            }

            if (showTotals) {
              d3.select(this).select('.tag-total').remove();

              var tag = d3.select(this).append('g')
                .attr('transform', 'translate(0,' + _var.y(e.total) + ')')

              tag.append('path').attr('d', "M0 0 L30 0 L38 -7 L30 -14 L0 -14 Z").attr('transform', 'translate(-38,0)').attr('fill', elementRootColor)

              tag.append('text').attr('fill', 'white').text(e.total + ' M').attr('x', -34).attr('font-size', 10).attr('y', '-3')

              tag.append('rect').attr('width', _var.width).attr('height', 0.1).attr('stroke-dasharray', '1,2').attr('stroke', elementRootColor).attr('stroke-width', 1).attr('y', -5)

            }

            var legendWrapper = d3.select(this).selectAll('.legend-wrapper').data([e], function (d) { return d.id; });
            legendWrapper.exit().remove();
            legendWrapper = legendWrapper.enter().append('g').merge(legendWrapper).attr('transform', 'translate(' + (i * legendWidth - legendWrapperStartX) + ',' + legendTopPos + ')')

            var rects = legendWrapper.append('rect').attr('width', legendRectWidth).attr('height', legendRectHeight)
              .style('fill', function (d) { return 'url(' + urlLocation + '#legend' + e.id + random + ')'; })

            var texts = legendWrapper.append('text').text(e.name).attr('x', legendRectWidth + 7).attr('y', 10).attr('fill', textColor);


            var rectHeight = 12;
            var rectWidth = 12;
            var textPos = rectWidth + 3;

            legendWrapper.append('rect').attr('width', rectWidth).attr('height', 2).attr('fill', 'black').attr('opacity', 0.2);

            rects.attr('width', rectWidth).attr('height', rectHeight);
            texts.attr('x', textPos).style('font-size', 12 + 'px');

            
            //recalculate sizes
            legendWrapper.each(function (d, i) {
              var group = d3.select(this);
              var node = group.node();
              if(!node) return;
              var bbox = node.getBBox();
              group.attr('transform', 'translate(' + legendWrapperStartX + ',' + legendTopPos + ')');
               
              legendWrapperStartX+=(bbox.width+15);
            })

            //  _var.g.selectAll('.axis line').style('stroke-width','0.5px').style('stroke','#B4A6BA').style('stroke-dasharray', '1,2')




          });


         //add bottom and left thick lines
          _var.g.append('rect')
            .attr('width',axisLineThicknes)
            .attr('height',_var.height)
            .attr('fill',axisLineFill)

           _var.g.append('rect')
            .attr('width',_var.width)
            .attr('height',axisLineThicknes)
            .attr('y',_var.height)
            .attr('fill',axisLineFill)
       
          // animate areas and lines
          elements.selectAll('clipPath rect')
            .transition(t)
            .attr("width", function (d) {
              return _var.width * 3;
            });


          // finalize linear graph styling


          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'urlLocation', 'animation', 'hasPoints', 'hasTooltip', 'legendTopPos', 'textColor', 'chartType', 'showTotals'].forEach(function (key) {

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

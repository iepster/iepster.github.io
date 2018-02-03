// Imports
let d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  let _var = undefined;
  let animation = 900;
  let legendRectWidth = 20;
  let legendRectHeight = 10;
  let legendWidth = 90
  let textColor = '#8D7799';
  let hasPoints = true;
  let hasTooltip = undefined;
  let legendTopPos = undefined;
  let chartType = undefined;
  let showTotals = undefined;
  let legendWrapperStartX = -50;
  let axisLineThicknes = 1;
  let axisLineFill = '#7C767C';
  let components = undefined;
  //TODO change urlLocation with correct url, pass as param maybe
  let urlLocation = 'decide';  // shadows and gradients need correct url

  // Validate attributes
  let validate = function (step) {
    switch (step) {
      case 'run':
        if (!legendTopPos) console.log('err - legendTopPos')
        if (!chartType) console.log('err - chartType');
        if (!showTotals) console.log('err - showTotals');
        return true;
      default:
        return false;
    }
  };

  // Main function
  let main = function (step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'run':

          // Create a shared transition for anything we're animating
          let t = d3.transition()
            .duration(3000)
            .ease(d3.easeLinear);

          // Element canvas
          let elements = _var.g.selectAll(".chart-elements").data(["chart-elements"]);
          elements.exit().remove();
          elements = elements.enter().append("g").attr("class", "chart-elements").merge(elements);

          // this line is because the tooltip was created as a black box and it was visible before
          // a mouseover/mouseout event
          _var.container.d3.selectAll('.rect-arrowed-line-tooltip').remove();

          // finalize linear graph styling
          //extract the data
          let predictedData = _var.data.sales.predicted;
          let actualData = _var.data.sales.actual;
          let dates = _var.data.sales.dates;

          let setupGrids = () => {
            // setup grids
            let xGridData = [];
            let yGridData = [];

            _var.x.domain().forEach((d, i) => {
              let xGridElement = {
                x1: _var.x(d) + _var.x.bandwidth() / 2,
                x2: _var.x(d) + _var.x.bandwidth() / 2,
                y1: _var.y(0),
                y2: _var.y(100)
              };
              xGridData.push(xGridElement);
            });

            [0, 20, 40, 60, 80, 100].forEach((d, i) => {
              let yGridElement = {
                y1: _var.y(d),
                y2: _var.y(d),
                x1: _var.x('W1') + _var.x.bandwidth() / 2,
                x2: _var.x('W8') + _var.x.bandwidth() / 2
              };
              yGridData.push(yGridElement);
            });

            // draw the x grid container
            let xGrid = elements.selectAll('.x-grid-container').data(['xGridContainer']);
            xGrid.exit().remove();
            xGrid.enter().append('g').attr('class', 'x-grid-container').merge(xGrid);

            let xGridElements = elements.selectAll(".x-grid").data(xGridData);

            // exclude the old x grid line
            xGridElements.exit().remove();
            xGridElements = xGridElements.enter().append("line")
              .attr("class", "x-grid").merge(xGridElements);

            // style the x grid line
            xGridElements
              .attr("x1", d => d.x1)
              .attr("x2", d => d.x2)
              .attr("y1", d => d.y1)
              .attr("y2", d => d.y2)
              .attr("stroke-width", "0.5px");


            // draw the grid container
            let yGrid = elements.selectAll('.y-grid-container').data(['yGridContainer']);
            yGrid.exit().remove();
            yGrid.enter().append('g').attr('class', 'y-grid-container').merge(yGrid);

            let yGridElements = elements.selectAll(".y-grid").data(yGridData);

            // exclude the old y grid line
            yGridElements.exit().remove();
            yGridElements = yGridElements.enter().append("line")
              .attr("class", "y-grid").merge(yGridElements);

            // style the y grid line
            yGridElements
              .attr("x1", d => d.x1)
              .attr("x2", d => d.x2)
              .attr("y1", d => d.y1)
              .attr("y2", d => d.y2)
              .attr("stroke-width", "0.5px");
          };
          setupGrids();

          // define the actual line (real data)
          let actualLine = elements.selectAll('.actual-line').data([actualData]);
          actualLine.exit().remove();

          // enter section for the new data and merging the update part (or old data)
          actualLine = actualLine
            .enter()
            .append("path")
            .attr("class", "line actual-line").merge(actualLine);

          // style the actual line
          actualLine
            .attr("d", (d) => _var.lineConstructor(actualData))
            .attr("transform", `translate(${_var.x.bandwidth() / 2}, 0)`)
            .style('stroke', _var.data.color)
            .style('fill', 'none')
            .style('stroke-width', '1px');

          // define the predicted line (predicted/planned data)
          let predictedLine = elements.selectAll(".predicted-line").data([predictedData]);
          predictedLine.exit().remove();

          // enter section for the new data and merging the update part (or old data)
          predictedLine = predictedLine
            .enter()
            .append('path')
            .attr("class", "line-dash predicted-line").merge(predictedLine);

          // style the predicted line
          predictedLine
            .attr("d", (d) => _var.lineConstructor(predictedData))
            .attr("transform", `translate(${_var.x.bandwidth() / 2}, 0)`)
            .style('stroke', _var.data.color)
            .style('fill', 'none')
            .style('stroke-dasharray', '2px')
            .style('stroke-width', '2px');

          //on mouse over event for the line points
          const mouseOver = (e, i) => {

            // Get window position
            var doc = document.documentElement;
            var offset = {
              left: (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
              top: (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
            };

            // Get positions
            var left = offset.left + _var.wrap.node().getBoundingClientRect().left + _var.margin.left + _var.x(dates[i])
              + _var.x.bandwidth() / 2;
            var top = offset.top + _var.wrap.node().getBoundingClientRect().top + _var.margin.top + _var.y(e);

            // Set up the content of the tooltip
            let content = "";

            // Set title to the tooltip
            content += "<span class='title " + (_var.data.img == null || _var.data.img === "" ? '' : 'with-image')
              + "' style='color: " + _var.data.color + ";'>"
            if (_var.data.img == null || _var.data.img === "") {
              content += _var.data.name;
            }
            else {
              content += "<span class='title-img'><img src='" + _var.data.img + "'/></span>";
              content += "<span class='title-text'>" + _var.data.name + "</span>";
            }
            // set the main content to the tooltip
            content += "</span>";
            content += "<span class='text' style='color: " + _var.data.color + ";'>";
            content += "<span class='metric'>Actual</span>";
            content += "<span class='number' style='float: right'>" + actualData[i] + "</span>";
            content += "</span>";

            content += "<span class='text' style='color: " + _var.data.color + ";'>";
            content += "<span class='metric'>Planned</span>";
            content += "<span class='number' style='float: right'>" + predictedData[i] + "</span>";
            content += "</span>";

            content += "<span class='text' style='color: " + _var.data.color + ";'>";
            content += "<span class='metric'>Deviation</span>";
            content += "<span class='number' style='float: right'>" + (actualData[i] - predictedData[i]) + "%</span>";
            content += "</span>";

            // show the tooltip
            components.tooltip()
              ._var(_var)
              .content(content)
              .borderColor(_var.data.color)
              .left(left)
              .top(top)
              .run();
          };

          // on mouseout event for the line points
          const mouseOut = (e, i) => {
            // hide the tooltip
            components.tooltip()
              ._var(_var)
              .action("hide")
              .run();
          };

          // create the container for the rects(points) for the line with the actual data
          let actualRects =
            elements.selectAll('.rect-actual-group').data(['rect-actual-group']);
          actualRects.exit().remove();

          // create the rects(points) for the line with the actual data
          actualRects = actualRects.enter().append('g').attr('class', 'rect-actual-group').merge(actualRects);
          actualRects = actualRects.selectAll('.rect-actual').data(actualData);
          actualRects.exit().remove();
          actualRects = actualRects.enter().append('rect').attr('class', 'rect-actual').merge(actualRects);

          // style the rects (points) for the line with the actual data
          actualRects
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", "6px")
            .attr("height", "6px")
            .attr('class', (d, i) => `actual-rect-${i}`)
            .attr('transform', (d, i) => {
              let xCoord = _var.x(dates[i]) + _var.x.bandwidth() / 2 - 4.2;
              let yCoord = _var.y(d);
              return `translate(${xCoord},${yCoord}) rotate(-45)`;
            })
            .style('fill', _var.data.color);

          // create the container fosuarer the rects(points) for the line with the predicted data
          let predictedRects =
            elements.selectAll('.rect-predicted-group').data(['rect-predicted-group']);
          predictedRects.exit().remove();

          // create the rects(points) for the line with the predicted data
          predictedRects = predictedRects.enter().append('g').attr('class', 'rect-predicted-group').merge(predictedRects);
          predictedRects = predictedRects.selectAll('.rect-predicted').data(predictedData);
          predictedRects.exit().remove();
          predictedRects = predictedRects.enter().append('rect').attr('class', 'rect-predicted').merge(predictedRects)

          // style the rects (points) for the line with the predicted data
          predictedRects
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", "6px")
            .attr("height", "6px")
            .attr('transform', (d, i) => {
              let xCoord = _var.x(dates[i]) + _var.x.bandwidth() / 2 - 4.2;
              let yCoord = _var.y(d);
              return `translate(${xCoord},${yCoord}) rotate(-45)`;
            })
            .style('fill', _var.data.color);

          let max = 0;
          let largestDeviationIdx = 0;

          // find the index of the largest deviation
          actualData.forEach((actualDataEl, i) => {
            if (Math.abs(actualDataEl - predictedData[i]) > max) {
              max = Math.abs(actualDataEl - predictedData[i]);
              largestDeviationIdx = i;
            }
          });

          // set up the deviation data for the deviation line
          let deviationLineData = [{
            x1: _var.x(dates[largestDeviationIdx]) + _var.x.bandwidth() / 2,
            x2: _var.x(dates[largestDeviationIdx]) + _var.x.bandwidth() / 2,
            y1: _var.y(actualData[largestDeviationIdx]),
            y2: _var.y(predictedData[largestDeviationIdx])
          }];

          // draw the larget deviation vertical line
          let deviationLine = elements.selectAll("line.deviation-line").data(deviationLineData);

          // exclude the old deviation line
          deviationLine.exit().remove();
          deviationLine = deviationLine.enter().append("line")
            .attr("class", "deviation-line").merge(deviationLine);

          // style the deviation line
          deviationLine
            .attr("x1", d => d.x1)
            .attr("x2", d => d.x2)
            .attr("y1", d => d.y1)
            .attr("y2", d => d.y2)
            .attr('opacity', 0.5)
            .style('stroke', _var.data.color)
            .attr("stroke-width", "8.4px");

          // trigger the mouse over event so the tooltip will show up
          mouseOver(actualData[largestDeviationIdx], largestDeviationIdx);

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'components', 'urlLocation', 'animation', 'hasPoints', 'hasTooltip', 'legendTopPos', 'textColor', 'chartType', 'showTotals'].forEach(function (key) {

    // Attach variables to validation function
    validate[key] = function (_) {
      if (!arguments.length) {
        eval(`return ${key}`);
      }
      eval(`${key} = _`);
      return validate;
    };

    // Attach variables to main function
    return main[key] = function (_) {
      if (!arguments.length) {
        eval(`return ${key}`);
      }
      eval(`${key} = _`);
      return main;
    };
  });

  // Executa a funcao chamando o parametro de step
  main.run = _ => main('run');

  return main;
};

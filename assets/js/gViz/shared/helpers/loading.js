// Imports
var d3 = require("d3");

// Module declaration
module.exports = function() {

  // Initialize queue
  queue = [];

  return {

    // Mostra loading div
    show: function() {

      // Add request to queue
      queue.push(1);

      // Show loading div
      d3.selectAll(".loading-div")
        .style('display','block')
        .selectAll(".loading-div-inner")
          .style('height', d3.select(window).node().getBoundingClientRect().height)
          .style('width', d3.select(window).node().getBoundingClientRect().width);

      // Remove scroll
      d3.select("body").classed("no-scroll", true);
    },

    // Some com loading div
    hide: function() {

      // Remove request from queue
      queue.pop();

      // Hide loading div only if the queue has finished
      if (queue.length === 0) {
        d3.selectAll(".loading-div").style('display','none');
        d3.select("body").classed("no-scroll", false);
      }
    }
  }

}();

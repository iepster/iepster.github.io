// Imports
var d3 = require("d3");

// Module declaration
module.exports = {

  // Replace text variables
  replaceVariables: function(string, obj) {
    return string.toString().split('{{').map(function(d) {
      if(d.indexOf("}}") !== -1) {
        var pieces = d.split('}}');
        var text = eval('obj.' + pieces[0])
        d = (text == null ? "" : text) + pieces[1];
      }
      return d;
    }).join('');
  },

  // Remove special characters (id for gradients)
  removeSpecial: function(text) {
    return text == null ? '' : text.toString().replace(/[^\w]/gi, '-');
  },

  // Get size of text
  getSize: function(text, size='12px', weight='bold') {
    var t = d3.select('body').append('span')
      .style('font-size', size)
      .style('font-weight', weight)
      .style('white-space', 'nowrap')
      .html(text);
    var width = t.node().getBoundingClientRect().width;
    t.remove();
    return width + 10;
  },

  // Wrap function into width
  wrap: function(text, width) {
    text.each(function() {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = isNaN(+text.attr("dy")) ? 0 : +text.attr("dy"),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + "em").text(word);
        }
      }
    });
  },

  // Wrap function into width
  wrapBySize: function(text, width, height, maxLines=128932) {
    text.each(function() {

      // Initial variables
      var text = d3.select(this);
      var words = text.text().trim().split('').reverse();
      var word;
      var line = [];
      var numLines = 0;
      var lineNumber = 0;
      var lineHeight = 1.1;
      var x = isNaN(+text.attr("x")) ? 0 : +text.attr("x");
      var y = isNaN(+text.attr("y")) ? 0 : +text.attr("y");
      var dy = isNaN(+text.attr("dy")) ? 0 : +text.attr("dy");
      var tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
      var bbox = null;

      // Populate words array incrementally iterating over characterers
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join("").trim());
        bbox = text.node().getBBox();

        // If the word exceeds the width, draw tspan and start new one
        if (bbox.width > width) {
          line.pop();
          tspan.text(line.join("").trim());
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word.trim());
          numLines += 1;

        // Otherwise, just add the text
        } else {
          tspan.text(line.join(""));
        }

        // Limit height or line number
        if(bbox.height > height || numLines >= maxLines) {
          d3.select(text.node().lastChild).remove();
          if(words.length > 0) { d3.select(text.node().lastChild).text(d3.select(text.node().lastChild).text().slice(0,-1) + '...'); }
          words = [];
        }
      }
    });
  },

  // Get format for axis
  parseFormat: function(axis) {

    // Get format
    var fmt = function(d) { return d; };

    // Get axis format with prefix and suffix
    if(axis != null) {

      // Set prefix and suffix
      var prefix = axis.prefix != null ? axis.prefix : "";
      var suffix  = axis.suffix != null ? axis.suffix : (axis.sufix != null ? axis.sufix : "");

    } else {
      var prefix = "", suffix = "";
    }

    // Return format parsed
    return function(d) {
      return prefix + fmt(d) + suffix;
    };

  }

};

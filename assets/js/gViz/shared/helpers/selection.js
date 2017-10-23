// Imports
var d3 = require("d3");

// https://github.com/wbkd/d3-extended
d3.selection.prototype.moveToFront = function () { return this.each(function () { return this.parentNode.appendChild(this); }); };

// Find closest parent with selector (http://stackoverflow.com/questions/18375761/does-d3-have-api-which-similar-with-jquery-closestselector)
d3.selection.prototype.closest = function (selector) {
  var closestMatch = undefined;
  var matchArr = [];
  this.each(function () {
    var elm = this;
    while (typeof elm.parentNode.matches === "function" && !closestMatch) {
      elm = elm.parentNode;
      if (elm.matches(selector)) {
        closestMatch = elm;
        matchArr.push(closestMatch);
      }
    }
    closestMatch = undefined;
  });
  return d3.selectAll(matchArr);
}

//enter exit update pattern principle
d3.selection.prototype.patternify = function (params) {
  var container = this;
  var selector = params.selector;
  var elementTag = params.elementTag;
  var data = params.data || [selector];
  // pattern in action
  var selection = container.selectAll('.' + selector).data(data)
  selection.exit().remove();
  selection = selection.enter().append(elementTag).merge(selection)
  selection.attr('class', selector);
  return selection;
}

// Module declaration
module.exports = {
};

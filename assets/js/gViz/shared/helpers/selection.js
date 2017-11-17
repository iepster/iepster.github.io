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
  getTransformation: function(transform) {
    // Create a dummy g for calculation purposes only. This will never
    // be appended to the DOM and will be discarded once this function
    // returns.
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Set the transform attribute to the provided string value.
    g.setAttributeNS(null, "transform", transform);

    // consolidate the SVGTransformList containing all transformations
    // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
    // its SVGMatrix.
    var matrix = g.transform.baseVal.consolidate().matrix;

    // Below calculations are taken and adapted from the private function
    // transform/decompose.js of D3's module d3-interpolate.
    var {a, b, c, d, e, f} = matrix;   // ES6, if this doesn't work, use below assignment
    // var a=matrix.a, b=matrix.b, c=matrix.c, d=matrix.d, e=matrix.e, f=matrix.f; // ES5
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a) * 180 / Math.PI,
      skewX: Math.atan(skewX) * 180 / Math.PI,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }
};



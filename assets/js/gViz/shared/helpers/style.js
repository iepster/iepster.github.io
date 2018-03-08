// Imports
var d3 = require("d3");

// Module declaration
module.exports = {

  // Get style from element
  get: function(oElm, strCssRule){
    var strValue = "";
    if(document.defaultView && document.defaultView.getComputedStyle){
        strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    }
    else if(oElm.currentStyle){
        strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
            return p1.toUpperCase();
        });
        strValue = oElm.currentStyle[strCssRule];
    }
    return strValue;
  },

  // Set style from attrStyle
  set: function(selection, attr, obj) {
    attr = attr + "Style";
    selection.each(function() {
      if (obj[attr] != null && (typeof obj[attr] === 'object' || myVar instanceof Object)) {
        Object.keys(obj[attr]).forEach(function(k) {
          selection.style(k.replace(/([A-Z]+)/g, "-$1").replace(/^-/, "").toLowerCase(), function() { return obj[attr][k]; });
        });
      }
    });
  }

};

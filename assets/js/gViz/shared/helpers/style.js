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
  }

};

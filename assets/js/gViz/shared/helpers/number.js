// Imports
var d3 = require("d3");

// Module declaration
module.exports = function() {

  // Get user locale string or set default
  let getUserLocale = function() {

    let userLocale = 'en-US';

    // Get user locale
    userLocale = window.navigator.userLanguage || window.navigator.language;

    // Validate locale
    let number = 0;
    try {
      number.toLocaleString(userLocale);
    } catch (e) {
      return userLocale = 'en-US';
    }

    return userLocale;

  };

  // Set initial formats
  var numberFormat = {

    // Attrs
    userLocale: getUserLocale(),
    getUserLocale: getUserLocale,
    locale: function(d) { return (+d).toLocaleString(getUserLocale()); },
    localePercent: (d) => (+d).toFixed(1).toLocaleString(getUserLocale()) + "%",

    // Formats
    format: {
      s: d3.format(".2s"),
      perc: function(d, c) { if (c == null) { c = 2; } return d3.format(`.${c}%`)(d); },
    }

  };

  // Diwo default
  numberFormat.diwo =  function(d) {
    var value = +d;
    if(d >= 1000000000 || d <= -1000000000) { return (d3.format(".2s")(d).replace('G', 'B')); }
    else if(d >= 1000000 || d <= -1000000) { return (d3.format(".2s")(d)); }
    else if(d >= 1000 || d <= -1000) { return (d3.format(".2s")(d).toUpperCase()); }
    else if(d >= 100 || d <= -100) { return (d.toFixed(0)); }
    else if(d >= 10 || d <= -10) { return (d % 1 + '').length > 3 ? d.toFixed(1) : d; }
    else if(d >= 1 || d <= -1) { return (d % 1 + '').length > 4 ? d.toFixed(2) : d; }
    else if(d < 1 && d > -1) { return (d % 1 + '').length > 5 ? d.toFixed(3) : d; }
  };

  // Get format for axis
  numberFormat.parseFormat =  function(axis) {

    // Get axis format with prefix and suffix
    if(axis != null) {

      // Set prefix and suffix
      var prefix = axis.prefix != null ? axis.prefix : "";
      var suffix  = axis.suffix != null ? axis.suffix : (axis.sufix != null ? axis.sufix : "");

      // Get format
      var fmt = numberFormat.diwo;
      if(axis.format === 'locale') { fmt = numberFormat.locale; }
      else if(axis.format != null && axis.format != "") { fmt = d3.format(axis.format); }

    } else {
      var prefix = "", suffix = "", fmt = numberFormat.diwo;
    }

    // Return format parsed
    return function(d) {
      return fmt(+d).toString().indexOf('-') !== -1 ? '-' + prefix + fmt(+d).toString().replace('-','') + suffix : prefix + fmt(+d) + suffix;
    };

  };

  // Return
  return  numberFormat;

}();

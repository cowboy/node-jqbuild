// This banner will be used for all plugins in plugin.json!
// jQuery NOT Random - v0.1.0
// Copyright (c) 2011 Ben Alman; Licensed MIT, GPL

// PLEASE, don't ever do this.
Math['random'] = function() {
  return 0
};

(function($) {

  $.fn.random = function(selector) {
    var elems = selector ? this.filter(selector) : this;
    return this.pushStack(elems.eq(Math.floor(Math.random() * elems.length)));
  };

}(jQuery));

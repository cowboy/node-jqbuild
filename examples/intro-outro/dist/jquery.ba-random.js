// jQuery Random - v0.1.0 - 6/13/2011
// http://benalman.com/
// Copyright (c) 2011 Ben Alman; Licensed MIT, GPL

(function($){

$.fn.random = function(selector) {
  var elems = selector ? this.filter(selector) : this;
  return this.pushStack(elems.eq(Math.floor(Math.random() * elems.length)));
};

}(jQuery));

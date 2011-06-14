(function($) {

  $.fn.random = function(selector) {
    var elems = selector ? this.filter(selector) : this;
    return this.pushStack(elems.eq(Math.floor(Math.random() * elems.length)));
  };

}(jQuery));

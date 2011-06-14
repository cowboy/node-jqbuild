(function($) {

  $.fn.random = function(selector) {
    debugger;
    var elems = selector ? this.filter(selector) : this;
    var len = elems.length;
    var i = Math.floor(Math.random() * len);
    var elem = elems.eq(i);
    console.log(len, i, elem);
    return this.pushStack(elem);
  };

}(jQuery));

// Ghetto fabulous template system for replacing values in strings. If {{.foo}}
// or {{.bar[0].baz}} is encountered (leading . or ( or [ char), attempt to
// access properties of data object like `data.foo` or `data.bar[0].baz`.
// Alternately, if {{foo}} or {{bar("baz")}} is encountered (no leading dot),
// simply evaluate `foo` or `bar("baz")`. If an error occurs, return empty
// string. Oh yeah, you have to pass the result of ghettoTmpl to eval. :)
// https://gist.github.com/1020250
exports.ghettoTmpl = function(data, str) {
  __ghettoTmpldata = data;
  __ghettoTmplstr = str;
  return "__ghettoTmplstr.replace(/\\{\\{(([.[(])?.*?)\\}\\}/g, function(_, str, dot) {"
    + "return eval('try{' + (dot ? '__ghettoTmpldata' : '') + str + '}catch(e){\"\"}');"
    + "})";
};

// Optionally-recursive merge. Note: not smart enough to ignore non-plain
// objects! Works pretty much like jQuery.extend(), except that any explicitly
// set, null/undefined property value will have its property deleted outright.
exports.merge = function merge() {
  var args = Array.prototype.slice.call(arguments);
  var deep = typeof args[0] == 'boolean' && args.shift();
  var result = args.shift();
  args.forEach(function(obj) {
    obj != null && Object.keys(obj).forEach(function(key) {
      var val = obj[key];
      var empty;
      if ( val == null ) {
        delete result[key];
      } else if ( deep && typeof val == 'object' ) {
        empty = val instanceof Array ? [] : {};
        result[key] = merge(true, typeof result[key] == 'object' ? result[key] : empty, val);
      } else {
        result[key] = val;
      }
    });
  })
  return result;
};

/*function mergeTests() {
  var o;
  o = merge(true, {}, {a: 1, b: 0, c: {x: 1}}, {b: 2, c: {y: 2}}) // { a: 1, b: 2, c: { x: 1, y: 2 } }
  console.log(o);
  o = merge(true, {}, {a: 1, b: 0, c: {x: 1}}, null, {b: 2, c: null}) // { a: 1, b: 2 }
  console.log(o);
  o = merge(true, {}, {a: 1, b: 0, c: {x: 1}}, undefined, {b: 2, c: undefined}) // { a: 1, b: 2 }
  console.log(o);
  o = merge(false, {}, {a: 1, b: 0, c: {x: 1}}, {b: 2, c: {y: 2}}) // { a: 1, b: 2, c: { y: 2 } }
  console.log(o);
  o = merge(false, {}, {a: 1, b: 0, c: {x: 1}}, null, {b: 2, c: null}) // { a: 1, b: 2 }
  console.log(o);
  o = merge(false, {}, {a: 1, b: 0, c: {x: 1}}, undefined, {b: 2, c: undefined}) // { a: 1, b: 2 }
  console.log(o);
}*/

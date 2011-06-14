var colors = require('colors');
var log = require('./log');

var uglifyjs = require('uglify-js');

var Buffer = require('buffer').Buffer;
var zlib = require('zlib');

// Minify with UglifyJS.
// From https://github.com/mishoo/UglifyJS
exports.uglify = function(src, config) {
  log.write('Minifying with UglifyJS...')
  var jsp = uglifyjs.parser;
  var pro = uglifyjs.uglify;
  var ast;

  try {
    ast = jsp.parse(src);
    ast = pro.ast_mangle(ast, config.mangle || {});
    ast = pro.ast_squeeze(ast, config.squeeze || {});
    src = pro.gen_code(ast, config.codegen || {});
    log.ok();
    return src;
  } catch(e) {
    log.error();
    log.indent(function() {
      log.error('[L' + e.line + ':C' + e.col + '] ' + e.message + ' (position: ' + e.pos + ')');
    })
    return false;
  }
};

// Return deflated src input.
exports.gzip = function(src) {
  return zlib.deflate(new Buffer(src));
};

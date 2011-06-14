var colors = require('colors');
var log = require('./log');
var util = require('./util');

var jshint = require('jshint').JSHINT;

// Validate with JSHint.
exports.jshint = function(src, config) {
  //console.log(config.jshint);
  log.write('Validating with JSHint...');
  var opts = util.merge({}, config.jshint);
  if ( config.debug ) {
    opts.devel = true;
    opts.debug = true;
  }
  //console.log(config);
  //console.log(src);
  //console.log(opts);
  var passed = jshint(src, opts);
  //console.log(jshint.errors);
  if ( passed ) {
    log.ok();
  } else {
    log.error();
    log.indent(function() {
      jshint.errors.forEach(function(e) {
        if ( !e ) { return; }
        var str = e.evidence ? e.evidence.inverse + ' <- ' : '';
        log.error('[L' + e.line + ':C' + e.character + '] ' + str + e.reason);
      });
    });
  }
  return passed;
}
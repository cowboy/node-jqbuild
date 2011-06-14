var fs = require('fs');
var path = require('path');
var util = require('./util');
var log = require('./log');

// Read a file.
exports.read = function(filepath) {
  var src;
  log.write('Reading ' + filepath + '...');
  try {
    src = fs.readFileSync(filepath, 'UTF-8');
    log.ok();
    return src;
  } catch(e) {
    log.error();
    log.indent(function() {
      log.error(e.message);
    });
    return false;
  }
};

// Write a file.
exports.write = function(filepath, contents, opts) {
  if ( opts.nowrite ) {
    log.writeln('Not'.underline + ' writing ' + filepath + ' (dry run).');
    return true;
  }
  log.write('Writing ' + filepath + '...');
  try {
    fs.writeFileSync(filepath, contents, 'UTF-8');
    log.ok();
    return true;
  } catch(e) {
    log.error();
    log.indent(function() {
      log.error(e);
    });
  }
};

// Read and parse a JSON file.
exports.readJson = function(filepath, errmsg, opts) {
  opts = util.merge({pretty: filepath}, opts);
  var result = {};
  var reading = log.write.bind(null, 'Reading ' + opts.pretty + '...');
  if ( filepath ) {
    opts.silent || reading();
    if ( path.existsSync(filepath) ) {
      try {
        result = JSON.parse(fs.readFileSync(filepath, 'UTF-8'));
        opts.silent && reading();
        log.ok();
        //opts.silent || log.ok();
      } catch(e) {
        opts.silent && reading();
        log.error();
        log.error(e.message);
        errmsg && log.error(errmsg);
        result = false;
      }
    } else if ( opts.required ) {
      opts.silent && reading();
      log.error();
      log.error('Error reading file ' + opts.pretty + '.');
      errmsg && log.error(errmsg);
      result = false;
    }
  }
  return result;
};

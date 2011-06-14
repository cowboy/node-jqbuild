var nopt = require('nopt');
var path = require('path');

// Acceptable --xxx or -x CLI flags.
var options = exports._options = {
  banner: {
    short: 'b',
    desc: 'Specify an alternate top banner template.*',
    type: String
  },
  config: {
    short: 'c',
    desc: 'Specify a custom jqbuild.json config file.',
    type: String
  },
  debug: {
    short: 'd',
    desc: 'Allow console, alert, etc in lint (JSHint "devel"). Also \nwrites debugging comments into built "dev" scripts.*',
    type: Boolean
  },
  force: {
    short: 'f',
    desc: 'A way to force your way past errors. Want a suggestion?\nDon\'t use this option, fix your errors.*',
    type: Boolean
  },
  help: {
    short: 'h',
    desc: 'Display this help text.',
    type: Boolean
  },
  pluginjson: {
    short: 'p',
    desc: 'Specify an alternate plugin.json file.',
    type: path
  },
  prelint: {
    desc: 'Lint both before and after concatenation. To lint only AFTER\nconcatentation, use --no-prelint.*',
    type: Boolean
  },
  version: {
    short: 'v', // TODO: implement
    desc: '',
    type: Boolean
  },
  write: {
    desc: 'Write files. For a dry run, use --no-write.*',
    type: Boolean
  }
};

// Acceptable actions.
var actions = exports._actions = {
  make: 'Validate code (JSHint) and build (concat, add banner) distribution .js\nfiles (UglifyJS). This is the default action if none is specified.'/*,
  init: 'Generate sample dirs, files and plugin.json.\n(additional options needed??)'*/
};

// Parse `options` into a form that nopt can handle.
var keys = Object.keys(options);
var known = {};
keys.forEach(function(k) { known[k] = options[k].type; });
var aliases = {};
keys.forEach(function(k) { var s = options[k].short; if ( s ) { aliases[s] = '--' + k; } });
var parsed = nopt(known, aliases, process.argv, 2);
//console.dir(parsed); process.exit();

var args = exports.args = parsed.argv.remain;
delete parsed.argv;
var opts = exports.opts = parsed;
var action = exports.action = args[0] in actions ? args.shift() : Object.keys(actions)[0];
//console.dir(opts); console.dir(action); console.dir(args); process.exit();

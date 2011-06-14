// Return a path relative to the jqbuild module root.
var path = require('path');
var rpath = path.join.bind(null, __dirname, '..');
//require.paths.unshift(rpath('lib')); // REMOVE?

var now = new Date;

var colors = require('colors');
var dateFormat = require('dateformat');

var pkg = require('./jqbuild/pkginfo');
var cli = require('./jqbuild/cli');
var log = require('./jqbuild/log');
var file = require('./jqbuild/file');
var util = require('./jqbuild/util');
var lint = require('./jqbuild/lint');
var minify = require('./jqbuild/minify');

// Output some version info, etc at the very start.
log.writeln((pkg.name + ' v' + pkg.version + ' by ' + pkg.author.replace(/<.*/, '')).cyan);

// Only output version if --version specified.
cli.opts.version && process.exit();

log.writeln();

// Usage info (can be displayed with --help).
cli.opts.help && require('./jqbuild/help');

// Read and parse all specified config options.
log.writeln('CONFIG'.cyan);
log.indent(1);

var jqbuild = {};

// Config options.
jqbuild.config = {
  // Base config. All boolean defaults are false (see the `options` object).
  defaults: require('./jqbuild/defaults'),

  // Parse ~/.jqbuild, if it exists. BAD IDEA??
  local: file.readJson('jqbuild.json',
    'The jqbuild.json file is invalid or cannot be read.',
    {silent: true}) || fatality(),

  // Parse --config jqbuild.json, if it exists.
  conf: file.readJson(cli.opts.config,
    'The specified config file is invalid or cannot be read.',
    {required: true}) || fatality(),

  // Merge configs.
  merge: function() {
    var args = Array.prototype.slice.call(arguments);
    return util.merge.apply(null, [true, {}].concat(args.map(function(v) {
      return typeof v == 'string' ? jqbuild.config[v] : v;
    })));
  },
};

// Parse plugin.json file
var pluginjson = jqbuild.config.merge('defaults', 'local', 'conf', cli.opts).pluginjson;
jqbuild.plugins = file.readJson(pluginjson,
  'A valid plugin.json file is required. Use --help for more information.',
  {required: true, pretty: 'plugin.json'}) || fatality();

log.indent(-1);

// Iterate over all plugins.
var keys = cli.args.length ? cli.args : Object.keys(jqbuild.plugins);

if ( !keys.length ) {
  log.writeln();
  log.error('No plugins found in plugin.json.');
  fatality();
}

keys.forEach(function(name) {
  var dev, prod, gzip, min, linterror;
  var errlen = log.errors.length;
  var plugin = jqbuild.plugins[name];
  log.writeln();
  log.writeln(('PLUGIN ' + (plugin ? plugin.label : '???') + ' (' + name + ')').cyan);
  if ( !plugin ) {
    log.indent(function() {
      log.error('PLUGIN ' + name + ' not found!');
    });
    return;
  }
  log.indent(1);
  // Get plugin-specific jqbuild data.
  var plbuild = plugin.jqbuild || {};
  // Merge config data.
  var config = jqbuild.config.merge('defaults', 'local', plbuild.config, 'conf', cli.opts);
  //console.dir(config);
  // Build banner from plugin metadata.
  var banner = eval(util.ghettoTmpl(plugin, typeof config.banner == 'string' ? config.banner : ''));
  if ( banner ) { banner += '\n'; }

  // Iterate through sources, concatenating..
  if ( !plbuild.src || !plbuild.src.length ) {
    log.error('No "src" files defined in plugin.json.');
    log.indent(-1);
    return;
  }

  var src = plbuild.src.map(function(path) {
    var src = file.read(path);
    if ( src === false ) { return; }
    // Don't lint if --no-prelint was set, in cases where source files contain
    // and intro.js + outro.js, for example.
    if ( config.prelint ) {
      log.indent(function() {
        linterror = !lint.jshint(src, config) || linterror;
      });
    }
    // If --debug was set, prepend a comment before each source file.
    if ( config.debug ) {
      src = '// SOURCE: ' + path + '\n\n' + src;
    }
    return src;
  }).join('\n');

  if ( linterror ) {
    if ( plbuild.src.length >= 2 ) {
      log.error('Errors were encountered. To disable pre-concat lint, use --no-prelint.');
    }
  } else if ( log.errors.length > errlen ) {
    log.error('Errors were encountered.');
    log.indent(-1);
    return;
  }

  // Dev (uncompressed) version.
  dev = banner + '\n' + src;

  // Only mention concatenation or lint here if 2+ scripts were concatenated!
  if ( plbuild.src.length >= 2 ) {
    log.write('Concatenating ' + plbuild.src.length + ' scripts...');
    src ? log.ok() : log.error();
    log.indent(function() {
      linterror = !lint.jshint(dev, config) || linterror;
    });
  }

  // If errors have occurred, abort unless --force used.
  if ( log.errors.length > errlen ) {
    if ( config.force ) {
      log.error('Errors were encountered, --force was used. Continuing.');
    } else {
      log.error('Errors were encountered, aborting build. Use --force to build regardless.');
      log.indent(-1);
      return;
    }
  }

  // Write out distribution versions.
  if ( plugin.dist && (plugin.dist.prod || plugin.dist.dev) ) {
    if ( plugin.dist.prod ) {
      // Minify
      min = minify.uglify(src, config.uglify);
      if ( min !== false ) {
        // Production (compressed) version.
        prod = banner + min;
        // Length of gzipped production version.
        gzip = minify.gzip(prod).length + '';
        // Write production version.
        if ( file.write(plugin.dist.prod, prod, {nowrite: !config.write}) ) {
          // Some useful information.
          log.indent(function() {
            log.writeln('Compressed size: ' + gzip.yellow + ' bytes gzipped (' + (prod.length + '').yellow + ' bytes minified).');
          });
        }
      }
    }
    if ( plugin.dist.dev ) {
      // Write dev version.
      if ( file.write(plugin.dist.dev, dev, {nowrite: !config.write}) ) {
        log.indent(function() {
          log.writeln('Uncompressed size: ' + (dev.length + '').yellow + ' bytes.');
        });
      }
    }
  } else {
    log.error('No distribution files defined in plugin.json, nothing to build!');
  }
  log.indent(-1);
});

// Was everything successful?
log.indent(0);
log.writeln();
if ( log.errors.length ) {
  // Whoops?
  log.error('Done, but with errors.');
  process.exit(2);
} else {
  // Everything finished up A-OK.
  log.ok('All done!');
  process.exit(0);
}

// Something really bad happened.
function fatality() {
  log.indent(0);
  log.writeln();
  log.error('An unrecoverable error occurred, exiting.');
  process.exit(1);
}

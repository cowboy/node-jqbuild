var pkg = require('./pkginfo');
var cli = require('./cli');
var log = require('./log');
var util = require('./util');

var arr = [
  '  ' + pkg.description,
  '  ' + pkg.homepage,
  '## Usage:',
  '  jqbuild [options] [action] [plugins]',
  '## Options:'
];

Object.keys(cli._options).forEach(function(long) {
  var str;
  var opt = cli._options[long];
  if ( opt.desc ) {
    str = eval(util.ghettoTmpl(opt, (opt.short ? '  -{{.short}},' : '     ') + ' --{{long}} {{.desc}}'));
    arr.push(log.pad(20, /  (-\S,|   ) --\S+/g, str));
  }
});

arr.push(
  '',
  '  Any listed option with a ' + '*'.green + ' can be set for all plugins in jqbuild.json, or on a',
  '  per-plugin basis in plugin.json. Any option can be negated on the command line',
  '  using --no-optname (false) and un-negated using --optname (true).',
  '',
  '  Options are overridden in this order: 1) internal defaults, 2) jqbuild.json,',
  '  3) --config jqbuild.json file, 4) plugin.json, 5) command line flags.',
  '## Actions:'
);

Object.keys(cli._actions).forEach(function(action) {
  var str = eval(util.ghettoTmpl(cli._actions, '  <{{action}}> {{.' + action + '}}'));
  arr.push(log.pad(10, /<.*?>/g, str));
});

log.writelns(arr);

process.exit();
'defaults', 'local', plbuild.config, 'conf', cli.opts
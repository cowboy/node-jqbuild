var errors = exports.errors = [];

// Strip colors from colorized strings.
var uncolorRe = new RegExp('\033\\[\\d+m', 'g');
var uncolor = exports.uncolor = function(str) {
  return str.replace(uncolorRe, '');
};

// String padding stuff.
var pad = exports.pad = function(n, re, str) {
  var p = Array(n + 1).join(' ');
  return str.replace(/\n/g, '\n' + p).replace(re, function(s) {
    return s + p.substr(uncolor(s).length + 1);
  });
};

// Increase/decrease indentation.
var indent = exports.indent = function(n) {
  if ( indent.i == null ) { indent.i = 0; }
  if ( typeof n == 'function' ) {
    indent.i++; n(); indent.i--;
  } else if ( n === 0 ) {
    indent.i = 0;
  } else {
    indent.i += n;
  }
};

// Error.
var error = exports.error = function(txt) {
  if ( txt ) {
    errors.push(txt);
    writeln('>> '.red + txt);
  } else {
    write('ERROR'.red + '\n', true);
  }
};

// Ok.
var ok = exports.ok = function(txt) {
  if ( txt ) {
    writeln('>> '.green + txt);
  } else {
    write('OK'.green + '\n', true);
  }
};

// Write some text, without a linefeed, indenting if necessary.
var write = exports.write = function(txt, noindent) {
  var i = indent.i || 0;
  var prefix = Array(i + 1).join(' ');
  process.stdout.write((noindent ? '' : prefix) + (txt || ''));
};

// Write some text, with a linefeed.
var writeln = exports.writeln = function(txt) {
  write(txt);
  write('\n');
};

// Write many lines of text.
var writelns = exports.writelns = function(a) {
  var b = typeof a == 'string' ? Array.prototype.slice.call(arguments) : a;
  b.forEach(function(line) {
    writeln(line
      .replace(/\*$/g, function(s) { return s.green; })
      .replace(/^## (.+)/g, function(_, s) { return '\n' + s.underline.cyan + '\n'; })
      .replace(/ --[\w-]+| -\w/g, function(s) { return s.yellow; })
      .replace(/<(\w+)>/g, function(_, s) { return s.yellow; })
    );
  });
};

// If you use a custom jqbuild.json file, it will have this exact same structure
// except that it will need to be valid JSON (ie. no comments, no string concat)
// and should only contain the keys you wish to override.
//
// If you only have one plugin, or want per-plugin settings, you may specify
// these settings in a "config" key under the "jqbuild" key in that plugin's
// JSON data.
//
// Per-plugin configuration options will override options set in jqbuild.json.

module.exports = {
  // Options that have a non-falsy default value:
  "banner": "// {{.label}} - v{{.versions[0].version}} - {{dateFormat(now, 'm/d/yyyy')}}\n"
    + "// {{.homeurl}}\n"
    + "// {{.copyright}}; Licensed {{.license.join(', ')}}",
  "pluginjson": "plugin.json",
  "prelint": true,
  "write": true,
  // Non-string/boolean options, like the following, can only be overridden in
  // jqbuild.json or plugin.json:
  //
  // These are the default JSHint options I recommend. See jshint.com for more
  // information.
  "jshint": {
    // Force curly braces.
    "curly": true,
    // Allow == null
    "eqnull": true,
    // Allow for in without hasOwnProperty check (jQuery assumes that nothing
    // has been added to Object.prototype anyways, so it"s a moot point).
    "forin": true,
    // Require IIFEs to be wrapped in ().
    "immed": true,
    // Constructor functions must be capitalized.
    "newcap": true,
    // No arguments.caller and arguments.callee. Use NFEs instead.
    "noarg": true,
    // All non-global vars must be defined before they are used.
    "undef": true,
    // Allow browser globals, such as window, document, etc.
    "browser": true,
    // Only the jQuery global var is allowed, as $ will causes issues in
    // noConflict scenarios. Use an IIFE instead of JSHint"s 'jquery' option!
    "predef": ["jQuery"]
  },
  // These are the default Uglify-JS options I recommend. See the docs at
  // https://github.com/mishoo/UglifyJS/ for more information.
  "uglify": {
    // Options passed to ast_mangle().
    "mangle": {
      // Don"t mangle $, because it looks cool.
      "except": ["$"]
    },
    // Options passed to ast_squeeze().
    "squeeze": {},
    // Options passed to gen_code().
    "codegen": {}
  }
};
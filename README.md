# jqbuild

A command line build tool for jQuery plugins.

_(coming soon)_

## Installation

    npm install -g jqbuild

## Usage

    $ jqbuild --help
    jqbuild v0.1.0 by "Cowboy" Ben Alman 

      A command line build tool for jQuery plugins.
      http://github.com/cowboy/node-jqbuild

    Usage:

      jqbuild [options] [action] [plugins]

    Options:

      -b, --banner      Specify an alternate top banner template.*
      -c, --config      Specify a custom jqbuild.json config file.
      -d, --debug       Allow console, alert, etc in lint (JSHint "devel"). Also 
                        writes debugging comments into built "dev" scripts.*
      -f, --force       A way to force your way past errors. Want a suggestion?
                        Don't use this option, fix your errors.*
      -h, --help        Display this help text.
      -p, --pluginjson  Specify an alternate plugin.json file.
          --prelint     Lint both before and after concatenation. To lint only AFTER
                        concatentation, use --no-prelint.*
          --write       Write files. For a dry run, use --no-write.*

      Any listed option with a * can be set for all plugins in jqbuild.json, or on a
      per-plugin basis in plugin.json. Any option can be negated on the command line
      using --no-optname (false) and un-negated using --optname (true).

      Options are overridden in this order: 1) internal defaults, 2) jqbuild.json,
      3) --config jqbuild.json file, 4) plugin.json, 5) command line flags.

    Actions:

      make    Validate code (JSHint) and build (concat, add banner) distribution .js
              files (UglifyJS). This is the default action if none is specified.

## Examples

Look in the examples folder for sample plugin.json and jqbuild.json files, as well as sample directory structures.

_Note: the plugin.json format shown here has NOT yet been finalized, so it will very likely change!_

## Sample output

    $ jqbuild
    jqbuild v0.1.0 by "Cowboy" Ben Alman

    CONFIG
     Reading jqbuild.json...OK
     Reading plugin.json...OK

    PLUGIN jQuery Random (jquery-random)
     Reading src/random.js...OK
      Validating with JSHint...OK
     Minifying with UglifyJS...OK
     Writing dist/jquery.ba-random.min.js...OK
      Compressed size: 217 bytes gzipped (276 bytes minified).
     Writing dist/jquery.ba-random.js...OK
      Uncompressed size: 345 bytes.

    PLUGIN jQuery NOT Random (jquery-not-random)
     Reading src/not-random.js...OK
      Validating with JSHint...OK
     Reading src/random.js...OK
      Validating with JSHint...OK
     Concatenating 2 scripts...OK
      Validating with JSHint...OK
     Minifying with UglifyJS...OK
     Writing dist/jquery.ba-notrandom.min.js...OK
      Compressed size: 230 bytes gzipped (311 bytes minified).
     Writing dist/jquery.ba-notrandom.js...OK
      Uncompressed size: 425 bytes.

    >> All done!

## Release History
Nothing yet...

## License
Copyright (c) 2011 "Cowboy" Ben Alman  
Dual licensed under the MIT and GPL licenses.  
<http://benalman.com/about/license/>

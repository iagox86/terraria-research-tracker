# Terraria Research Tracker

This library parses Terraria Journey Mode save files (`.plr`) and determines
which items have been researched and which are still missing.

I built this with the hopes that it could be some day be integrated into
https://www.terrariachecklist.com/ :)

You can check out a functional demo [here](https://terraria.skullsecurity.org):
https://terraria.skullsecurity.org

## Usage

### API

This library exports a handful of functions:

```js
terrariaResearchTracker.get_research_data(save_file);
terrariaResearchTracker.researched(save_file);
terrariaResearchTracker.not_researched(save_file);
terrariaResearchTracker.researched_ids(save_file);
terrariaResearchTracker.not_researched_ids(save_file);
```

`get_research_data()` returns a big table of every item, including the number
the player has researched (if any) and a boolean indicating if the research
is complete.

`researched()` and `not_researched()` return arrays of item name that have or
have not been researched, respectively.

`researched_ids()` and `not_researched_ids()` are the same, except they return
a list of id values.

The `data` field is a `string` (or `Buffer`) representing a .plr file from
Terraria.

### npm (build)

To build for npm, use `npm run-script build`:

```sh
$ npm run-script build

> terraria-research-tracker@1.0.2 build /home/ron/projects/terraria-research-tracker
> babel ./src --out-dir ./dist --source-maps --copy-files

Successfully compiled 2 files with Babel (1389ms).
```

### npm (import)

To install this library via npm, simply use `npm install`:

```
$ npm install --save terraria-research-tracker

+ terraria-research-tracker@1.0.2
added 51 packages from 19 contributors and audited 51 packages in 2.532s

4 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Then you can import it and execute functions:

```js
$ cat index.js
const r = require('terraria-research-tracker');

console.log(r);
r.researched(...filedata...);
```

See above for the API!

### Browser (build)

This can be compiled to a simple browser file that can be imported from the web.
The [compiled file](browser/terraria-research-tracker.js) is available
in the repo, or you can build it yourself:

```sh
$ npm run-script build-browser

> terraria-research-tracker@1.0.2 build-browser /home/ron/projects/terraria-research-tracker
> webpack

[...]

webpack 5.24.3 compiled with 3 warnings in 6920 ms
```

### Browser (import)

You can import the built browser file using `<script src=...>`, as demonstrated
in [browser/demo.html](/browser/demo.html):

```html
<script src='terraria-research-tracker.js'></script>

<script>
  console.log(terrariaResearchTracker);
  console.log(terrariaResearchTracker.researched(...playerdata...));
</script>
```

### Test

You can also run my unit tests:

```sh
$ npm test

> terraria-research-tracker@1.0.2 test /home/ron/projects/terraria-research-tracker
> mocha --require esm



  Simple Test
    ✓ Get research data works
    ✓ Helper functions work (39ms)
    ✓ Handles files with many spawnpoints
    ✓ Handles invalid character files
    ✓ Handles missing character files
    ✓ Handles bad version character files
    ✓ Handles non-journey mode character


  7 passing (61ms)
```

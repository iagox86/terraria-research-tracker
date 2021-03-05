# Terraria Research Tracker

This library parses Terraria Journey Mode save files (`.plr`) and determines
which items have been researched and which are still missing.

I built this with the hopes that it could be some day be integrated into
https://www.terrariachecklist.com/ :)

You can check out a functional demo [here](https://terraria.skullsecurity.org):
https://terraria.skullsecurity.org

## Usage

This compiles to just a simple JavaScript file that can be imported by any
web site. The [compiled file](dist/terraria-research-tracker.js) is available
in the repo.

Once it's imported, you can access the functions via the
`terrariaResearchTracker` global, passing in a save file's raw data:

```js
<script>
  console.log(terrariaResearchTracker.get_research_data(save_file));
  console.log(terrariaResearchTracker.researched(save_file));
  console.log(terrariaResearchTracker.not_researched(save_file));
  console.log(terrariaResearchTracker.researched_ids(save_file));
  console.log(terrariaResearchTracker.not_researched_ids(save_file));
</script>
```

`get_research_data()` returns a big table of every item, including the number
the player has researched (if any) and a boolean indicating if the research
is complete.

`researched()` and `not_researched()` return arrays of item name that have or
have not been researched, respectively.

`researched_ids()` and `not_researched_ids()` are the same, except they return
a list of id values.

The `data` field is a `string` (or `Buffer`) representing a .plr file from
Terraria. The [demo.html](/dist/demo.html) file shows how that can be handled
purely in-browser.

## Build

To build:

```
npm i
npm run-script build
```

To run unit tests:

```
npm i
npm test
```

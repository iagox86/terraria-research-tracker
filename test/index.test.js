import path from 'path';
import { assert } from 'chai';
import fs from 'fs';

import { get_research_data, researched, not_researched, researched_ids, not_researched_ids } from '../src/index.js';

const TEST_PATH = path.resolve(__dirname, 'testdata');

describe('Simple Test', () => {
  it('Get research data works', function() {
    const data = get_research_data(fs.readFileSync(`${ TEST_PATH }/TestChar.plr`));

    assert.equal(1, data.IronPickaxe.id);
    assert.equal(1, data.IronPickaxe.needed);
    assert.equal(1, data.IronPickaxe.has);
    assert.equal(true, data.IronPickaxe.researched);

    assert.equal(6, data.IronShortsword.id);
    assert.equal(1, data.IronShortsword.needed);
    assert.equal(1, data.IronShortsword.has);
    assert.equal(true, data.IronShortsword.researched);

    assert.equal(2, data.DirtBlock.id);
    assert.equal(100, data.DirtBlock.needed);
    assert.isUndefined(data.DirtBlock.has);
    assert.isUndefined(data.DirtBlock.researched);
  });

  it('Helper functions work', function() {
    const data_researched = researched(fs.readFileSync(`${ TEST_PATH }/TestChar.plr`));
    assert.sameMembers(['IronPickaxe', 'IronShortsword'], data_researched);

    const data_ids_researched = researched_ids(fs.readFileSync(`${ TEST_PATH }/TestChar.plr`));
    assert.sameMembers([1, 6], data_ids_researched);

    const data_not_researched = not_researched(fs.readFileSync(`${ TEST_PATH }/TestChar.plr`));
    assert.notIncludeMembers(data_not_researched, ['IronPickaxe', 'IronShortsword']);
    assert.includeMembers(data_not_researched, ['GoldPickaxe', 'LeadShortsword']);

    const data_not_researched_ids = not_researched_ids(fs.readFileSync(`${ TEST_PATH }/TestChar.plr`));
    assert.notIncludeMembers(data_not_researched_ids, [1, 6]);
    assert.includeMembers(data_not_researched_ids, [2, 3, 4, 5, 100]);
  });

  it('Handles invalid character files', function() {
    assert.throws(() => {
      get_research_data(fs.readFileSync(`${ TEST_PATH }/InvalidChar.plr`));
    }, /invalid/i);
  });

  it('Handles missing character files', function() {
    assert.throws(() => {
      get_research_data('');
    }, /invalid/i);
  });

  it('Handles bad version character files', function() {
    assert.throws(() => {
      get_research_data(fs.readFileSync(`${ TEST_PATH }/BadVersion.plr`));
    }, /only supports 4\./i);
  });

  it('Handles non-journey mode character', function() {
    assert.throws(() => {
      get_research_data(fs.readFileSync(`${ TEST_PATH }/NotJourneyMode.plr`));
    }, /only supports journey/i);
  });
});

import assert from 'assert';
import fs from 'fs';

import { researched, not_researched, researched_ids, not_researched_ids, get_research_data } from '../src/index.js';

describe('Simple Test', () => {
  it('Has things that work', () => {
    console.log(not_researched(fs.readFileSync('/home/ron/tmp/terraria/Almech3.plr')));
    //console.log(not_researched_ids(fs.readFileSync('/home/ron/tmp/terraria/TestChar.plr')));
  });
});

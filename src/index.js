import crypto from 'crypto';
import _ from 'lodash';

import { items } from './items.js';

const ALGORITHM = 'aes-128-cbc';
const KEY = 'h\x003\x00y\x00_\x00g\x00U\x00y\x00Z\x00';
const IV = KEY;

const NAME_OFFSET = 0x18;
const SPAWN_POINT_OFFSET = 0x99c;
const JOURNEY_OFFSET = 0x6b;

const GAME_MODES = [
  'Classic',
  'Medium Core',
  'Hard Core',
  'Journey',
];

const SUPPORTED_VERSIONS = [234];

const decrypt = (data) => {
  if(typeof data === 'string') {
    data = Buffer.from(data, 'ascii');
  }
  console.log('type', typeof data);
  console.log(`Decrypting ${ data.length } bytes...`);
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
  return Buffer.concat([decipher.update(data), decipher.final()]);
};

const read_lpstring = (buffer, offset) => {
  const length = buffer.readInt8(offset);
  const end = offset + 1 + length;
  return [buffer.toString('utf8', offset + 1, end), end];
};

export const get_research_data = (file_data) => {
  const data = decrypt(file_data);

  const version = data.readInt16LE();
  if(!SUPPORTED_VERSIONS.includes(version)) {
    console.error('This library only supports 3.4.1.2 (and others with the same format)');
    return;
  }

  let pos = NAME_OFFSET;
  [, pos] = read_lpstring(data, pos);

  const mode = GAME_MODES[data.readUInt8(pos)] || 'Unknown!';

  if(mode !== 'Journey') {
    console.error('Not a Journey Mode character');
    return;
  }

  // Skip over everything up to the spawn points, all of which is
  // thankfully static
  pos += SPAWN_POINT_OFFSET;

  // Read spawnpoint data until we get to -1, which is the terminator
  while(data.readInt32LE(pos) !== -1) {
    // Skip X + Y + Seed (each are 32 bits)
    pos += 12;

    // Read the world name
    [, pos] = read_lpstring(data, pos);
  }

  // Skip over the next part - not sure what this data is
  pos += JOURNEY_OFFSET;

  // Clone the items object
  const results = { ...items };
  for(;;) {
    let item;
    [item, pos] = read_lpstring(data, pos);
    if(item.length === 0) {
      break;
    }

    const quantity = data.readInt32LE(pos);
    pos += 4;

    // console.log(`${ name } has researched ${ quantity } ${ item }(s)`);

    if(!results[item]) {
      console.warn(`Uh oh! Missing item: ${ item }`);
      continue;
    }

    results[item].has = quantity;
    results[item].researched = items[item].needed <= quantity;
  }

  return results;
};

export const researched = (file_data) => {
  return _.chain(get_research_data(file_data))
    // Get only researched things
    .pickBy((value) => {
      return value.researched;
    })

    // Only item names
    .keys()
    .value();
};

export const not_researched = (file_data) => {
  return _.chain(get_research_data(file_data))
    // Get only researched things
    .pickBy((value) => {
      return !value.researched;
    })

    // Only item names
    .keys()
    .value();
};

export const researched_ids = (file_data) => {
  const data = researched(file_data);
  return _.map(data, (d) => items[d].id);
};

export const not_researched_ids = (file_data) => {
  const data = not_researched(file_data);
  return _.map(data, (d) => items[d].id);
};

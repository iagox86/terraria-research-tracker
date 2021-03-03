import fs from 'fs';
import crypto from 'crypto';

const ALGORITHM = 'aes-128-cbc';
const KEY = 'h\x003\x00y\x00_\x00g\x00U\x00y\x00Z\x00';
const IV = KEY;

const NAME_OFFSET = 24;

const GAME_MODES = [
  'Classic',
  'Medium Core',
  'Hard Core',
  'Journey',
];

const decrypt = (data) => {
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
  return Buffer.concat([decipher.update(data), decipher.final()]);
};

const read_lpstring = (buffer, offset) => {
  const length = buffer.readInt8(offset);
  const end = offset + 1 + length;
  return [buffer.toString('utf8', offset + 1, end), end];
};

export const go2 = (filename) => {
  const encrypted = fs.readFileSync(filename);

  const data = decrypt(encrypted);

  const version = data.readInt16LE();
  if(version !== 234) {
    console.error('This library only supports 1.4.1.2 (and others with the same format)');
  }

  let pos = NAME_OFFSET;
  let name;
  [name, pos] = read_lpstring(data, pos);

  console.log(`Name: ${ name }`);
  const mode = GAME_MODES[data.readUInt8(pos)] || 'Unknown!';
  console.log(`Mode: ${ mode }`);

  // Skip over everything up to the spawn points, all of which is
  // thankfully static
  pos += 0x99c;

  // Read spawnpoint data until we get to -1, which is the terminator
  while(data.readInt32LE(pos) !== -1) {
    // Skip X + Y + Seed
    pos += 12;

    // Read the world name
    [, pos] = read_lpstring(data, pos);
  }

  // Skip over the next part - not sure what this data is
  pos += 0x6b;

  for(;;) {
    let item;
    [item, pos] = read_lpstring(data, pos);
    if(item.length === 0) {
      break;
    }

    const quantity = data.readInt32LE(pos);
    pos += 4;

    console.log(`${ name } has researched ${ quantity } ${ item }(s)`);
  }

  console.log('Done?');
  // console.log(data.slice(pos));
  // let test = data.readUInt32LE(pos);
  // console.log(test);

  // console.log(data.slice(test));
};

export const go = () => {
  //go2('/home/ron/tmp/terraria/Almech.plr');
  //go2('/home/ron/tmp/terraria/Almech2.plr');
  //go2('/home/ron/tmp/terraria/TestChar.plr');
}

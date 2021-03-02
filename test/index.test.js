import { welcome } from '../src/index.js';

const assert = require('assert');
describe('Simple Test', () => {
  it('Should welcome', () => {
    assert.equal('Welcome!', welcome());
  });
});

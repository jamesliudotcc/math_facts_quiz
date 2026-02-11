import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('', { url: 'http://localhost' });
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;

test('basic test setup works', () => {
  assert.equal(1 + 1, 2);
});

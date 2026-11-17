import assert from 'node:assert/strict';
import test from 'node:test';
import { selectDay } from './rules.mjs';

test('keeps the selected day and day-pass cost', () => {
  assert.deepEqual(selectDay('2026-11-19'), { label: 'Thursday, November 19', price: 28 });
  assert.throws(() => selectDay('2026-11-17'), RangeError);
});

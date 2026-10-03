const test = require('node:test');
const assert = require('node:assert/strict');

const { getCurrentDateValue, resolveDateInput } = require('./date');

test('getCurrentDateValue returns today in YYYY-MM-DD format', () => {
  const value = getCurrentDateValue();

  assert.match(value, /^\d{4}-\d{2}-\d{2}$/);
});

test('resolveDateInput uses a provided date and falls back to today', () => {
  assert.equal(resolveDateInput('2025-12-30'), '2025-12-30');
  assert.match(resolveDateInput(''), /^\d{4}-\d{2}-\d{2}$/);
  assert.match(resolveDateInput(null), /^\d{4}-\d{2}-\d{2}$/);
});

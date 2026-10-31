'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { book, flights } = require('../server');

test('booking reserves seats and a seat cannot be sold twice', () => {
  const f = flights[0];
  const seat = f.unsoldSeats[0];
  const [code, b] = book({ flightId: f.id, seats: [seat], name: 'Test User', mode: 'buy' });
  assert.strictEqual(code, 201);
  assert.ok(b.pnr);
  assert.strictEqual(book({ flightId: f.id, seats: [seat], name: 'Other', mode: 'buy' })[0], 409);
});
test('booking requires a name and at least one seat', () => {
  assert.strictEqual(book({ flightId: flights[1].id, seats: [], name: 'A' })[0], 400);
  assert.strictEqual(book({ flightId: flights[1].id, seats: [flights[1].unsoldSeats[0]], name: '' })[0], 400);
});
test('a low bid is rejected with 422', () => {
  const f = flights[2];
  assert.strictEqual(book({ flightId: f.id, seats: [f.unsoldSeats[0]], name: 'A', mode: 'bid', bid: 10 })[0], 422);
});

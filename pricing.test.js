'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { currentPrice, evaluateBid } = require('../lib/pricing');

const flight = () => ({ id: 'T1', basePrice: 5000, floorPrice: 2000, hoursToDeparture: 6, unsoldSeats: ['1A', '1B', '1C', '1D'] });

test('price is never below the airline floor', () => {
  assert.ok(currentPrice({ ...flight(), floorPrice: 4900 }) >= 4900);
});
test('price drops as departure gets closer', () => {
  assert.ok(currentPrice({ ...flight(), hoursToDeparture: 2 }) < currentPrice({ ...flight(), hoursToDeparture: 40 }));
});
test('priority categories get a lower or equal price than general', () => {
  assert.ok(currentPrice(flight(), 'student') <= currentPrice(flight(), 'general'));
});
test('a bid below the minimum is rejected', () => {
  assert.strictEqual(evaluateBid(flight(), 'general', 100).accepted, false);
});
test('a bid above the current price is accepted at the current price', () => {
  const price = currentPrice(flight(), 'general');
  const r = evaluateBid(flight(), 'general', price + 500);
  assert.strictEqual(r.accepted, true);
  assert.strictEqual(r.price, price);
});
test('invalid bid values are rejected', () => {
  assert.strictEqual(evaluateBid(flight(), 'general', NaN).accepted, false);
});

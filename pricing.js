'use strict';
// Pure pricing and bidding rules, kept separate from the server so they can be tested.

const PRIORITY_DISCOUNT = { general: 0, student: 0.10, senior: 0.10, urgent: 0.10 };
const MIN_BID_RATIO = 0.85; // a bid must be at least 85% of the current price

function round10(n) { return Math.round(n / 10) * 10; }

// Discount grows as departure nears and as more seats stay unsold (max 60% off base).
function currentPrice(flight, category = 'general') {
  const hoursFactor = Math.max(0, 1 - Math.min(flight.hoursToDeparture, 48) / 48); // 0..1
  const unsoldRatio = Math.min(1, flight.unsoldSeats.length / 10);                  // 0..1
  const discount = Math.min(0.6, 0.2 + 0.25 * hoursFactor + 0.15 * unsoldRatio);
  const priority = PRIORITY_DISCOUNT[category] ?? 0;
  const price = flight.basePrice * (1 - discount) * (1 - priority);
  return Math.max(flight.floorPrice, round10(price)); // never below the airline's floor
}

// Returns { accepted, price, minimum, reason? } for one seat.
function evaluateBid(flight, category, bid) {
  const price = currentPrice(flight, category);
  const minimum = Math.max(flight.floorPrice, round10(price * MIN_BID_RATIO));
  if (!Number.isFinite(bid) || bid <= 0) return { accepted: false, price, minimum, reason: 'Enter a valid bid amount.' };
  if (bid < minimum) return { accepted: false, price, minimum, reason: `Bid too low. Minimum accepted bid is ₹${minimum}.` };
  return { accepted: true, price: Math.min(bid, price), minimum };
}

module.exports = { currentPrice, evaluateBid, PRIORITY_DISCOUNT, MIN_BID_RATIO };

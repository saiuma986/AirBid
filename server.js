'use strict';
// Zero-dependency Node.js server: static files + JSON API. Data is simulated and kept in memory.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { currentPrice, evaluateBid } = require('./lib/pricing');

const PORT = process.env.PORT || 3000;
const flights = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'flights.json'), 'utf8'));
const bookings = [];
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };

function send(res, code, body) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}
function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch { resolve({}); } });
  });
}
function view(f) {
  return { ...f, prices: { general: currentPrice(f, 'general'), student: currentPrice(f, 'student'), senior: currentPrice(f, 'senior'), urgent: currentPrice(f, 'urgent') } };
}

// Shared by /api/book: validates seats, applies price or bid, reserves seats.
function book(body) {
  const f = flights.find((x) => x.id === body.flightId);
  if (!f) return [404, { error: 'Flight not found.' }];
  const seats = Array.isArray(body.seats) ? body.seats : [];
  if (!body.name || !String(body.name).trim()) return [400, { error: 'Enter the passenger name.' }];
  if (seats.length === 0) return [400, { error: 'Select at least one seat.' }];
  if (!seats.every((s) => f.unsoldSeats.includes(s))) return [409, { error: 'One or more seats are no longer available.' }];
  const category = body.category || 'general';
  let perSeat = currentPrice(f, category);
  if (body.mode === 'bid') {
    const r = evaluateBid(f, category, Number(body.bid));
    if (!r.accepted) return [422, { error: r.reason }];
    perSeat = r.price;
  }
  f.unsoldSeats = f.unsoldSeats.filter((s) => !seats.includes(s));
  const booking = { pnr: 'AB' + Math.random().toString(36).slice(2, 8).toUpperCase(), flightId: f.id, name: String(body.name).trim(), seats, category, perSeat, total: perSeat * seats.length };
  bookings.push(booking);
  return [201, booking];
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/flights' && req.method === 'GET') return send(res, 200, flights.map(view));
  if (url.pathname === '/api/book' && req.method === 'POST') { const [c, b] = book(await readBody(req)); return send(res, c, b); }
  const file = path.join(__dirname, 'public', url.pathname === '/' ? 'index.html' : path.normalize(url.pathname).replace(/^(\.\.[\/\\])+/, ''));
  if (!file.startsWith(path.join(__dirname, 'public'))) return send(res, 403, { error: 'Forbidden' });
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, { error: 'Not found' });
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'text/plain' });
    res.end(buf);
  });
});

if (require.main === module) server.listen(PORT, () => console.log(`Airbid running at http://localhost:${PORT}`));
module.exports = { server, book, flights };

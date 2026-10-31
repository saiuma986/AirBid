# Airbid

Airbid helps airlines sell **unsold seats close to departure** at lower prices, so empty seats become affordable travel for everyone. Passengers pick a flight, select their seats, and either buy at the listed price or place a bid.

**Live demo:** https://YOUR-GITHUB-USERNAME.github.io/airbid/ (see "Publish the live demo" below)

> **Prototype note:** this demo uses simulated flights and a mock payment. It does not connect to real airlines or issue real tickets.

## Two parts
- **`index.html`** is the full working prototype: register/login, 4 languages (English, Hindi, Telugu, Tamil), search, seat selection, buy or bid. It runs entirely in the browser, so it works on GitHub Pages with no server.
- **`server.js`, `lib/`, `test/`** are a reference Node.js backend with the same pricing and booking rules, and automated tests.

## Features
- Register and log in (demo accounts are stored only in your browser)
- Interface in English, हिन्दी, తెలుగు and தமிழ்
- Search flights by city, flight number or airline
- Browse flights with last-minute prices that fall as departure nears and unsold seats grow
- Select individual seats from the unsold inventory
- Buy at the listed price, or place a bid (accepted at 85% or more of the listed price)
- Priority pricing for students, senior citizens and urgent travellers (extra 10% off)
- Airline price floor: no seat is ever sold below the price the airline sets
- Instant booking reference; sold seats cannot be double-booked

## Publish the live demo (GitHub Pages)
1. Push this repository to GitHub.
2. Go to **Settings > Pages**, set Source to **Deploy from a branch**, choose branch **main** and folder **/ (root)**, then Save.
3. After a minute the demo is live at `https://YOUR-GITHUB-USERNAME.github.io/airbid/`.

## Setup (reference backend)
Requires **Node.js 18 or newer**. There are no dependencies to install.

```bash
git clone <your-repo-url>
cd airbid
npm start          # then open http://localhost:3000
npm test           # run the test suite
```

### Environment variables
| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | Port the server listens on (see `.env.example`) |

## Project structure
```
server.js          HTTP server and API (/api/flights, /api/book)
lib/pricing.js     Pricing and bidding rules (pure functions)
data/flights.json  Sample flight and unsold-seat data
public/index.html  Web interface
test/              Automated tests (pricing, booking)
docs/ARCHITECTURE.md  Technical design and diagrams
```

## Sample data
`data/flights.json` holds five sample flights, each with a base price, an airline floor price, hours to departure, and a list of unsold seats.

## Roadmap
Real airline API integration, DigiLocker-based eligibility checks for priority groups, UPI payments, regional-language interface, and demand-prediction models for floor-price suggestions.

## License
MIT. See `LICENSE`.

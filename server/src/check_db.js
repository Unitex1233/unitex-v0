const path = require('path');
const fs = require('fs');

// Local check of data/discover_fallback.json for MVP
const fallbackPath = path.join(__dirname, '../../data/discover_fallback.json');
if (!fs.existsSync(fallbackPath)) {
  console.error('Local discover data not found at', fallbackPath);
  process.exit(1);
}

const raw = fs.readFileSync(fallbackPath, 'utf8');
let data = [];
try {
  data = JSON.parse(raw);
} catch (e) {
  console.error('Failed to parse local discover data:', e.message);
  process.exit(1);
}

console.log(`Documents in 'discover_feed': ${Array.isArray(data) ? data.length : 1}`);
if (Array.isArray(data) && data.length > 0) {
  console.log('Sample Document:', JSON.stringify(data[0], null, 2));
}
process.exit(0);

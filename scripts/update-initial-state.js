const fs = require('fs');
const path = require('path');

const sourcePath = process.argv[2];

if (!sourcePath) {
  console.error('Usage: node scripts/update-initial-state.js path/to/comicshelf-all-....json');
  process.exit(1);
}

const raw = fs.readFileSync(path.resolve(sourcePath), 'utf8');
let data;

try {
  data = JSON.parse(raw);
} catch {
  console.error('Invalid JSON file.');
  process.exit(1);
}

if (!data.catalogs || typeof data.catalogs !== 'object') {
  console.error('Expected v5 format with a catalogs object.');
  process.exit(1);
}

const targetPath = path.join(__dirname, '..', 'data', 'initial-state.json');
fs.writeFileSync(targetPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

console.log('Updated data/initial-state.json');
for (const [catalogId, entry] of Object.entries(data.catalogs)) {
  const owned = Array.isArray(entry.owned) ? entry.owned.length : 0;
  const read = Array.isArray(entry.read) ? entry.read.length : 0;
  console.log(`  ${catalogId}: ${owned} owned, ${read} read`);
}

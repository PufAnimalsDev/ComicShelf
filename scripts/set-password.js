const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/set-password.js "your-password"');
  process.exit(1);
}

const hash = crypto.createHash('sha256').update(password, 'utf8').digest('hex');
const configPath = path.join(__dirname, '..', 'js', 'auth-config.js');
const content = `window.ComicShelfAuthConfig = {
  PASSWORD_HASH: '${hash}',
};
`;

fs.writeFileSync(configPath, content, 'utf8');
console.log('Updated js/auth-config.js with SHA-256 hash.');
console.log('Do not commit your plaintext password — only the hash file is stored.');

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getBuildId() {
  if (process.env.GITHUB_SHA) {
    return process.env.GITHUB_SHA.slice(0, 7);
  }

  try {
    return execSync('git rev-parse --short HEAD', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return 'dev';
  }
}

function bustAssetUrl(url, build) {
  const clean = url.split('?')[0];
  if (!/^(css|js|data)\//.test(clean)) {
    return url;
  }
  return `${clean}?v=${build}`;
}

function preparePages() {
  const build = getBuildId();
  const indexPath = path.join(__dirname, '..', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  html = html.replace(
    /window\.ComicShelfBuild\s*=\s*["'][^"']*["']/,
    `window.ComicShelfBuild="${build}"`
  );

  html = html.replace(
    /((?:href|src)=["'])((?:css|js|data)\/[^"?]+)(?:\?v=[^"']*)?(["'])/g,
    (_match, prefix, assetPath, suffix) => `${prefix}${bustAssetUrl(assetPath, build)}${suffix}`
  );

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log(`Prepared index.html for deploy (build ${build}).`);
}

preparePages();

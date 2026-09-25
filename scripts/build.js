const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting CVtoWeb build pipeline...');

// Run standard Next.js build
execSync('next build', { stdio: 'inherit' });

// If building on Cloudflare Pages or OpenNext requested
if (process.env.CF_PAGES || process.env.CLOUDFLARE || process.argv.includes('--cloudflare')) {
  console.log('Cloudflare Pages environment detected. Bundling OpenNext worker...');
  execSync('opennextjs-cloudflare build', { stdio: 'inherit' });
  
  const workerSrc = '.open-next/worker.js';
  const workerDest = '.open-next/assets/_worker.js';
  
  if (fs.existsSync(workerSrc)) {
    fs.copyFileSync(workerSrc, workerDest);
    console.log('Copied OpenNext worker to .open-next/assets/_worker.js for Cloudflare Pages Advanced Mode.');
  }
}

console.log('Build pipeline complete.');

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

console.log('--- Starting CVtoWeb Build & Export Pipeline ---');

// 0. Ensure public/_next is purged and never created (Next.js prohibits public/_next)
const publicDir = 'public';
const publicNextDir = path.join(publicDir, '_next');
if (fs.existsSync(publicNextDir)) {
  console.log('Removing forbidden public/_next directory...');
  fs.rmSync(publicNextDir, { recursive: true, force: true });
}

// 1. Run standard Next.js build
console.log('Compiling Next.js application...');
const nextCmd = process.platform === 'win32' ? 'npx.cmd next build' : 'npx next build';
execSync(nextCmd, { stdio: 'inherit' });

// 2. Sync generated static HTML pages to public/
console.log('Syncing prerendered static pages to public directory for Cloudflare Pages edge delivery...');

const appServerDir = path.join('.next', 'server', 'app');

if (fs.existsSync(appServerDir)) {
  // Map of generated HTML files to public destination paths
  const routeMappings = [
    { src: 'index.html', dests: ['index.html'] },
    { src: 'cv/mazen.html', dests: ['cv/mazen.html', 'cv/mazen/index.html'] },
    { src: 'admin.html', dests: ['admin.html', 'admin/index.html'] },
    { src: 'admin/login.html', dests: ['admin/login.html', 'admin/login/index.html'] },
    { src: 'dashboard.html', dests: ['dashboard.html', 'dashboard/index.html'] },
    { src: 'login.html', dests: ['login.html', 'login/index.html'] },
    { src: 'upload.html', dests: ['upload.html', 'upload/index.html'] },
    { src: '_not-found.html', dests: ['404.html'] },
  ];

  routeMappings.forEach(({ src, dests }) => {
    const fullSrc = path.join(appServerDir, src);
    if (fs.existsSync(fullSrc)) {
      dests.forEach(dest => {
        const fullDest = path.join(publicDir, dest);
        const destDir = path.dirname(fullDest);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(fullSrc, fullDest);
        console.log(`✓ Copied ${src} -> ${fullDest}`);
      });
    }
  });
}

// 3. Guarantee public/_next is NEVER created
if (fs.existsSync(publicNextDir)) {
  console.log('Cleaning up forbidden public/_next directory...');
  fs.rmSync(publicNextDir, { recursive: true, force: true });
}

// 4. Create Cloudflare Pages Advanced Mode _worker.js
const workerContent = `export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Direct asset match
    let res = await env.ASSETS.fetch(request);
    if (res.status !== 404) {
      return res;
    }

    // Try clean URLs / pathname.html
    if (!pathname.includes('.')) {
      const cleanUrl = new URL(request.url);
      cleanUrl.pathname = pathname.endsWith('/') ? \`\${pathname}index.html\` : \`\${pathname}.html\`;
      res = await env.ASSETS.fetch(new Request(cleanUrl, request));
      if (res.status !== 404) {
        return res;
      }

      // Try pathname/index.html
      const subUrl = new URL(request.url);
      subUrl.pathname = \`\${pathname.replace(/\\/$/, '')}/index.html\`;
      res = await env.ASSETS.fetch(new Request(subUrl, request));
      if (res.status !== 404) {
        return res;
      }
    }

    // Return 404.html fallback
    const notFoundUrl = new URL('/404.html', request.url);
    return env.ASSETS.fetch(new Request(notFoundUrl, request));
  }
};
`;

fs.writeFileSync(path.join(publicDir, '_worker.js'), workerContent);
console.log('✓ Created public/_worker.js for Cloudflare Pages edge routing.');

// 5. Also copy to .open-next/assets if requested
const openNextAssetsDir = path.join('.open-next', 'assets');
if (!fs.existsSync(openNextAssetsDir)) {
  fs.mkdirSync(openNextAssetsDir, { recursive: true });
}
copyRecursiveSync(publicDir, openNextAssetsDir);
console.log('✓ Synced all edge assets to .open-next/assets.');

console.log('--- CVtoWeb Build Pipeline Completed Successfully ---');

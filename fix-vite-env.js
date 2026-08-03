/**
 * fix-vite-env.js
 * Replaces all import.meta.env.VITE_API_URL usages in pages-old with
 * Next.js-compatible equivalents using process.env.NEXT_PUBLIC_API_URL
 */
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages-old');

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = walkDir(pagesDir);
let totalFixed = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Pattern 1: import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:XXXX'
  // → '' (empty string, since images are served from same origin /uploads/...)
  content = content.replace(
    /import\.meta\.env\.VITE_API_URL\?\.replace\(['"]\/api['"],\s*['"]['"]?\)\s*\|\|\s*['"]http:\/\/localhost:\d+['"]/g,
    "''"
  );

  // Pattern 2: import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:XXXX"
  content = content.replace(
    /import\.meta\.env\.VITE_API_URL\?\.replace\(["']\/api["'],\s*["']["']?\)\s*\|\|\s*["']http:\/\/localhost:\d+["']/g,
    "''"
  );

  // Pattern 3: import.meta.env.VITE_API_URL || 'http://localhost:XXXX/api'
  content = content.replace(
    /import\.meta\.env\.VITE_API_URL\s*\|\|\s*['"]http:\/\/localhost:\d+\/api['"]/g,
    "'/api'"
  );

  // Pattern 4: import.meta.env.VITE_API_URL || "http://localhost:XXXX/api"
  content = content.replace(
    /import\.meta\.env\.VITE_API_URL\s*\|\|\s*["']http:\/\/localhost:\d+\/api["']/g,
    "'/api'"
  );

  // Catch-all for any remaining import.meta.env.VITE_API_URL
  content = content.replace(/import\.meta\.env\.VITE_API_URL/g, "(process.env.NEXT_PUBLIC_API_URL || '/api')");

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('✅ Fixed:', path.relative(__dirname, file));
    totalFixed++;
  }
}

console.log(`\nDone. Fixed ${totalFixed} file(s).`);

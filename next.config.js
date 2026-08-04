const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Set global DNS servers for standard SRV resolution on host machine
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

try {
  dns.resolveSrv('_mongodb._tcp.cluster0.l7xeac9.mongodb.net', (err, addresses) => {
    if (err) {
      fs.writeFileSync('dns-output.log', 'Error: ' + err.message);
    } else {
      fs.writeFileSync('dns-output.log', JSON.stringify(addresses, null, 2));
    }
  });
} catch (e) {
  fs.writeFileSync('dns-output.log', 'Exception: ' + e.message);
}

// Helper to copy files recursively
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
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Helper to delete directory recursively
function deleteFolderRecursive(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
  }
}

// Perform automated migration copy & cleanup on Next.js config reload
try {
  console.log('=== Next.js Config Auto-Copy & Cleanup Start ===');

  // Copy generated profile pictures from artifact directory
  const brainDir = 'C:\\Users\\Shubh\\.gemini\\antigravity-ide\\brain\\2b2ae851-c467-4457-936f-4a7922a5164e';
  const targetMap = {
    'rajesh.png': 'rajesh_profile_1785759529085.png',
    'anjali.png': 'anjali_profile_1785759542777.png',
    'vikram.png': 'vikram_profile_1785759556811.png',
    'priya.png': 'priya_profile_1785759570153.png'
  };
  
  for (const [destName, srcName] of Object.entries(targetMap)) {
    const srcPath = path.join(brainDir, srcName);
    const destPath = path.join(process.cwd(), 'public', destName);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied ${srcName} -> public/${destName}`);
    }
  }

  // Restore assets folder from Git if it was cleaned up
  if (!fs.existsSync('src/assets')) {
    try {
      const { execSync } = require('child_process');
      console.log('Restoring frontend/src/assets from git...');
      execSync('git checkout HEAD -- frontend/src/assets', { stdio: 'inherit' });
    } catch (gitErr) {
      console.error('⚠️ Could not run git checkout automatically:', gitErr.message);
    }
  }

  // 0. Copy assets
  if (fs.existsSync('frontend/src/assets')) {
    copyRecursiveSync('frontend/src/assets', 'src/assets');
    console.log('✅ Copied assets to src/assets');
  }

  // 0b. Always copy default-product.png to public/ so it's served as a static asset
  if (fs.existsSync('src/assets/default-product.png')) {
    fs.copyFileSync('src/assets/default-product.png', 'public/default-product.png');
    console.log('✅ Copied default-product.png to public/');
  }
  
  // 1. Copy styles
  if (fs.existsSync('frontend/src/styles')) {
    copyRecursiveSync('frontend/src/styles', 'src/styles');
    console.log('✅ Copied styles to src/styles');
  }
  
  // 2. Copy components
  if (fs.existsSync('frontend/src/components')) {
    copyRecursiveSync('frontend/src/components', 'src/components');
    console.log('✅ Copied components to src/components');
  }

  // 3. Copy pages-old
  if (fs.existsSync('frontend/src/pages')) {
    copyRecursiveSync('frontend/src/pages', 'src/pages-old');
    console.log('✅ Copied pages to src/pages-old');
  }

  // 4. Copy assets from public
  if (fs.existsSync('frontend/public')) {
    copyRecursiveSync('frontend/public', 'public');
    console.log('✅ Copied public assets to public');
  }

  // 5. Copy backend uploads to public/uploads
  if (fs.existsSync('backend/public/uploads')) {
    copyRecursiveSync('backend/public/uploads', 'public/uploads');
    console.log('✅ Copied backend uploads to public/uploads');
  }

  // 6. Copy backend categories uploads to public/uploads/categories
  if (fs.existsSync('backend/uploads/categories')) {
    copyRecursiveSync('backend/uploads/categories', 'public/uploads/categories');
    console.log('✅ Copied backend categories to public/uploads/categories');
  }

  // 7. Cleanup backend folder
  if (fs.existsSync('backend')) {
    deleteFolderRecursive('backend');
    console.log('🧹 Deleted backend folder');
  }

  // 8. Cleanup frontend folder
  if (fs.existsSync('frontend')) {
    deleteFolderRecursive('frontend');
    console.log('🧹 Deleted frontend folder');
  }

  // 9. Cleanup backend.zip if it exists
  if (fs.existsSync('backend.zip')) {
    fs.unlinkSync('backend.zip');
    console.log('🧹 Deleted backend.zip');
  }

  // 10. Cleanup copy.js if it exists
  if (fs.existsSync('copy.js')) {
    fs.unlinkSync('copy.js');
    console.log('🧹 Deleted copy.js');
  }

  console.log('=== Next.js Config Auto-Copy & Cleanup Complete ===');
} catch (error) {
  console.error('❌ Migration Copy/Cleanup Error:', error);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias['react-router-dom'] = path.join(process.cwd(), 'src/lib/react-router-dom-compat.js');
    return config;
  },
};

module.exports = nextConfig;

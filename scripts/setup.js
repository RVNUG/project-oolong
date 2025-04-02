import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source and destination directories
const sourcePath = path.resolve(__dirname, '../../rvnugorg_rewrite2025');
const destPath = path.resolve(__dirname, '..');

// Ensure public/data directory exists
if (!fs.existsSync(path.join(destPath, 'public', 'data'))) {
  fs.mkdirSync(path.join(destPath, 'public', 'data'), { recursive: true });
}

// Ensure public/images directory exists
if (!fs.existsSync(path.join(destPath, 'public', 'images'))) {
  fs.mkdirSync(path.join(destPath, 'public', 'images'), { recursive: true });
}

// Copy data files
const sourceDataPath = path.join(sourcePath, 'src', 'data');
const destDataPath = path.join(destPath, 'public', 'data');

if (fs.existsSync(sourceDataPath)) {
  const dataFiles = fs.readdirSync(sourceDataPath);
  
  dataFiles.forEach(file => {
    if (file.endsWith('.json')) {
      const sourceFile = path.join(sourceDataPath, file);
      const destFile = path.join(destDataPath, file);
      
      fs.copyFileSync(sourceFile, destFile);
      console.log(`Copied ${sourceFile} to ${destFile}`);
    }
  });
} else {
  console.warn(`Source data directory ${sourceDataPath} does not exist.`);
}

// Copy image files
const sourceImagesPath = path.join(sourcePath, 'src', 'images');
const destImagesPath = path.join(destPath, 'public', 'images');

if (fs.existsSync(sourceImagesPath)) {
  copyDir(sourceImagesPath, destImagesPath);
} else {
  console.warn(`Source images directory ${sourceImagesPath} does not exist.`);
}

// Create a default favicon if doesn't exist
if (!fs.existsSync(path.join(destPath, 'public', 'favicon.ico'))) {
  // Copy favicon from source if it exists
  const sourceFavicon = path.join(sourcePath, 'src', 'images', 'favicon.ico');
  if (fs.existsSync(sourceFavicon)) {
    fs.copyFileSync(sourceFavicon, path.join(destPath, 'public', 'favicon.ico'));
    console.log('Copied favicon.ico');
  } else {
    console.warn('No favicon found. Using Vite default.');
  }
}

console.log('Setup complete!');

// Helper function to copy directory recursively
function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  // Copy each entry
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively copy directory
      copyDir(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${srcPath} to ${destPath}`);
    }
  }
} 
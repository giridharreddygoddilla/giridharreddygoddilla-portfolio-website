import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.join(rootDir, 'public', 'assets');
const sourcePortrait = path.join(assetsDir, 'portrait-full.png');

async function processImages() {
  if (!fs.existsSync(sourcePortrait)) {
    console.error(`Error: Source portrait not found at ${sourcePortrait}`);
    process.exit(1);
  }

  console.log('Generating optimized WebP responsive assets from portrait-full.png...');

  // 1. portrait-1100.webp
  await sharp(sourcePortrait)
    .resize({ width: 1100, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(path.join(assetsDir, 'portrait-1100.webp'));
  console.log('✓ Generated portrait-1100.webp');

  // 2. portrait-720.webp
  await sharp(sourcePortrait)
    .resize({ width: 720, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(path.join(assetsDir, 'portrait-720.webp'));
  console.log('✓ Generated portrait-720.webp');

  // 3. portrait-420.webp
  await sharp(sourcePortrait)
    .resize({ width: 420, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(path.join(assetsDir, 'portrait-420.webp'));
  console.log('✓ Generated portrait-420.webp');

  // 4. avatar-420.webp (square crop focused on face)
  await sharp(sourcePortrait)
    .resize(420, 420, { fit: 'cover', position: 'top' })
    .webp({ quality: 85 })
    .toFile(path.join(assetsDir, 'avatar-420.webp'));
  console.log('✓ Generated avatar-420.webp');

  console.log('All responsive assets generated successfully in public/assets!');
}

processImages().catch(err => {
  console.error('Failed to process images:', err);
  process.exit(1);
});

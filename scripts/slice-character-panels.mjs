import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'public', 'assets', 'character');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const compositePath = 'C:/Users/girid/.gemini/antigravity/brain/277e9373-8968-4193-bb36-0ee44d5c6b6b/.user_uploaded/media_1793406703998_e74eb8ca.jpg';
const realPhotoPath = 'C:/Users/girid/.gemini/antigravity/brain/277e9373-8968-4193-bb36-0ee44d5c6b6b/.user_uploaded/media_1793406876883_53208633.png';

const panels = [
  {
    name: 'hero-portrait',
    crop: { left: 0, top: 0, width: 327, height: 337 },
    desc: 'Signature Hero Portrait (warm atmospheric lighting, confident subtle smile)'
  },
  {
    name: 'developer-workspace',
    crop: { left: 332, top: 0, width: 350, height: 337 },
    desc: 'Developer Workspace (multi-monitor coding workstation, cool blue monitor glow)'
  },
  {
    name: 'walking-city',
    crop: { left: 688, top: 0, width: 336, height: 337 },
    desc: 'Cinematic Walking (full-body walking in modern architectural city, golden hour)'
  },
  {
    name: 'confident-arms-crossed',
    crop: { left: 0, top: 341, width: 327, height: 341 },
    desc: 'Confident Studio Portrait (arms crossed, warm golden rim light)'
  },
  {
    name: 'calm-city-smile',
    crop: { left: 332, top: 341, width: 350, height: 341 },
    desc: 'Approachable City Portrait (warm daylight, modern plaza, bright smile)'
  },
  {
    name: 'seated-executive',
    crop: { left: 688, top: 341, width: 336, height: 341 },
    desc: 'Seated Executive Portrait (thoughtful hand on chin, warm office lamp)'
  }
];

async function run() {
  console.log('Extracting and upscaling 6 character panels...');
  
  for (const p of panels) {
    const cropped = sharp(compositePath).extract(p.crop);
    
    // Upscale by 3x with lanczos3 and subtle sharpening for crisp 1080p+ presentation
    const targetWidth = Math.round(p.crop.width * 3.5);
    const targetHeight = Math.round(p.crop.height * 3.5);
    
    await cropped
      .resize(targetWidth, targetHeight, {
        kernel: sharp.kernel.lanczos3
      })
      .sharpen({ sigma: 1.0, m1: 1.2, m2: 0.5 })
      .webp({ quality: 92 })
      .toFile(path.join(outDir, `${p.name}.webp`));

    console.log(`✓ Processed ${p.name}.webp (${targetWidth}x${targetHeight}) — ${p.desc}`);
  }

  // Also process the real photo
  console.log('Processing real photo asset...');
  await sharp(realPhotoPath)
    .resize(800, 800, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.8 })
    .webp({ quality: 92 })
    .toFile(path.join(rootDir, 'public', 'assets', 'profile-real-clean.webp'));
  console.log('✓ Processed profile-real-clean.webp (800x800)');

  console.log('All character & profile assets created successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

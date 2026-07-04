import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = path.resolve('assets/images');
const outputDir = path.resolve('assets/images-optimized');
fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(imagesDir).filter((f) => /\.(webp|jpe?g|png)$/i.test(f));

const config = {
  hero: { maxWidth: 800, quality: 82 },
  portfolio: { maxWidth: 1200, quality: 78 },
  default: { maxWidth: 1200, quality: 80 },
};

function getProfile(name) {
  if (name === 'hero.webp') return config.hero;
  if (/^project-\d+\.webp$/i.test(name) || name === 'Panda.webp') return config.portfolio;
  return config.default;
}

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const inputPath = path.join(imagesDir, file);
  const before = fs.statSync(inputPath).size;
  totalBefore += before;

  const profile = getProfile(file);
  const ext = path.extname(file).toLowerCase();
  const baseName = path.basename(file, ext);
  const outputName = ext === '.jpeg' || ext === '.jpg' ? `${baseName}.webp` : file;
  const outputPath = path.join(outputDir, outputName);

  let pipeline = sharp(inputPath).rotate();
  const meta = await pipeline.metadata();

  if (meta.width && meta.width > profile.maxWidth) {
    pipeline = pipeline.resize({ width: profile.maxWidth, withoutEnlargement: true });
  }

  const buffer = await pipeline
    .webp({ quality: profile.quality, effort: 6, smartSubsample: true })
    .toBuffer();

  fs.writeFileSync(outputPath, buffer);
  totalAfter += buffer.length;

  console.log(
    outputName !== file
      ? `${file} -> ${outputName}: ${(before / 1024).toFixed(1)}KB -> ${(buffer.length / 1024).toFixed(1)}KB`
      : `${file}: ${(before / 1024).toFixed(1)}KB -> ${(buffer.length / 1024).toFixed(1)}KB`
  );
}

console.log(`\nTotal: ${(totalBefore / 1024).toFixed(1)}KB -> ${(totalAfter / 1024).toFixed(1)}KB (saved ${((totalBefore - totalAfter) / 1024).toFixed(1)}KB)`);
console.log(`Optimized files written to: ${outputDir}`);

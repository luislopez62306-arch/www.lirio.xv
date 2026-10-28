import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const heroImages = [
  { name: 'hero-1', url: 'https://i.ibb.co/pY5K2zL/IMG-3667.jpg' },
  { name: 'hero-2', url: 'https://i.ibb.co/rfLwL1dv/IMG-3665.jpg' },
  { name: 'hero-3', url: 'https://i.ibb.co/whdn3MYz/IMG-3671.jpg' },
  { name: 'hero-4', url: 'https://i.ibb.co/1Gz6kFWX/IMG-3664.jpg' }
];

const outDir = path.resolve('public/hero');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function processImages() {
  console.log("Starting image enhancement...");
  for (const item of heroImages) {
    try {
      console.log(`Downloading ${item.name} from ${item.url}...`);
      const res = await fetch(item.url);
      const arrayBuffer = await res.arrayBuffer();
      const inputBuffer = Buffer.from(arrayBuffer);

      // Metadata original
      const metadata = await sharp(inputBuffer).metadata();
      console.log(`Original ${item.name}: ${metadata.width}x${metadata.height}`);

      // Upscale 2.5x con Lanczos3 y unsharp mask
      const targetWidth = Math.round((metadata.width || 426) * 2.5);
      const targetHeight = Math.round((metadata.height || 640) * 2.5);

      const enhancedJpg = await sharp(inputBuffer)
        .resize({
          width: targetWidth,
          height: targetHeight,
          kernel: sharp.kernel.lanczos3,
          fit: 'fill'
        })
        .sharpen({
          sigma: 1.1,
          m1: 1.2,
          m2: 0.6,
          x1: 2,
          y2: 10,
          y3: 20
        })
        .jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
        .toBuffer();

      const outPathJpg = path.join(outDir, `${item.name}.jpg`);
      fs.writeFileSync(outPathJpg, enhancedJpg);
      console.log(`Saved ${outPathJpg} (${targetWidth}x${targetHeight}, ${enhancedJpg.length} bytes)`);

      // También versión WebP de ultra alta calidad
      const enhancedWebp = await sharp(inputBuffer)
        .resize({
          width: targetWidth,
          height: targetHeight,
          kernel: sharp.kernel.lanczos3,
          fit: 'fill'
        })
        .sharpen({
          sigma: 1.1,
          m1: 1.2,
          m2: 0.6
        })
        .webp({ quality: 95, effort: 6 })
        .toBuffer();

      const outPathWebp = path.join(outDir, `${item.name}.webp`);
      fs.writeFileSync(outPathWebp, enhancedWebp);
      console.log(`Saved ${outPathWebp} (${enhancedWebp.length} bytes)`);

    } catch (err) {
      console.error(`Error processing ${item.name}:`, err);
    }
  }
  console.log("Image enhancement complete!");
}

processImages();

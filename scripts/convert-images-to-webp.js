/**
 * Image Conversion Script
 * Converts PNG images to WebP format for optimization
 *
 * Usage:
 * 1. Install sharp: npm install --save-dev sharp
 * 2. Run: node scripts/convert-images-to-webp.js
 */

const fs = require('fs');
const path = require('path');

async function convertToWebP() {
  try {
    // Dynamic import for sharp (ES module)
    const sharp = (await import('sharp')).default;

    const publicDir = path.join(__dirname, '..', 'public');
    const images = [
      { input: 'cover.png', output: 'cover.webp', quality: 85 },
      { input: 'quran-logo-big.png', output: 'quran-logo-big.webp', quality: 90 },
      { input: 'quran-logo.png', output: 'quran-logo.webp', quality: 90 }
    ];

    console.log('Starting image conversion to WebP...\n');

    for (const img of images) {
      const inputPath = path.join(publicDir, img.input);
      const outputPath = path.join(publicDir, img.output);

      if (!fs.existsSync(inputPath)) {
        console.log(`⚠️  Skipping ${img.input} - file not found`);
        continue;
      }

      const inputStats = fs.statSync(inputPath);

      await sharp(inputPath)
        .webp({ quality: img.quality })
        .toFile(outputPath);

      const outputStats = fs.statSync(outputPath);
      const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

      console.log(`✅ ${img.input} → ${img.output}`);
      console.log(`   Size: ${(inputStats.size / 1024 / 1024).toFixed(2)} MB → ${(outputStats.size / 1024 / 1024).toFixed(2)} MB (${reduction}% reduction)\n`);
    }

    console.log('✅ All images converted successfully!');
    console.log('\nNext steps:');
    console.log('1. Update image references in your components to use .webp files');
    console.log('2. Optionally delete old .png files after verifying .webp works');
    console.log('3. Consider using next/image component for automatic optimization');

  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND' || error.message.includes('sharp')) {
      console.error('❌ Error: sharp is not installed.');
      console.error('Please run: npm install --save-dev sharp');
    } else {
      console.error('❌ Conversion error:', error.message);
    }
    process.exit(1);
  }
}

convertToWebP();

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const masterPath = './public/icons/geoprospect_final_master.png';

async function prepareAppIcons() {
  console.log('Preparing production icon assets from final master...');
  
  // 512x512 PNG
  await sharp(masterPath)
    .resize(512, 512)
    .png()
    .toFile('./public/icon-512.png');
  console.log('✓ public/icon-512.png ready');

  // 192x192 PNG
  await sharp(masterPath)
    .resize(192, 192)
    .png()
    .toFile('./public/icon-192.png');
  console.log('✓ public/icon-192.png ready');

  // Favicon PNG 64x64
  await sharp(masterPath)
    .resize(64, 64)
    .png()
    .toFile('./public/favicon.png');
  console.log('✓ public/favicon.png ready');

  console.log('All production icons pre-rendered!');
}

prepareAppIcons().catch(console.error);

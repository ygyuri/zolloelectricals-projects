/**
 * Upload Pexels images to Cloudinary and update src/data/projects.json with the resulting URLs.
 *
 * Prerequisites:
 * - Create .env in project root (copy .env.example) with:
 *   CLOUDINARY_CLOUD_NAME=your_cloud_name
 *   CLOUDINARY_API_KEY=your_api_key
 *   CLOUDINARY_API_SECRET=your_api_secret
 * - Run: npm run upload-images
 *
 * Do not commit .env or expose keys. Use this script only locally.
 */

const path = require('path');
const fs = require('fs');

// Load env from .env (gitignored)
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error(
    'Missing Cloudinary env. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env (see .env.example).'
  );
  process.exit(1);
}

// Premium-style Pexels photos (free to use): lighting, interiors, exteriors, schools, hotels, clubs
const PEXELS_IMAGE_URLS = [
  'https://images.pexels.com/photos/1187974/pexels-photo-1187974.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1438834/pexels-photo-1438834.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/256219/pexels-photo-256219.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1200',
];

async function main() {
  const { v2: cloudinary } = require('cloudinary');
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  const projectsPath = path.resolve(__dirname, '..', 'src', 'data', 'projects.json');
  const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

  if (projects.length !== PEXELS_IMAGE_URLS.length) {
    console.warn(
      `Projects count (${projects.length}) and Pexels URLs count (${PEXELS_IMAGE_URLS.length}) differ. Using min length.`
    );
  }

  const count = Math.min(projects.length, PEXELS_IMAGE_URLS.length);

  for (let i = 0; i < count; i++) {
    const pexelsUrl = PEXELS_IMAGE_URLS[i];
    try {
      const result = await cloudinary.uploader.upload(pexelsUrl, {
        folder: 'zollo-projects',
        resource_type: 'image',
      });
      projects[i].imageUrl = result.secure_url;
      console.log(`[${i + 1}/${count}] Uploaded: ${projects[i].title} -> ${result.secure_url}`);
    } catch (err) {
      console.error(`[${i + 1}/${count}] Failed for ${projects[i].title}:`, err.message);
    }
  }

  fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2), 'utf8');
  console.log('Updated src/data/projects.json with Cloudinary URLs.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

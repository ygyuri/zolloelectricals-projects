const CLOUD_NAME = 'duelwg6z9';

/**
 * Build a Cloudinary image URL with optional transformations.
 * Use for consistent sizing in the collage (e.g. crop, width).
 */
export function cloudinaryUrl(
  publicId: string,
  options?: { width?: number; height?: number; crop?: string }
): string {
  const base = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
  if (!options) return `${base}/${publicId}`;
  const { width, height, crop = 'fill' } = options;
  const parts = [crop];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  const trans = parts.join(',');
  return `${base}/${trans}/${publicId}`;
}

/**
 * Use a full Cloudinary URL as-is (e.g. from seed data after upload).
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com') && url.includes(CLOUD_NAME);
}

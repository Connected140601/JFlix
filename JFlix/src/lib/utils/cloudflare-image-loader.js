/**
 * Custom image loader for Cloudflare Pages compatibility
 * This allows Next.js images to work properly with Cloudflare's CDN
 */

export default function cloudflareImageLoader({ src, width, quality }) {
  // For TMDB images, use their API directly
  if (src.includes('image.tmdb.org')) {
    return src;
  }
  
  // For local images, use Cloudflare's image resizing if available
  const params = [`width=${width}`];
  
  if (quality) {
    params.push(`quality=${quality}`);
  }
  
  return `${src}?${params.join('&')}`;
}

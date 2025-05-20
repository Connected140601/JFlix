// next.config.cloudflare.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages specific settings
  images: {
    domains: ['image.tmdb.org'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/**',
      },
    ],
    // Cloudflare Pages requires unoptimized images for static exports
    unoptimized: true,
  },
  
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure images for Cloudflare Pages compatibility
  images: {
    domains: ['image.tmdb.org'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/**',
      },
    ],
    // Use Cloudflare's image optimization
    loader: 'custom',
    loaderFile: './src/lib/utils/cloudflare-image-loader.js',
  },
  
  // Add trailing slashes for better compatibility
  trailingSlash: true,
  
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Enable React strict mode for better performance
  reactStrictMode: true,
};

module.exports = nextConfig;

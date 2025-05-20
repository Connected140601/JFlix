#!/bin/bash

# Build script for Cloudflare Pages deployment

echo "🚀 Starting JFlix build process for Cloudflare Pages..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the Next.js application
echo "🏗️ Building Next.js application..."
npm run build

# Copy necessary files to the out directory
echo "📋 Copying configuration files..."
cp public/_headers out/
cp public/_redirects out/

echo "✅ Build completed successfully!"
echo "Your JFlix site is ready for Cloudflare Pages deployment."

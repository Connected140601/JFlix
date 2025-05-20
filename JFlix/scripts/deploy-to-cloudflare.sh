#!/bin/bash

# Deployment script for Cloudflare Pages

echo "🚀 Preparing JFlix for Cloudflare Pages deployment..."

# Copy the Cloudflare-specific Next.js config
echo "📋 Using Cloudflare-specific Next.js configuration..."
cp next.config.cloudflare.js next.config.js

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ "$1" == "--force-install" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Build the Next.js application
echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Build completed!"
echo "Your JFlix site is ready for Cloudflare Pages deployment."
echo ""
echo "To deploy to Cloudflare Pages:"
echo "1. Go to https://pages.cloudflare.com"
echo "2. Connect your GitHub repository"
echo "3. Configure with these settings:"
echo "   - Framework preset: Next.js"
echo "   - Build command: npm run build"
echo "   - Build output directory: .next"
echo ""
echo "For custom domain setup:"
echo "1. In your Cloudflare Pages dashboard → Custom Domains"
echo "2. Add your domain (e.g., www.jflix.com)"
echo "3. Update DNS records as instructed"
echo ""

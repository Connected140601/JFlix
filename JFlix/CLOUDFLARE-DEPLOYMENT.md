# JFlix Cloudflare Pages Deployment Guide

This guide provides step-by-step instructions for deploying your JFlix streaming website to Cloudflare Pages.

## Prerequisites

- A GitHub account
- A Cloudflare account
- Your JFlix repository pushed to GitHub

## Deployment Options

### Option 1: Deploy as a Next.js Application (Recommended)

Cloudflare Pages has excellent support for Next.js applications, which allows you to deploy JFlix with all its dynamic features intact.

### Option 2: Deploy as a Static Site

If you prefer a pure HTML/CSS/JavaScript approach, you can use the static export option, but some features may require client-side implementation.

## Deployment Steps

### 1. Prepare Your Repository

Make sure your GitHub repository includes:
- All the JFlix source code
- The `.gitignore` file (excluding node_modules, .next, etc.)
- The updated `next.config.js` file
- The `public/_routes.json` file

### 2. Connect to Cloudflare Pages

1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Sign in to your Cloudflare account
3. Click "Create a project"
4. Connect your GitHub account and select your JFlix repository
5. Click "Begin setup"

### 3. Configure Build Settings

Configure your project with these settings:

- **Project name**: jflix (or your preferred name)
- **Production branch**: main
- **Framework preset**: Next.js
- **Build command**: npm run build
- **Build output directory**: .next (for Next.js deployment) or out (for static export)
- **Environment variables** (optional): Add any API keys if needed

### 4. Deploy Your Site

1. Click "Save and Deploy"
2. Cloudflare will:
   - Clone your GitHub repo
   - Install dependencies
   - Build your Next.js application
   - Deploy it to their global network

### 5. Add a Custom Domain (Optional)

1. In your Cloudflare Pages dashboard → Project → Custom Domains
2. Add your domain (e.g., www.jflix.com)
3. Update DNS records as instructed
4. HTTPS will be automatically applied

## Troubleshooting

### Dynamic Routes Not Working

If you're using the static export option and dynamic routes aren't working:

1. Make sure your `public/_redirects` file is properly configured
2. Consider implementing client-side routing for dynamic content

### API Routes Not Working

If you're using API routes and they're not working with static export:

1. Consider using the Next.js deployment option instead
2. Alternatively, implement these features using Cloudflare Workers

## Maintenance

After deployment, any changes pushed to your GitHub repository will automatically trigger a new build and deployment on Cloudflare Pages.

## Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site)

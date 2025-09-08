# Deployment Guide

## Overview

This guide covers deploying the Flash Loan Arbitrage Bot Simulator to various environments, from local development to production hosting. The application is built as a static React application that can be deployed to multiple platforms.

## Prerequisites

Before deploying, ensure you have:

- Node.js 16+ installed
- npm or yarn package manager
- Environment variables configured
- Build artifacts generated
- Target deployment platform account

## Build Process

### Production Build

Generate optimized production files:

```bash
# Install dependencies
npm install

# Create production build
npm run build

# Verify build output
ls -la dist/
```

The build process creates:
- `dist/index.html` - Main HTML file
- `dist/assets/` - Optimized JS, CSS, and assets
- Source maps for debugging (optional)

### Build Optimization

The Vite build process automatically includes:

```typescript
// vite.config.ts optimizations
export default defineConfig({
  build: {
    // Code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ai: ['@google/genai']
        }
      }
    },
    
    // Minification and optimization
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console.log in production
        drop_debugger: true
      }
    },
    
    // Asset optimization
    assetsInlineLimit: 4096,  // Inline small assets
    cssCodeSplit: true,       // Split CSS files
    sourcemap: false          // Disable sourcemaps for production
  }
});
```

## Deployment Platforms

### 1. Vercel (Recommended)

#### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dmoore628/Flash-Loan-Arbitrage-Bot-)

#### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow prompts to configure deployment
```

#### Vercel Configuration

Create `vercel.json` in project root:

```json
{
  "version": 2,
  "name": "flash-loan-arbitrage-bot",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "GEMINI_API_KEY": "@gemini-api-key"
  }
}
```

Set environment variables in Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add `GEMINI_API_KEY` with your API key
3. Redeploy the application

### 2. Netlify

#### Netlify CLI Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  GEMINI_API_KEY = "your_api_key_here"
```

### 3. GitHub Pages

#### Deploy via GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
          
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Set `GEMINI_API_KEY` in repository secrets:
1. Go to Settings → Secrets and Variables → Actions
2. Add `GEMINI_API_KEY` with your API key

### 4. AWS S3 + CloudFront

#### S3 Static Website Hosting

```bash
# Install AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://your-arbitrage-bot-bucket

# Enable static website hosting
aws s3 website s3://your-arbitrage-bot-bucket --index-document index.html

# Upload build files
aws s3 sync dist/ s3://your-arbitrage-bot-bucket --delete

# Set bucket policy for public access
aws s3api put-bucket-policy --bucket your-arbitrage-bot-bucket --policy file://bucket-policy.json
```

Bucket policy (`bucket-policy.json`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-arbitrage-bot-bucket/*"
    }
  ]
}
```

#### CloudFront Distribution

```bash
# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

CloudFront configuration (`cloudfront-config.json`):

```json
{
  "CallerReference": "arbitrage-bot-2024",
  "Comment": "Flash Loan Arbitrage Bot CDN",
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-arbitrage-bot",
    "ViewerProtocolPolicy": "redirect-to-https",
    "MinTTL": 0,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    }
  },
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-arbitrage-bot",
        "DomainName": "your-arbitrage-bot-bucket.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
```

### 5. Docker Deployment

#### Dockerfile

```dockerfile
# Multi-stage build for optimization
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production image with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration

Create `nginx.conf`:

```nginx
events {
  worker_connections 1024;
}

http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;
  
  server {
    listen       80;
    server_name  localhost;
    root         /usr/share/nginx/html;
    index        index.html;
    
    # Handle client-side routing
    location / {
      try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
  }
}
```

#### Build and Run

```bash
# Build Docker image
docker build -t flash-loan-arbitrage-bot .

# Run container
docker run -p 8080:80 flash-loan-arbitrage-bot

# Or use docker-compose
docker-compose up -d
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    
  # Optional: Add monitoring
  nginx-exporter:
    image: nginx/nginx-prometheus-exporter
    ports:
      - "9113:9113"
    command:
      - '-nginx.scrape-uri=http://web:80/nginx_status'
    depends_on:
      - web
```

## Environment Variables Management

### Production Environment Variables

Never commit sensitive environment variables to version control. Use platform-specific methods:

#### Vercel
```bash
vercel env add GEMINI_API_KEY production
```

#### Netlify
```bash
netlify env:set GEMINI_API_KEY your_api_key_here
```

#### GitHub Actions
Set in repository secrets under Settings → Secrets and Variables → Actions

#### Docker
```bash
# Via environment file
docker run --env-file .env.production flash-loan-arbitrage-bot

# Or via command line
docker run -e GEMINI_API_KEY=your_key flash-loan-arbitrage-bot
```

### Environment Variable Validation

Add validation to ensure required variables are set:

```typescript
// Add to vite.config.ts
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  // Validate required environment variables
  const required = ['GEMINI_API_KEY'];
  const missing = required.filter(key => !env[key]);
  
  if (missing.length > 0 && mode === 'production') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return {
    // ... rest of config
  };
});
```

## Performance Optimization

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react';
            if (id.includes('recharts')) return 'charts';
            return 'vendor';
          }
        }
      }
    },
    
    // Asset optimization
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    
    // Compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    }
  },
  
  // Development optimizations
  server: {
    hmr: {
      overlay: false  // Disable error overlay in production
    }
  }
});
```

### CDN Configuration

For better global performance, configure CDN settings:

```javascript
// CloudFront cache behaviors
{
  "PathPattern": "/assets/*",
  "TargetOriginId": "S3-origin",
  "ViewerProtocolPolicy": "https-only",
  "CachePolicyId": "cache-policy-id",
  "TTL": {
    "DefaultTTL": 86400,    // 1 day
    "MaxTTL": 31536000      // 1 year
  }
}
```

## Monitoring and Analytics

### Error Tracking

Add error tracking to production builds:

```typescript
// Add to main application
if (process.env.NODE_ENV === 'production') {
  // Example with Sentry
  import * as Sentry from '@sentry/react';
  
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: 'production'
  });
}
```

### Performance Monitoring

```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Health Checks

Add health check endpoints for monitoring:

```typescript
// Add to nginx config or serverless function
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});
```

## Security Considerations

### Content Security Policy

Add CSP headers for security:

```html
<!-- In index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               connect-src 'self' https://generativelanguage.googleapis.com;">
```

### HTTPS Configuration

Ensure HTTPS is enforced:

```nginx
# Nginx redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:...;
}
```

## Deployment Checklist

### Pre-deployment

- [ ] Environment variables configured
- [ ] Build process tested locally
- [ ] All tests passing
- [ ] Performance optimizations applied
- [ ] Security headers configured
- [ ] Error tracking set up
- [ ] Monitoring configured

### Post-deployment

- [ ] Application loads correctly
- [ ] All features functional
- [ ] API integrations working
- [ ] Performance metrics acceptable
- [ ] Error rates within normal range
- [ ] SSL certificate valid
- [ ] Monitoring alerts configured

## Rollback Strategy

### Quick Rollback

Prepare rollback strategies for each platform:

#### Vercel
```bash
# Rollback to previous deployment
vercel --prod --rollback
```

#### Netlify
```bash
# Rollback via CLI
netlify api rollbackSiteDeploy --data '{"deploy_id": "previous_deploy_id"}'
```

#### AWS S3
```bash
# Backup current deployment before updating
aws s3 sync s3://your-bucket s3://your-backup-bucket

# Restore from backup if needed
aws s3 sync s3://your-backup-bucket s3://your-bucket --delete
```

### Automated Rollback

Set up automated rollback triggers:

```yaml
# GitHub Actions example
- name: Health Check
  run: |
    curl -f ${{ steps.deploy.outputs.url }}/health || exit 1
    
- name: Rollback on Failure
  if: failure()
  run: |
    # Trigger rollback
    vercel --prod --rollback
```

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Ensure environment variables are set

2. **Runtime Errors**
   - Check browser console for errors
   - Verify API keys are correctly configured
   - Check network connectivity to external APIs

3. **Performance Issues**
   - Analyze bundle size with `npm run build --analyze`
   - Check CDN configuration
   - Monitor Core Web Vitals

### Debugging Production Issues

```typescript
// Add production debugging
if (process.env.NODE_ENV === 'production') {
  window.addEventListener('error', (event) => {
    // Log errors to external service
    console.error('Production Error:', event.error);
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    // Log unhandled promise rejections
    console.error('Unhandled Promise Rejection:', event.reason);
  });
}
```

---

This deployment guide provides comprehensive coverage for hosting the Flash Loan Arbitrage Bot Simulator on various platforms. Choose the deployment method that best fits your needs and infrastructure requirements.
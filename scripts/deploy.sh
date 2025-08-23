#!/bin/bash

# Production deployment script
set -e

echo "🚀 Starting deployment..."

# Check if required environment variables are set
if [ -z "$NEXT_PUBLIC_API_BASE_URL" ]; then
    echo "❌ NEXT_PUBLIC_API_BASE_URL environment variable is required"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Type check
echo "🔍 Running type check..."
npm run type-check

# Lint
echo "🧹 Running linter..."
npm run lint

# Build application
echo "🏗️ Building application..."
npm run build

# Run security audit
echo "🔒 Running security audit..."
npm audit --audit-level moderate

echo "✅ Deployment completed successfully!"
echo "🌐 Application is ready to serve on port 3000"
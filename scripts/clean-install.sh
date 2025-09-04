#!/bin/bash
echo "🧹 Cleaning up..."
rm -rf node_modules
rm -rf .next
rm -f package-lock.json
rm -f yarn.lock

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building project..."
npm run build

echo "✅ Done!"
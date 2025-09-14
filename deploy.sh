#!/bin/bash

# AyurDiscovery AI Deployment Script
set -e

echo "🚀 Starting AyurDiscovery AI Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Set default MongoDB password if not provided
if [ -z "$MONGO_PASSWORD" ]; then
    export MONGO_PASSWORD="ayurdiscovery-secure-password-2025"
    echo "⚠️  Using default MongoDB password. Set MONGO_PASSWORD environment variable for production."
fi

echo "📦 Building application..."
npm run build

echo "🐳 Building Docker containers..."
npm run build:docker

echo "🌐 Starting services..."
npm run docker:up

echo "⏳ Waiting for services to start..."
sleep 30

echo "🔍 Checking service health..."

# Check backend health
if curl -f http://localhost:3002/api/v1/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    npm run docker:logs
    exit 1
fi

# Check frontend
if curl -f http://localhost > /dev/null 2>&1; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not accessible"
    npm run docker:logs
    exit 1
fi

echo ""
echo "🎉 Deployment successful!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:3002"
echo "   API Docs: http://localhost:3002/api/v1/docs"
echo "   Health Check: http://localhost:3002/api/v1/health"
echo ""
echo "📋 Management commands:"
echo "   View logs: npm run docker:logs"
echo "   Stop services: npm run docker:down"
echo "   Restart: npm run docker:down && npm run docker:up"
echo ""
echo "🔧 For cloud deployment, see DEPLOYMENT.md"
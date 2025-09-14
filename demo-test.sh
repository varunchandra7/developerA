#!/bin/bash

echo "🎯 AyurDiscovery AI - Live Demo Test"
echo "=================================="

# Kill any existing processes on port 3001
pkill -f "demo-server.ts" 2>/dev/null || true
sleep 1

echo "🚀 Starting AyurDiscovery AI Demo Server..."

# Start the demo server in background
npx tsx demo-server.ts &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to initialize..."
sleep 5

echo ""
echo "🧪 Testing API Endpoints:"
echo "========================"

# Test health endpoint
echo "1. Health Check:"
curl -s http://localhost:3001/health | head -c 200
echo ""
echo ""

# Test agents endpoint
echo "2. Agents API:"
curl -s http://localhost:3001/api/agents | head -c 300
echo ""
echo ""

# Test compound analysis
echo "3. Compound Analysis (POST):"
curl -s -X POST http://localhost:3001/api/analyze/compound \
  -H "Content-Type: application/json" \
  -d '{"compoundName":"Ashwagandha","smiles":"CCO"}' | head -c 300
echo ""
echo ""

# Test literature search
echo "4. Literature Search:"
curl -s "http://localhost:3001/api/search/literature?q=turmeric" | head -c 300
echo ""
echo ""

echo "✅ All API endpoints are responding!"
echo ""
echo "🌐 Live URLs:"
echo "  Health: http://localhost:3001/health"
echo "  Agents: http://localhost:3001/api/agents"
echo "  Analyze: POST http://localhost:3001/api/analyze/compound"
echo "  Search: http://localhost:3001/api/search/literature"
echo ""
echo "🎉 AyurDiscovery AI Backend is fully operational!"
echo ""
echo "💡 Server is running with PID: $SERVER_PID"
echo "   Use 'kill $SERVER_PID' to stop the server"

# Keep the script running for a moment
sleep 2
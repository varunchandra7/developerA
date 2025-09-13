#!/bin/bash

# AyurDiscovery AI - Complete System Test Script

echo "🧪 Starting AyurDiscovery AI System Test..."
echo "=============================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if Node.js is available
node --version > /dev/null 2>&1
print_status $? "Node.js is available"

# Check if npm dependencies are installed
if [ -d "node_modules" ]; then
    print_status 0 "Dependencies are installed"
else
    print_info "Installing dependencies..."
    npm install
    print_status $? "Dependencies installed"
fi

# Test TypeScript compilation
print_info "Testing TypeScript compilation..."
npm run type-check > /dev/null 2>&1
print_status $? "TypeScript compilation successful"

# Test backend build
print_info "Testing backend compilation..."
npm run build:backend > /dev/null 2>&1
print_status $? "Backend build successful"

# Test frontend build
print_info "Testing frontend build..."
npm run build:frontend > /dev/null 2>&1
print_status $? "Frontend build successful"

# Test backend server (quick test)
print_info "Testing backend server startup..."
timeout 5 npx tsx test-backend.ts > /dev/null 2>&1
print_status $? "Backend server test completed"

echo ""
echo "🎉 All tests passed! AyurDiscovery AI is ready for development."
echo ""
echo "📚 Available commands:"
echo "  npm run dev              - Start both backend and frontend in development mode"
echo "  npm run dev:backend      - Start only backend development server"
echo "  npm run dev:frontend     - Start only frontend development server"
echo "  npm run build            - Build both backend and frontend for production"
echo "  npm run test             - Run test suite"
echo "  npm run lint             - Check code quality"
echo ""
echo "🌐 Development URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo "  Health:   http://localhost:3001/health"
echo "  API:      http://localhost:3001/api"
echo ""
echo "📁 Project Structure:"
echo "  ├── backend/          - Node.js/Express API server"
echo "  │   ├── agents/       - Multi-agent AI system"
echo "  │   ├── middleware/   - Express middleware"
echo "  │   └── utils/        - Utility functions"
echo "  ├── frontend/         - React TypeScript application"
echo "  │   ├── src/          - Source code"
echo "  │   └── dist/         - Built files"
echo "  └── shared/           - Shared types and utilities"
echo ""
print_status 0 "AyurDiscovery AI platform is fully operational!"
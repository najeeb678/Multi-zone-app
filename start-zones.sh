#!/bin/bash

# Multi-Zone Next.js Startup Script
echo "🚀 Starting Multi-Zone Next.js Application..."

# Function to kill background processes on script exit
cleanup() {
    echo "🛑 Stopping all zones..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap script exit to cleanup background processes
trap cleanup EXIT INT TERM

# Start each zone in background
echo "📦 Starting Fulfillment App (Zone v3) on port 3001..."
cd /home/tp/Desktop/multiZone-app/fulfillment-app && npm run dev -- -p 3001 &

echo "🚛 Starting Lastmile App (Zone v2) on port 3002..."
cd /home/tp/Desktop/multiZone-app/lastmile-app && npm run dev -- -p 3002 &

echo "🏠 Starting Host App (Main Zone) on port 3000..."
cd /home/tp/Desktop/multiZone-app/host-app && npm run dev -- -p 3000 &

echo ""
echo "✅ All zones are starting up..."
echo ""
echo "🌐 Access your multi-zone application at:"
echo "   - Main Zone (Host):        http://localhost:3000"
echo "   - Lastmile Zone (v2):      http://localhost:3000/v2"
echo "   - Fulfillment Zone (v3):   http://localhost:3000/v3"
echo ""
echo "💡 Direct zone access (for development):"
echo "   - Host App:                http://localhost:3000"
echo "   - Fulfillment App:         http://localhost:3001"
echo "   - Lastmile App:            http://localhost:3002"
echo ""
echo "Press Ctrl+C to stop all zones"

# Wait for all background processes
wait
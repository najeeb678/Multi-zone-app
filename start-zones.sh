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
echo "📦 Starting Fulfillment App (Zone v3) on port 5803..."
cd /home/tp/Desktop/multiZone-app/fulfillment-app && npm run dev -- -p 5803 &

echo "🚛 Starting Lastmile App (Zone v2) on port 5802..."
cd /home/tp/Desktop/multiZone-app/lastmile-app && npm run dev -- -p 5802 &

echo "🏠 Starting Host App (Main Zone) on port 5801..."
cd /home/tp/Desktop/multiZone-app/host-app && npm run dev -- -p 5801 &

echo ""
echo "✅ All zones are starting up..."
echo ""
echo "🌐 Access your multi-zone application at:"
echo "   - Main Zone (Host):        http://localhost:5801"
echo "   - Lastmile Zone (v2):      http://localhost:5802/v2"
echo "   - Fulfillment Zone (v3):   http://localhost:5803/v3"
echo ""
echo "💡 Direct zone access (for development):"
echo "   - Host App:                http://localhost:5801"
echo "   - Fulfillment App:         http://localhost:5803"
echo "   - Lastmile App:            http://localhost:5802"
echo ""
echo "Press Ctrl+C to stop all zones"

# Wait for all background processes
wait
#!/bin/bash
# Stop script for BlockRights - Digital Copyright Verifier
# This script kills all processes using ports 3000 and 5000

echo "🛑 Stopping BlockRights servers..."

# Function to kill process by port
kill_by_port() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ -n "$pids" ]; then
        echo "🔪 Killing processes on port $port: $pids"
        echo $pids | xargs kill -9 2>/dev/null
        echo "✅ Killed processes on port $port"
    else
        echo "✅ No processes found on port $port"
    fi
}

# Kill processes on port 3000 (Frontend)
echo "🎯 Checking port 3000 (Frontend)..."
kill_by_port 3000

# Kill processes on port 5000 (Backend)
echo "🎯 Checking port 5000 (Backend)..."
kill_by_port 5000

# Additional cleanup - kill any node processes that might be hanging
echo "🧹 Cleaning up any hanging Node.js processes..."
pkill -f "node.*dev" 2>/dev/null || true
pkill -f "next.*dev" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true

echo "✅ All servers stopped successfully!"
echo "🚀 You can now run 'npm run dev' to start the servers again"

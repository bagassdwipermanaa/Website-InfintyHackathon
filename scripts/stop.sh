#!/bin/bash

# Stop script for BlockRights application (Unix/Linux/macOS)
echo "Stopping BlockRights services..."

# Stop any running Node.js processes related to the project
pkill -f "node.*blockrights" 2>/dev/null || true

# Stop processes on ports 3000 and 5000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5000 | xargs kill -9 2>/dev/null || true

echo "BlockRights services stopped successfully!"

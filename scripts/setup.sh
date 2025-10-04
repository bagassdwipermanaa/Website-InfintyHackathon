#!/bin/bash

# Setup script for BlockRights application (Unix/Linux/macOS)
echo "Setting up BlockRights application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm first."
    exit 1
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Install dependencies
echo "Installing root dependencies..."
npm install

echo "Installing frontend dependencies..."
cd frontend
npm install

echo "Installing backend dependencies..."
cd ../backend
npm install

echo "Setup completed successfully!"
echo "You can now run 'npm run bagas' to start the development servers."

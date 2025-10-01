#!/bin/bash

# BlockRights Docker Development Script for Unix/Linux/macOS
# This script starts both frontend and backend using Docker

echo "🐳 Starting BlockRights with Docker"
echo "====================================="

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

echo "✅ Docker detected"
echo "✅ Docker Compose detected"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️ .env file not found. Creating from template..."
    cp env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
fi

echo ""
echo "🎉 Starting development environment with Docker..."
echo ""
echo "Frontend will be available at: http://localhost:3000"
echo "Backend API will be available at: http://localhost:5000"
echo "MySQL will be available at: localhost:3306"
echo "Redis will be available at: localhost:6379"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start all services with Docker Compose
docker-compose -f docker-compose.dev.yml up --build

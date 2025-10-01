#!/bin/bash

# BlockRights Setup Script
# This script sets up the development environment

set -e

echo "🚀 Setting up BlockRights - Digital Copyright Verifier"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL 8.0+ first."
    exit 1
fi

echo "✅ MySQL detected"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
else
    echo "✅ .env file already exists"
fi

# Install all dependencies
echo "📦 Installing all dependencies..."
npm run install:all

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads/artworks uploads/avatars uploads/certificates

# Setup database
echo "🗄️ Setting up database..."
read -p "Enter MySQL root password: " -s MYSQL_PASSWORD
echo ""

# Create database
mysql -u root -p$MYSQL_PASSWORD -e "CREATE DATABASE IF NOT EXISTS blockrights_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run database initialization
mysql -u root -p$MYSQL_PASSWORD blockrights_db < backend/server/sql/init.sql

echo "✅ Database setup completed"

# Create SSL certificates for development
echo "🔐 Creating SSL certificates for development..."
mkdir -p ssl
if [ ! -f ssl/cert.pem ]; then
    openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes -subj "/C=ID/ST=Jakarta/L=Jakarta/O=BlockRights/OU=Development/CN=localhost"
    echo "✅ SSL certificates created"
else
    echo "✅ SSL certificates already exist"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Default admin credentials:"
echo "Email: admin@blockrights.com"
echo "Password: admin123"
echo ""
echo "Happy coding! 🚀"

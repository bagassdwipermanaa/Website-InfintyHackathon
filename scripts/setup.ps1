# BlockRights Setup Script for Windows
# This script sets up the development environment

Write-Host "🚀 Setting up BlockRights - Digital Copyright Verifier" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check Node.js version
$nodeMajorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($nodeMajorVersion -lt 18) {
    Write-Host "❌ Node.js version 18+ is required. Current version: $nodeVersion" -ForegroundColor Red
    exit 1
}

# Check if MySQL is installed
try {
    mysql --version | Out-Null
    Write-Host "✅ MySQL detected" -ForegroundColor Green
} catch {
    Write-Host "❌ MySQL is not installed. Please install MySQL 8.0+ first." -ForegroundColor Red
    Write-Host "You can install MySQL from: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Yellow
    exit 1
}

# Create .env file if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host "✅ .env file created. Please edit it with your configuration." -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Install all dependencies
Write-Host "📦 Installing all dependencies..." -ForegroundColor Yellow
npm run install:all

# Create uploads directory
Write-Host "📁 Creating uploads directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "uploads\artworks" | Out-Null
New-Item -ItemType Directory -Force -Path "uploads\avatars" | Out-Null
New-Item -ItemType Directory -Force -Path "uploads\certificates" | Out-Null

# Setup database
Write-Host "🗄️ Setting up database..." -ForegroundColor Yellow
$mysqlPassword = Read-Host "Enter MySQL root password" -AsSecureString
$mysqlPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($mysqlPassword))

# Create database
try {
    mysql -u root -p$mysqlPasswordPlain -e "CREATE DATABASE IF NOT EXISTS blockrights_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    Write-Host "✅ Database created" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create database. Please check your MySQL credentials." -ForegroundColor Red
    exit 1
}

# Run database initialization
try {
    mysql -u root -p$mysqlPasswordPlain blockrights_db -e "source backend/server/sql/init.sql"
    Write-Host "✅ Database initialization completed" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to initialize database." -ForegroundColor Red
    exit 1
}

# Create SSL certificates for development
Write-Host "🔐 Creating SSL certificates for development..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "ssl" | Out-Null

if (!(Test-Path "ssl\cert.pem")) {
    # Check if OpenSSL is available
    try {
        openssl version | Out-Null
        openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes -subj "/C=ID/ST=Jakarta/L=Jakarta/O=BlockRights/OU=Development/CN=localhost"
        Write-Host "✅ SSL certificates created" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ OpenSSL not found. SSL certificates not created." -ForegroundColor Yellow
        Write-Host "You can create them manually or install OpenSSL." -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ SSL certificates already exist" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file with your configuration" -ForegroundColor White
Write-Host "2. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host "3. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "Default admin credentials:" -ForegroundColor Cyan
Write-Host "Email: admin@blockrights.com" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green

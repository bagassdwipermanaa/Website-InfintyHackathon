# BlockRights Development Script for Windows
# This script starts both frontend and backend in development mode

Write-Host "🚀 Starting BlockRights Development Environment" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (!(Test-Path ".env")) {
    Write-Host "⚠️ .env file not found. Creating from template..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host "✅ .env file created. Please edit it with your configuration." -ForegroundColor Green
}

# Check if frontend dependencies are installed
if (!(Test-Path "frontend/node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
}

# Check if backend dependencies are installed
if (!(Test-Path "backend/node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
}

# Create uploads directory
Write-Host "📁 Creating uploads directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "uploads\artworks" | Out-Null
New-Item -ItemType Directory -Force -Path "uploads\avatars" | Out-Null
New-Item -ItemType Directory -Force -Path "uploads\certificates" | Out-Null

Write-Host ""
Write-Host "🎉 Starting development servers..." -ForegroundColor Green
Write-Host ""
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start both servers concurrently
npm run dev

# Setup script for BlockRights application
Write-Host "Setting up BlockRights application..." -ForegroundColor Yellow

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "Installing root dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
cd frontend
npm install

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
cd ../backend
npm install

Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host "You can now run 'npm run bagas' to start the development servers." -ForegroundColor Cyan

# Setup Git dan Push ke GitHub
Write-Host "Setting up Git repository..." -ForegroundColor Green

# Initialize git repository
git init

# Add all files
git add .

# Check status
Write-Host "Git status:" -ForegroundColor Yellow
git status

# Commit initial files
git commit -m "Initial commit: BlockRights NFT Artwork Verification Platform"

Write-Host "Git setup completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Add remote repository: git remote add origin <your-github-repo-url>" -ForegroundColor White
Write-Host "2. Push to GitHub: git push -u origin main" -ForegroundColor White

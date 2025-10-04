# Stop script for BlockRights application
Write-Host "Stopping BlockRights services..." -ForegroundColor Yellow

# Stop any running Node.js processes related to the project
$processes = Get-Process | Where-Object { $_.ProcessName -eq "node" -and $_.CommandLine -like "*blockrights*" }
if ($processes) {
    Write-Host "Stopping Node.js processes..." -ForegroundColor Red
    $processes | Stop-Process -Force
    Write-Host "Node.js processes stopped." -ForegroundColor Green
} else {
    Write-Host "No running Node.js processes found." -ForegroundColor Green
}

# Stop any processes running on ports 3000 and 5000
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue

if ($port3000) {
    Write-Host "Stopping process on port 3000..." -ForegroundColor Red
    $process = Get-Process -Id $port3000.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        $process | Stop-Process -Force
        Write-Host "Process on port 3000 stopped." -ForegroundColor Green
    }
}

if ($port5000) {
    Write-Host "Stopping process on port 5000..." -ForegroundColor Red
    $process = Get-Process -Id $port5000.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        $process | Stop-Process -Force
        Write-Host "Process on port 5000 stopped." -ForegroundColor Green
    }
}

Write-Host "BlockRights services stopped successfully!" -ForegroundColor Green

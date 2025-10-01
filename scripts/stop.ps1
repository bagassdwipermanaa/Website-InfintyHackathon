# Stop script for BlockRights - Digital Copyright Verifier
# This script kills all processes using ports 3000 and 5000

Write-Host "Stopping BlockRights servers..." -ForegroundColor Red

# Function to kill process by port
function Stop-ProcessByPort {
    param([int]$Port)
    
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
        
        if ($processes) {
            foreach ($pid in $processes) {
                try {
                    $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                    if ($process) {
                        Write-Host "Killing process $pid ($($process.ProcessName)) on port $Port" -ForegroundColor Yellow
                        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                    }
                }
                catch {
                    Write-Host "Could not kill process $pid" -ForegroundColor Yellow
                }
            }
        } else {
            Write-Host "No processes found on port $Port" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "Error checking port $Port" -ForegroundColor Red
    }
}

# Kill processes on port 3000 (Frontend)
Write-Host "Checking port 3000 (Frontend)..." -ForegroundColor Cyan
Stop-ProcessByPort -Port 3000

# Kill processes on port 5000 (Backend)
Write-Host "Checking port 5000 (Backend)..." -ForegroundColor Cyan
Stop-ProcessByPort -Port 5000

# Additional cleanup - kill any node processes that might be hanging
Write-Host "Cleaning up any hanging Node.js processes..." -ForegroundColor Cyan
try {
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        foreach ($process in $nodeProcesses) {
            try {
                Write-Host "Killing Node.js process $($process.Id)" -ForegroundColor Yellow
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
            }
            catch {
                Write-Host "Could not kill Node.js process $($process.Id)" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "No hanging Node.js processes found" -ForegroundColor Green
    }
}
catch {
    Write-Host "Error cleaning up Node.js processes" -ForegroundColor Red
}

Write-Host "All servers stopped successfully!" -ForegroundColor Green
Write-Host "You can now run 'npm run dev' to start the servers again" -ForegroundColor Cyan

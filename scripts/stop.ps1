# Stop script for BlockRights application
Write-Host "Stopping BlockRights services..." -ForegroundColor Yellow

# Stop any running Node.js processes
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Stopping Node.js processes..." -ForegroundColor Red
    try {
        $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
        Write-Host "Node.js processes stopped." -ForegroundColor Green
    } catch {
        Write-Host "Some processes may require elevated permissions." -ForegroundColor Yellow
    }
} else {
    Write-Host "No running Node.js processes found." -ForegroundColor Green
}

# Stop processes on specific ports
$ports = @(3000, 5000)
foreach ($port in $ports) {
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connections) {
            Write-Host "Stopping process on port $port..." -ForegroundColor Red
            foreach ($connection in $connections) {
                try {
                    $process = Get-Process -Id $connection.OwningProcess -ErrorAction SilentlyContinue
                    if ($process -and $process.ProcessName -eq "node") {
                        $process | Stop-Process -Force -ErrorAction SilentlyContinue
                        Write-Host "Process on port $port stopped." -ForegroundColor Green
                    }
                } catch {
                    Write-Host "Could not stop process on port $port (may require admin rights)" -ForegroundColor Yellow
                }
            }
        }
    } catch {
        Write-Host "Could not check port $port" -ForegroundColor Yellow
    }
}

# Alternative method: Kill processes by port using netstat
try {
    $netstatOutput = netstat -ano | findstr ":3000"
    if ($netstatOutput) {
        $pids = ($netstatOutput | ForEach-Object { ($_ -split '\s+')[-1] }) | Sort-Object -Unique
        foreach ($pid in $pids) {
            if ($pid -and $pid -ne "0") {
                try {
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                    Write-Host "Killed process $pid on port 3000" -ForegroundColor Green
                } catch {
                    Write-Host "Could not kill process $pid" -ForegroundColor Yellow
                }
            }
        }
    }
} catch {
    Write-Host "Could not use netstat method" -ForegroundColor Yellow
}

try {
    $netstatOutput = netstat -ano | findstr ":5000"
    if ($netstatOutput) {
        $pids = ($netstatOutput | ForEach-Object { ($_ -split '\s+')[-1] }) | Sort-Object -Unique
        foreach ($pid in $pids) {
            if ($pid -and $pid -ne "0") {
                try {
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                    Write-Host "Killed process $pid on port 5000" -ForegroundColor Green
                } catch {
                    Write-Host "Could not kill process $pid" -ForegroundColor Yellow
                }
            }
        }
    }
} catch {
    Write-Host "Could not use netstat method for port 5000" -ForegroundColor Yellow
}

Write-Host "BlockRights services stopped successfully!" -ForegroundColor Green

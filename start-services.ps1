# Start all services for development

Write-Host "Starting Unitex services..." -ForegroundColor Cyan

# Start server in background
Write-Host "Starting Server on port 5002..." -ForegroundColor Green
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "server/src/index.js" -WorkingDirectory $PSScriptRoot

# Start client in background
Write-Host "Starting Client on port 3004..." -ForegroundColor Blue
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory "$PSScriptRoot\client"

# Start media service in background
Write-Host "Starting Media Service on port 4001..." -ForegroundColor Magenta
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory "$PSScriptRoot\media-service"

Write-Host "All services started! Check ports 3004 (client), 5002 (server), 4001 (media)" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow

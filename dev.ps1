# UniteX Dev Orchestrator for Windows
Write-Host "Starting UniteX Platform..." -ForegroundColor Cyan

$jobs = @()

# 1. Start Client
$jobs += Start-Job -ScriptBlock { 
    Set-Location "c:\Users\chava\Downloads\u\client"
    npm run dev
} -Name "UniteX-Client"

# 2. Start Server
$jobs += Start-Job -ScriptBlock {
    Set-Location "c:\Users\chava\Downloads\u\server"
    npm run dev
} -Name "UniteX-Server"

# 3. Start Media Service
$jobs += Start-Job -ScriptBlock {
    Set-Location "c:\Users\chava\Downloads\u\media-service"
    npm run dev
} -Name "UniteX-Media"

# 4. Start Blockchain
$jobs += Start-Job -ScriptBlock {
    Set-Location "c:\Users\chava\Downloads\u\blockchain"
    npx hardhat node
} -Name "UniteX-Blockchain"

Write-Host "Services started in background jobs." -ForegroundColor Green
Write-Host "Use 'Get-Job' to see status and 'Receive-Job -Name <Name> -Keep' to see logs."
Write-Host "Press Ctrl+C to stop this script (Note: background jobs will still run until stopped)."

# Keep open to allow seeing the message
while($true) { Start-Sleep 1 }

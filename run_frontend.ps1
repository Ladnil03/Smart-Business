# Run frontend development server
# Usage: .\run_frontend.ps1

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$projectRoot\frontend"

Write-Host "Starting VyaparSeth Frontend..." -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

npm run dev

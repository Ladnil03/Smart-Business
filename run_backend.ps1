# Run FastAPI backend from project root
# Usage: .\run_backend.ps1

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

Write-Host "Starting VyaparSeth API..." -ForegroundColor Green
Write-Host "API will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Swagger Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""

python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

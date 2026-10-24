# AXONOVA One-Click PowerShell Launcher
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       AXONOVA: Brain MRI Analysis Platform             " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = $PSScriptRoot
if (-not $projectRoot) { $projectRoot = Get-Location }

# Start Backend
Write-Host "Starting FastAPI Backend on port 8000..." -ForegroundColor Green
Start-Process -FilePath "powershell.exe" -WorkingDirectory "$projectRoot" -ArgumentList "-ExecutionPolicy", "Bypass", "-NoExit", "-Command", "`$env:PYTHONPATH='backend'; py -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

# Start Frontend
Write-Host "Starting Vite Frontend on port 5173..." -ForegroundColor Green
Start-Process -FilePath "powershell.exe" -WorkingDirectory "$projectRoot\frontend" -ArgumentList "-ExecutionPolicy", "Bypass", "-NoExit", "-Command", "npm.cmd run dev -- --host 127.0.0.1 --port 5173"

Write-Host "Waiting 3 seconds for services to become available..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Launch default browser
Write-Host "Opening AXONOVA in browser..." -ForegroundColor Cyan
Start-Process "http://127.0.0.1:5173/tasks"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host " AXONOVA is ready!" -ForegroundColor Green
Write-Host " - Conditions Hub: http://127.0.0.1:5173/tasks" -ForegroundColor White
Write-Host " - Scan Center:    http://127.0.0.1:5173/scans" -ForegroundColor White
Write-Host " - Backend API:    http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Green


# PowerShell script to run scaling-demo-app with Docker

Write-Host "Pulling nginx image..." -ForegroundColor Green
docker pull nginx:latest

Write-Host "Creating Docker network..." -ForegroundColor Green
docker network create my-network 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Network 'my-network' may already exist, continuing..." -ForegroundColor Yellow
}

Write-Host "Starting Backend 1..." -ForegroundColor Green
docker run -d `
  --name backend1 `
  --network my-network `
  -p 5001:5001 `
  -e PORT=5001 `
  scaling-demo-app

Write-Host "Starting Backend 2..." -ForegroundColor Green
docker run -d `
  --name backend2 `
  --network my-network `
  -p 5002:5002 `
  -e PORT=5002 `
  scaling-demo-app

Write-Host "Starting Nginx..." -ForegroundColor Green
docker run -d `
  --name nginx `
  --network my-network `
  -p 6001:80 `
  nginx

Write-Host "`nAll containers started successfully!" -ForegroundColor Green
Write-Host "Backend 1: http://localhost:5001" -ForegroundColor Cyan
Write-Host "Backend 2: http://localhost:5002" -ForegroundColor Cyan
Write-Host "Nginx Load Balancer: http://localhost:6001" -ForegroundColor Cyan


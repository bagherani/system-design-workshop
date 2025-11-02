@echo off
REM Batch script to run scaling-demo-app with Docker

echo Pulling nginx image...
docker pull nginx:latest

echo Creating Docker network...
docker network create my-network 2>nul
if errorlevel 1 (
    echo Network 'my-network' may already exist, continuing...
)

echo Starting Backend 1...
docker run -d ^
  --name backend1 ^
  --network my-network ^
  -p 5001:5001 ^
  -e PORT=5001 ^
  scaling-demo-app

echo Starting Backend 2...
docker run -d ^
  --name backend2 ^
  --network my-network ^
  -p 5002:5002 ^
  -e PORT=5002 ^
  scaling-demo-app

echo Starting Nginx...
docker run -d ^
  --name nginx ^
  --network my-network ^
  -p 6001:80 ^
  nginx

echo.
echo All containers started successfully!
echo Backend 1: http://localhost:5001
echo Backend 2: http://localhost:5002
echo Nginx Load Balancer: http://localhost:6001


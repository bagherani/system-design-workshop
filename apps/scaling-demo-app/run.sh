docker pull nginx:latest
docker network create my-network
# Backend 1
docker run -d \
  --name backend1 \
  --network my-network \
  -p 5001:5001 \
  -e PORT=5001 \
  scaling-demo-app

# Backend 2
docker run -d \
  --name backend2 \
  --network my-network \
  -p 5002:5002 \
  -e PORT=5002 \
  scaling-demo-app

# Nginx
docker run -d \
  --name nginx \
  --network my-network \
  -p 6001:80 \
  nginx

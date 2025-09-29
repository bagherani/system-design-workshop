## 1- Build the app

```
nx build users-service-rest
```

## 2- build the docker image

```
cd apps/users-service-rest
docker build -t users-service-rest .
# or
npm run docker:build
```

## 3- Run the docker images

```
chmod +x run.sh
./run.sh
```

## 4- Go to the nginx shell

```
cd /etc/nginx
apt-get update
apt-get install nano
nano nginx.conf
```

```
events {
    worker_connections 1024;
}

http {
    upstream backend {
        # load balancing algorithm:
        # least_conn;
        # ip_hash;

        # weighted:
        # server backend1:5001 weight=2;
        # server backend2:5002 weight=1;

        # passive health check
        server backend1:5001 max_fails=3 fail_timeout=30s;
        server backend2:5002 max_fails=3 fail_timeout=30s;

        # active health check
        # server backend1:5001;
        # server backend2:5002;
        # health_check interval=5s uri=/healthz;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
        }
    }
}
```

```
# test the configuration
nginx -t

nginx -s reload
```

## 5- Open http://localhost:6001

Everytime one server should recieve the request

## 6- Try to stop one server

Stop one of the containers

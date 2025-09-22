## build the app

- nx build users-service-rest

## build the docker image

```
docker build -t users-service-rest .
```

## run the docker images

```
cd apps/users-service-rest
chmod +x run.sh
./run.sh
```

## go to the nginx shell

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

nginx -t  
nginx -s reload

## try to stop one server

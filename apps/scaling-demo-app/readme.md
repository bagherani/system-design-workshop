## 1- Build the app

```
nx build scaling-demo-app
```

## 2- build the docker image

```
cd apps/scaling-demo-app
docker build -t scaling-demo-app .
# or
npm run docker:build
```

## 3- Run the docker images

### For Linux/Mac:

```bash
chmod +x run.sh
./run.sh
```

### For Windows:

**Option 1: Using PowerShell (Recommended)**

```powershell
.\run.ps1
```

**Option 2: Using Command Prompt**

```cmd
run.bat
```

**Note for Windows users:** If you get an execution policy error in PowerShell, you can bypass it by running:

```powershell
powershell -ExecutionPolicy Bypass -File .\run.ps1
```

Or set your execution policy (run PowerShell as Administrator):

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 4- Go to the nginx shell

First, access the nginx container:

```bash
docker exec -it nginx bash
# or if bash is not available:
docker exec -it nginx sh
```

Then navigate to the nginx configuration directory and edit the config:

```bash
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

```
docker stop backend2
```

Stop one of the containers

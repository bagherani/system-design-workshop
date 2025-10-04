# Redis Cluster Demo App

A Node.js application demonstrating how to connect to and interact with a Redis cluster.

## Prerequisites

Make sure your Redis cluster is running. Follow the setup instructions in `/libs/caching/redis/readme.md` to create the cluster.

## Features Demonstrated

This app demonstrates:

- ✅ **Connecting to Redis Cluster** - Connects to all 3 nodes with automatic failover
- ✅ **Basic SET/GET** - Write and read simple key-value pairs
- ✅ **JSON Storage** - Store and retrieve JSON objects
- ✅ **TTL/Expiration** - Set keys with automatic expiration (SETEX)
- ✅ **Hash Tags** - Use `{key}` pattern to keep related data on same node
- ✅ **MGET** - Get multiple values at once (works with hash tags)
- ✅ **Counters** - Increment numeric values (INCR)
- ✅ **Lists** - Store ordered lists of items (LPUSH/LRANGE)
- ✅ **Sets** - Store unique collections (SADD/SMEMBERS)
- ✅ **Cluster Info** - Query cluster metadata
- ✅ **Graceful Shutdown** - Properly close connections on exit

## Running the App

### Build and Run

```bash
# Build the app
nx build redis-app

# Run the app
nx serve redis-app
```

### Or build and run the production version

```bash
nx build redis-app --configuration=production
node apps/redis-app/dist/main.js
```

## What to Expect

When you run the app, it will:

1. Connect to the Redis cluster (localhost:6379, 6380, 6381)
2. Perform various write operations (SET, SETEX, LPUSH, SADD)
3. Read the data back (GET, MGET, LRANGE, SMEMBERS)
4. Display cluster information
5. Stay running until you press Ctrl+C or type "quit"

## Example Output

```
🔴 Redis Cluster Client started
📡 Connecting to Redis Cluster:
   - localhost:6379
   - localhost:6380
   - localhost:6381
---
✅ Connected to Redis Cluster
✅ Redis Cluster is ready
---
🚀 Starting Redis operations demo...

📝 WRITE Operations:
-------------------
✅ SET user:1001
✅ SET user:1002
✅ SET product:5001
✅ SET product:5002
✅ SET session:abc123 (expires in 300 seconds)

📖 READ Operations:
------------------
✅ GET user:1001: { id: 1001, name: 'John Doe', email: 'john@example.com' }
✅ GET user:1002: { id: 1002, name: 'Jane Smith', email: 'jane@example.com' }
...
```

## Troubleshooting

### Connection Refused

If you see "Connection refused" errors, make sure your Redis cluster is running:

```bash
# Check if containers are running
docker ps | grep redis-node

# If not, start them following /libs/caching/redis/readme.md
```

### MOVED Errors

If you see MOVED errors, the app automatically handles redirects using the `ioredis` cluster client. No action needed.

## Learn More

- Redis Cluster Setup: `/libs/caching/redis/readme.md`
- ioredis Documentation: https://github.com/redis/ioredis

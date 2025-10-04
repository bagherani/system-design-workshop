## Redis Cluster Lab - Setup Only

This demo sets up a **real Redis cluster** with automatic data sharding. Redis automatically distributes data across nodes using hash slots.

**Architecture:**

- 3 Redis Master Nodes (each handles a portion of the data)
- Automatic data distribution using hash slots (16384 slots total)
- Distributed caching with automatic routing

**Prerequisites:**

- Docker is installed and running

---

### Step 1: Create Docker Network

First, create a Docker network so Redis nodes can communicate:

```bash
docker network create redis-cluster-net
```

---

### Step 2: Start 3 Redis Nodes

Start three Redis instances in cluster mode:

**Node 1:**

```bash
docker run -d \
  --name redis-node-1 \
  --net redis-cluster-net \
  -p 6379:6379 \
  redis:7-alpine \
  redis-server --cluster-enabled yes \
  --cluster-config-file nodes.conf \
  --cluster-node-timeout 5000 \
  --appendonly yes \
  --port 6379
```

**Node 2:**

```bash
docker run -d \
  --name redis-node-2 \
  --net redis-cluster-net \
  -p 6380:6380 \
  redis:7-alpine \
  redis-server --cluster-enabled yes \
  --cluster-config-file nodes.conf \
  --cluster-node-timeout 5000 \
  --appendonly yes \
  --port 6380
```

**Node 3:**

```bash
docker run -d \
  --name redis-node-3 \
  --net redis-cluster-net \
  -p 6381:6381 \
  redis:7-alpine \
  redis-server --cluster-enabled yes \
  --cluster-config-file nodes.conf \
  --cluster-node-timeout 5000 \
  --appendonly yes \
  --port 6381
```

Wait 5 seconds for all nodes to start.

---

### Step 3: Create the Redis Cluster

Now link the three nodes together to form a cluster:

```bash
docker exec -it redis-node-1 redis-cli --cluster create \
  redis-node-1:6379 \
  redis-node-2:6380 \
  redis-node-3:6381 \
  --cluster-yes
```

**What happens:**

- Redis divides 16,384 hash slots among the 3 nodes
- Each node becomes responsible for ~5,461 slots
- Keys are automatically distributed based on hash slots

---

### Step 4: Verify Cluster Status

Check the cluster is healthy:

```bash
docker exec -it redis-node-1 redis-cli -p 6379 cluster info
```

You should see:

```
cluster_state:ok
cluster_slots_assigned:16384
cluster_size:3
...
```

Check which slots each node handles:

```bash
docker exec -it redis-node-1 redis-cli -p 6379 cluster nodes
```

---

### Cleanup

When done, remove all containers and network:

```bash
docker rm -f redis-node-1 redis-node-2 redis-node-3
docker network rm redis-cluster-net
```

---

## Cluster Connection Info

- **Node 1:** `localhost:6379`
- **Node 2:** `localhost:6380`
- **Node 3:** `localhost:6381`

Connect to any node - Redis automatically routes requests to the correct node based on the key's hash slot.

This is a production-ready Redis cluster setup (simplified for demo purposes).

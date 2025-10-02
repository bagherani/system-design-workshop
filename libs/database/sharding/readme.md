## MongoDB Sharding Lab - Real Sharded Cluster

This demo sets up a **real MongoDB sharded cluster** with automatic data distribution. MongoDB handles all routing and data placement based on the shard key you define.

**Architecture:**

- 1 Config Server (stores cluster metadata)
- 2 Shard Servers (store actual data)
- 1 Mongos Router (query router - your app connects here)

**Prerequisites:**

- Docker is installed and running
- VSCode/Cursor with the "SQLTools" or "MongoDB for VS Code" extension

---

### Step 1: Start Config Server

The config server stores metadata about which data lives on which shard.

```bash
docker run -d \
  --name mongo-config \
  -p 27019:27019 \
  mongo:7 \
  --configsvr --replSet configReplSet --port 27019
```

Initialize the config server replica set:

```bash
docker exec -it mongo-config mongosh --port 27019 --eval '
rs.initiate({
  _id: "configReplSet",
  configsvr: true,
  members: [{ _id: 0, host: "mongo-config:27019" }]
})
'
```

Wait 10 seconds for the config server to become PRIMARY.

---

### Step 2: Start Shard Servers

Start two shard servers that will store your actual data:

**Shard 1:**

```bash
docker run -d \
  --name mongo-shard1 \
  -p 27021:27021 \
  mongo:7 \
  --shardsvr --replSet shard1ReplSet --port 27021
```

Initialize Shard 1:

```bash
docker exec -it mongo-shard1 mongosh --port 27021 --eval '
rs.initiate({
  _id: "shard1ReplSet",
  members: [{ _id: 0, host: "mongo-shard1:27021" }]
})
'
```

**Shard 2:**

```bash
docker run -d \
  --name mongo-shard2 \
  -p 27022:27022 \
  mongo:7 \
  --shardsvr --replSet shard2ReplSet --port 27022
```

Initialize Shard 2:

```bash
docker exec -it mongo-shard2 mongosh --port 27022 --eval '
rs.initiate({
  _id: "shard2ReplSet",
  members: [{ _id: 0, host: "mongo-shard2:27022" }]
})
'
```

Wait 10 seconds for both shards to become PRIMARY.

---

### Step 3: Start Mongos Router

The mongos router is what your application connects to. It routes queries to the correct shard.

```bash
docker run -d \
  --name mongo-router \
  --link mongo-config:mongo-config \
  --link mongo-shard1:mongo-shard1 \
  --link mongo-shard2:mongo-shard2 \
  -p 27017:27017 \
  mongo:7 \
  mongos --configdb configReplSet/mongo-config:27019
```

Wait 5 seconds for mongos to start.

---

### Step 4: Add Shards to Cluster

Connect to mongos and register both shards:

```bash
docker exec -it mongo-router mongosh --port 27017 --eval '
sh.addShard("shard1ReplSet/mongo-shard1:27021");
sh.addShard("shard2ReplSet/mongo-shard2:27022");
'
```

Verify shards are added:

```bash
docker exec -it mongo-router mongosh --port 27017 --eval 'sh.status()'
```

You should see both shards listed.

---

### Step 5: Enable Sharding and Create Sharded Collection

Enable sharding on the database and collection with `region` as the shard key:

```bash
docker exec -it mongo-router mongosh --port 27017 --eval '
sh.enableSharding("usersdb");
sh.shardCollection("usersdb.users", { region: "hashed" });
'
```

**Note:** We use `hashed` sharding for even distribution. You could also use `{ region: 1 }` for range-based sharding.

---

### Step 6: Insert Sample Data (All Through Mongos!)

Now insert data **only through mongos** (port 27017). MongoDB automatically distributes data across shards.

```bash
docker exec -it mongo-router mongosh --port 27017 usersdb --eval '
db.users.insertMany([
  { name: "John",   email: "john@example.com",   region: "Americas" },
  { name: "Marie",  email: "marie@example.com",  region: "Europe" },
  { name: "Noa",    email: "noa@example.com",    region: "Asia-Pacific" },
  { name: "Carlos", email: "carlos@example.com", region: "Americas" },
  { name: "Ahmed",  email: "ahmed@example.com",  region: "Africa" },
  { name: "Yuki",   email: "yuki@example.com",   region: "Asia-Pacific" },
  { name: "Emma",   email: "emma@example.com",   region: "Europe" },
  { name: "Luis",   email: "luis@example.com",   region: "Americas" }
])
'
```

---

### Step 7: Verify Data Distribution

Check how MongoDB distributed the data across shards:

```bash
docker exec -it mongo-router mongosh --port 27017 usersdb --eval '
db.users.getShardDistribution()
'
```

You'll see how many documents are on each shard.

---

### Step 8: Query Data (MongoDB Routes Automatically!)

Query through mongos - it automatically routes to the correct shard(s):

```bash
# Find all users in Americas
docker exec -it mongo-router mongosh --port 27017 usersdb --eval '
db.users.find({ region: "Americas" }).pretty()
'

# Count users per region
docker exec -it mongo-router mongosh --port 27017 usersdb --eval '
db.users.aggregate([
  { $group: { _id: "$region", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
'
```

---

### Step 9: Connect with SQLTools (Optional)

In VSCode/Cursor with SQLTools + MongoDB driver:

1. Add a new MongoDB connection:
   - **Connection String:** `mongodb://localhost:27017/usersdb`
   - **Name:** MongoDB Sharded Cluster
2. Connect and explore the `users` collection
3. All queries go through mongos automatically

---

### Cleanup

When done, remove all containers:

```bash
docker rm -f mongo-router mongo-shard1 mongo-shard2 mongo-config
```

---

## Key Differences from Manual Sharding

✅ **Automatic routing:** Your app only connects to mongos (port 27017)  
✅ **Automatic distribution:** MongoDB decides which shard gets which data  
✅ **Transparent queries:** Query the collection normally; MongoDB handles the rest  
✅ **Scalable:** Add more shards with `sh.addShard()` without app changes

This is production-ready MongoDB sharding architecture (simplified for demo purposes).

"use strict";
var import_cache_util = require("@io/cache-util");
(async function main() {
  await import_cache_util.redisCluster.set(
    "user:1001",
    JSON.stringify({
      id: 1001,
      name: "John Doe",
      email: "john@example.com"
    })
  );
  const user1001 = await import_cache_util.redisCluster.get("user:1001");
  console.log(user1001);
  await import_cache_util.redisCluster.setex(
    "session:abc123",
    300,
    JSON.stringify({
      userId: 1001,
      loginTime: (/* @__PURE__ */ new Date()).toISOString()
    })
  );
  await import_cache_util.redisCluster.set("{user:1001}:name", "John Doe");
  await import_cache_util.redisCluster.set("{user:1001}:email", "john@example.com");
  await import_cache_util.redisCluster.set("{user:1001}:age", "30");
  const [name, email, age] = await import_cache_util.redisCluster.mget(
    "{user:1001}:name",
    "{user:1001}:email",
    "{user:1001}:age"
  );
  console.log("\u2705 Hash Tags + MGET:", { name, email, age });
  await import_cache_util.redisCluster.set("product:1001", "user:1001", "EX", 300, "NX");
  const seat1001 = await import_cache_util.redisCluster.get("seat:1001");
  console.log("\u2705 Atomic set:", seat1001);
  const SHARD_COUNT = 3;
  for (let workerId = 0; workerId < 3e6; workerId++) {
    const shardId = workerId % SHARD_COUNT;
    await import_cache_util.redisCluster.incr(`{post:1001}:views:${shardId}`);
  }
  const shardKeys = Array.from(
    { length: SHARD_COUNT },
    (_, i) => `{post:1001}:views:1${i}`
  );
  const shardValues = await import_cache_util.redisCluster.mget(...shardKeys);
  const totalViews = shardValues.reduce(
    (sum, val) => sum + (Number(val) || 0),
    0
  );
  console.log(`\u2705 INCR distributed counter: ${totalViews} total views`);
  console.log(`   Shards: [${shardValues.join(", ")}]`);
})();
async function gracefulShutdown(signal) {
  await (0, import_cache_util.closeRedisCluster)();
  process.exit(0);
}
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGUSR1", () => gracefulShutdown("SIGUSR1"));
process.on("SIGUSR2", () => gracefulShutdown("SIGUSR2"));
process.on("uncaughtException", async (error) => {
  await (0, import_cache_util.closeRedisCluster)();
  process.exit(1);
});
process.on("unhandledRejection", async (reason, promise) => {
  await (0, import_cache_util.closeRedisCluster)();
  process.exit(1);
});
process.stdin.setEncoding("utf8");
process.stdin.on("data", (data) => {
  const input = data.toString().trim();
  if (input === "quit" || input === "exit" || input === "stop") {
    gracefulShutdown("MANUAL");
  }
});
//# sourceMappingURL=main.js.map

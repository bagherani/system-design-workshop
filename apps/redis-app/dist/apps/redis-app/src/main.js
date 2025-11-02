"use strict";
var import_cache_util = require("@io/cache-util");
console.log("\u{1F534} Redis Cluster Client started");
console.log("\u{1F4E1} Connecting to Redis Cluster...");
console.log("---");
import_cache_util.redisCluster.on("ready", async () => {
  console.log("---");
  await runRedisDemo();
});
async function runRedisDemo() {
  try {
    console.log("\u{1F680} Starting Redis operations demo...\n");
    console.log("\u{1F4DD} Basic Operations:");
    console.log("-------------------");
    await import_cache_util.redisCluster.set(
      "user:1001",
      JSON.stringify({
        id: 1001,
        name: "John Doe",
        email: "john@example.com"
      })
    );
    console.log("\u2705 SET user:1001");
    const user1001 = await import_cache_util.redisCluster.get("user:1001");
    console.log("\u2705 GET user:1001:", JSON.parse(user1001 || "{}"));
    await import_cache_util.redisCluster.setex(
      "session:abc123",
      300,
      JSON.stringify({
        userId: 1001,
        loginTime: (/* @__PURE__ */ new Date()).toISOString()
      })
    );
    console.log("\u2705 SETEX session:abc123 (expires in 300 seconds)");
    const ttl = await import_cache_util.redisCluster.ttl("session:abc123");
    console.log(`\u2705 TTL session:abc123: ${ttl} seconds remaining`);
    console.log("\n\u{1F50D} Advanced Operations:");
    console.log("---------------------");
    await import_cache_util.redisCluster.set("{user:1001}:name", "John Doe");
    await import_cache_util.redisCluster.set("{user:1001}:email", "john@example.com");
    await import_cache_util.redisCluster.set("{user:1001}:age", "30");
    const [name, email, age] = await import_cache_util.redisCluster.mget(
      "{user:1001}:name",
      "{user:1001}:email",
      "{user:1001}:age"
    );
    console.log("\u2705 Hash Tags + MGET:", { name, email, age });
    await import_cache_util.redisCluster.incr("page:views");
    const views = await import_cache_util.redisCluster.get("page:views");
    console.log(`\u2705 INCR page:views: ${views}`);
    await import_cache_util.redisCluster.lpush("notifications:1001", "Welcome to the app!");
    const notifications = await import_cache_util.redisCluster.lrange(
      "notifications:1001",
      0,
      -1
    );
    console.log("\u2705 LPUSH/LRANGE notifications:", notifications);
    await import_cache_util.redisCluster.sadd("user:1001:interests", "coding", "music", "gaming");
    const interests = await import_cache_util.redisCluster.smembers("user:1001:interests");
    console.log("\u2705 SADD/SMEMBERS interests:", interests);
    console.log("\n\u{1F4CA} Cluster Information:");
    console.log("----------------------");
    const nodes = import_cache_util.redisCluster.nodes("master");
    console.log(`\u2705 Cluster has ${nodes.length} master nodes`);
    console.log("\n\u2705 Redis demo completed successfully!");
    console.log("---");
    console.log('\u{1F4A1} Press Ctrl+C to exit or type "quit" and press Enter');
    console.log("\u23F3 Keeping connection alive...");
    setInterval(() => {
    }, 6e4);
  } catch (error) {
    console.error("\u274C Error during Redis operations:", error);
    console.error("Full error:", error);
  }
}
async function gracefulShutdown(signal) {
  console.log(`
\u{1F6D1} Received ${signal}, shutting down Redis App...`);
  await (0, import_cache_util.closeRedisCluster)();
  console.log("\u2705 Redis App shutdown complete");
  process.exit(0);
}
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGUSR1", () => gracefulShutdown("SIGUSR1"));
process.on("SIGUSR2", () => gracefulShutdown("SIGUSR2"));
process.on("uncaughtException", async (error) => {
  console.error("\u{1F4A5} Uncaught Exception:", error);
  await (0, import_cache_util.closeRedisCluster)();
  process.exit(1);
});
process.on("unhandledRejection", async (reason, promise) => {
  console.error("\u{1F4A5} Unhandled Rejection at:", promise, "reason:", reason);
  await (0, import_cache_util.closeRedisCluster)();
  process.exit(1);
});
process.stdin.setEncoding("utf8");
process.stdin.on("data", (data) => {
  const input = data.toString().trim();
  if (input === "quit" || input === "exit" || input === "stop") {
    console.log("\u{1F4DD} Manual shutdown requested via stdin");
    gracefulShutdown("MANUAL");
  }
});

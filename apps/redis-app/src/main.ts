import { redisCluster, closeRedisCluster } from '@io/cache-util';

(async function main() {
  /**
   * SET
   */
  await redisCluster.set(
    'user:1001',
    JSON.stringify({
      id: 1001,
      name: 'John Doe',
      email: 'john@example.com',
    })
  );

  /**
   * GET
   */
  const user1001 = await redisCluster.get('user:1001');
  console.log(user1001);

  /**
   * SETEX
   */
  await redisCluster.setex(
    'session:abc123',
    300,
    JSON.stringify({
      userId: 1001,
      loginTime: new Date().toISOString(),
    })
  );

  /**
   * MGET
   */
  await redisCluster.set('{user:1001}:name', 'John Doe');
  await redisCluster.set('{user:1001}:email', 'john@example.com');
  await redisCluster.set('{user:1001}:age', '30');
  const [name, email, age] = await redisCluster.mget(
    '{user:1001}:name',
    '{user:1001}:email',
    '{user:1001}:age'
  );
  console.log('✅ Hash Tags + MGET:', { name, email, age });

  /**
   * Atomic set and get with NX flag
   */
  await redisCluster.set('product:1001', 'user:1001', 'EX', 300, 'NX');
  const seat1001 = await redisCluster.get('seat:1001');
  console.log('✅ Atomic set:', seat1001);

  
  /**
   * INCR - Distributed Counter Pattern
   * Using hash tags to keep shards on same node for efficient MGET
   */
  const SHARD_COUNT = 3;

  // Simulate 3 workers incrementing the counter
  for (let workerId = 0; workerId < 3000000; workerId++) {
    const shardId = workerId % SHARD_COUNT;
    // Hash tag {post:1001} ensures all shards on same node
    await redisCluster.incr(`{post:1001}:views:${shardId}`);
  }

  // Read all shards efficiently with MGET (single network call)
  const shardKeys = Array.from(
    { length: SHARD_COUNT },
    (_, i) => `{post:1001}:views:1${i}`
  );
  const shardValues = await redisCluster.mget(...shardKeys);
  const totalViews = shardValues.reduce(
    (sum, val) => sum + (Number(val) || 0),
    0
  );

  console.log(`✅ INCR distributed counter: ${totalViews} total views`);
  console.log(`   Shards: [${shardValues.join(', ')}]`);
})();

/**
-------- shutdown --------
 */
async function gracefulShutdown(signal: string) {
  await closeRedisCluster();
  process.exit(0);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT')); // Ctrl+C
process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); // Docker/PM2 stop
process.on('SIGUSR1', () => gracefulShutdown('SIGUSR1')); // Custom shutdown
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // Custom shutdown

process.on('uncaughtException', async (error) => {
  await closeRedisCluster();
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  await closeRedisCluster();
  process.exit(1);
});

process.stdin.setEncoding('utf8');
process.stdin.on('data', (data) => {
  const input = data.toString().trim();
  if (input === 'quit' || input === 'exit' || input === 'stop') {
    gracefulShutdown('MANUAL');
  }
});

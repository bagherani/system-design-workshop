import Redis from 'ioredis';

// Create and export Redis Cluster client
export const redisCluster = new Redis.Cluster(
  [
    { host: 'localhost', port: 6379 },
    { host: 'localhost', port: 6380 },
    { host: 'localhost', port: 6381 },
  ],
  {
    redisOptions: {
      connectTimeout: 10000,
    },
    clusterRetryStrategy: (times) => {
      const delay = Math.min(100 + times * 2, 2000);
      return delay;
    },
    // Map internal Docker IPs to localhost
    natMap: {
      '172.18.0.2:6379': { host: 'localhost', port: 6379 },
      '172.18.0.3:6380': { host: 'localhost', port: 6380 },
      '172.18.0.4:6381': { host: 'localhost', port: 6381 },
    },
  }
);

// Handle connection events
redisCluster.on('connect', () => {
  console.log('✅ Redis Cluster connected');
});

redisCluster.on('ready', () => {
  console.log('✅ Redis Cluster ready');
});

redisCluster.on('error', (err) => {
  console.error('❌ Redis Cluster Error:', err.message);
});

redisCluster.on('close', () => {
  console.log('🔌 Redis Cluster connection closed');
});

// Helper function to gracefully close the connection
export async function closeRedisCluster(): Promise<void> {
  try {
    await redisCluster.quit();
    console.log('✅ Redis cluster connection closed gracefully');
  } catch (error) {
    console.error('⚠️ Error closing Redis connection:', error);
    redisCluster.disconnect();
  }
}

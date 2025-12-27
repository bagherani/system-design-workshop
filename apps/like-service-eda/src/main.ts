import type { Consumer } from 'kafkajs';
import { createConsumer, disconnectConsumer } from '@io/messaging-util';

// In-memory store for post likes (in a real app, you'd use a database)
// Structure: Map<postId, Set<userId>>
const postLikesStore = new Map<string, Set<string>>();

type PostLikedEvent = {
  postId: string;
  userId: string;
  likedAt?: string;
};

function isPostLikedEvent(value: unknown): value is PostLikedEvent {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.postId === 'string' && typeof v.userId === 'string';
}

let consumer: Consumer | null = null;

async function start(): Promise<void> {
  console.log('🚀 like-service-eda starting (Kafka consumer)...');
  console.log('  Topic: post_liked');
  console.log('  Group: like-service-eda');

  consumer = await createConsumer(
    'like-service-eda',
    ['post_liked'],
    async ({ topic, partition, key, value, offset }) => {
      if (!isPostLikedEvent(value)) {
        console.warn('⚠️  Ignoring invalid post_liked message', {
          topic,
          partition,
          key,
          offset,
          value,
        });
        return;
      }

      const { postId, userId, likedAt } = value;

      if (!postLikesStore.has(postId)) {
        postLikesStore.set(postId, new Set<string>());
      }

      const likesSet = postLikesStore.get(postId);
      if (!likesSet) return;

      const alreadyLiked = likesSet.has(userId);
      if (!alreadyLiked) likesSet.add(userId);

      console.log(
        `❤️  Consumed post_liked: postId=${postId} userId=${userId}${
          likedAt ? ` likedAt=${likedAt}` : ''
        }`
      );
      console.log(
        `  Idempotent: ${alreadyLiked ? 'already-liked' : 'new-like'}`
      );
      console.log(`  Total likes for post: ${likesSet.size}`);
      console.log(`  Total posts with likes: ${postLikesStore.size}`);
    }
  );

  console.log('✅ like-service-eda is consuming...');
}

async function shutdown(signal: string): Promise<void> {
  console.log(`\nShutting down like-service-eda (${signal})...`);
  try {
    if (consumer) await disconnectConsumer(consumer);
  } catch (error) {
    console.error('Error during shutdown:', error);
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

start().catch((error) => {
  console.error('Failed to start like-service-eda:', error);
  process.exit(1);
});

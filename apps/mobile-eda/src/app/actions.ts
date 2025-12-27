'use server';

import { sendMessage } from '@io/messaging-util';

type SendLikeResult = {
  success: boolean;
  postId: string;
  userId: string;
  message: string;
  error?: string;
};

export async function sendLike(): Promise<SendLikeResult> {
  // Generate random IDs (same behavior as the gRPC demo, but now we publish an event)
  const postId = `post-${Math.floor(Math.random() * 1000)}`;
  const userId = `user-${Math.floor(Math.random() * 1000)}`;

  try {
    await sendMessage(
      'post_liked',
      {
        postId,
        userId,
        likedAt: new Date().toISOString(),
      },
      postId
    );

    return {
      success: true,
      postId,
      userId,
      message: `Published post_liked event for user ${userId} and post ${postId}`,
    };
  } catch (error) {
    console.error('Kafka publish error:', error);
    return {
      success: false,
      postId,
      userId,
      message: `Failed to publish post_liked event`,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

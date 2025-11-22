'use server';

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';

export async function sendLike() {
  return new Promise<{
    success: boolean;
    postId: string;
    userId: string;
    message: string;
    error?: string;
  }>((resolve) => {
    // Load the proto file
    const PROTO_PATH = join(process.cwd(), '../../libs/grpc-types/src/proto/post-like.proto');

    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const grpcObject = grpc.loadPackageDefinition(packageDefinition);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const postLikePackage = grpcObject.post_like as any;
    const PostLikeService = postLikePackage.PostLikeService;

    // Create a new client
    const client = new PostLikeService(
      'localhost:50052',
      grpc.credentials.createInsecure()
    );

    // Generate random IDs
    const postId = `post-${Math.floor(Math.random() * 1000)}`;
    const userId = `user-${Math.floor(Math.random() * 1000)}`;

    const request = {
      post_id: postId,
      user_id: userId,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client.LikePost(request, (error: any, response: any) => {
      client.close();

      if (error) {
        console.error('gRPC Error:', error);
        resolve({
          success: false,
          postId,
          userId,
          message: `Failed to like post`,
          error: error.message,
        });
      } else {
        resolve({
          success: response.success,
          postId,
          userId,
          message: `User ${userId} liked post ${postId}`,
        });
      }
    });
  });
}


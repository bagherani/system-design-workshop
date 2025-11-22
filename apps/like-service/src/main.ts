import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import type { LikePostRequest, LikePostReply } from '@io/grpc-types';
import { join } from 'path';
import { workspaceRoot } from '@nx/devkit';

const packageDef = protoLoader.loadSync(
  join(workspaceRoot, 'libs/grpc-types/src/proto', 'post-like.proto')
);
const grpcObject = grpc.loadPackageDefinition(packageDef);

const postLikePackage = grpcObject.post_like as grpc.GrpcObject;
const PostLikeService =
  postLikePackage.PostLikeService as grpc.ServiceClientConstructor & {
    service: grpc.ServiceDefinition;
  };

const server = new grpc.Server();

// In-memory store for post likes (in a real app, you'd use a database)
// Structure: Map<postId, Set<userId>>
const postLikesStore = new Map<string, Set<string>>();

server.addService(PostLikeService.service, {
  LikePost: (
    call: grpc.ServerUnaryCall<LikePostRequest, LikePostReply>,
    callback: grpc.sendUnaryData<LikePostReply>
  ) => {
    const request = call.request;

    // Validate required fields
    if (!request.postId || !request.userId) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Post ID and User ID are required',
      });
      return;
    }

    const { postId, userId } = request;

    // Get or create the set of users who liked this post
    if (!postLikesStore.has(postId)) {
      postLikesStore.set(postId, new Set<string>());
    }

    const likesSet = postLikesStore.get(postId);
    if (!likesSet) {
      callback({
        code: grpc.status.INTERNAL,
        message: 'Failed to retrieve likes for post',
      });
      return;
    }

    // Check if user already liked the post
    if (likesSet.has(userId)) {
      console.log(`User ${userId} already liked post ${postId}`);
      callback(null, { success: true });
      return;
    }

    // Add the like
    likesSet.add(userId);

    console.log(`User ${userId} liked post ${postId}`);
    console.log(`  Total likes for post: ${likesSet.size}`);
    console.log(`  Total posts with likes: ${postLikesStore.size}`);

    // Return success
    callback(null, { success: true });
  },
});

server.bindAsync(
  '0.0.0.0:50052',
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error('Failed to start gRPC server:', error);
      return;
    }
    console.log(`Post Like Service running on port ${port}`);
    console.log('Ready to receive like requests...');
  }
);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down Post Like Service...');
  server.tryShutdown(() => {
    console.log('Server shut down gracefully');
    process.exit(0);
  });
});

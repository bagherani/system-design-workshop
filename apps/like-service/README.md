# Like Service

A gRPC-based microservice for handling post likes. This service provides a simple API for users to like posts with in-memory storage.

## Architecture

The service is built using:

- **gRPC** for high-performance RPC communication
- **Protocol Buffers** for type-safe message definitions
- **TypeScript** for type safety
- **esbuild** for fast compilation

## Service Definition

The service implements the `PostLikeService` defined in `post-like.proto`:

```protobuf
service PostLikeService {
  rpc LikePost (LikePostRequest) returns (LikePostReply);
}

message LikePostRequest {
  string post_id = 1;
  string user_id = 2;
}

message LikePostReply {
  bool success = 1;
}
```

## Features

- ✅ Accept like requests from users for specific posts
- ✅ Validate required fields (post_id and user_id)
- ✅ In-memory storage of likes (Map<postId, Set<userId>>)
- ✅ Idempotent operations (duplicate likes are handled gracefully)
- ✅ Graceful shutdown support
- ✅ Comprehensive logging

## Running the Service

### Development Mode

```bash
# Build and run the service
nx build like-service
node apps/like-service/dist/main.js
```

### Using Nx Serve

```bash
nx serve like-service
```

The service will start on **port 50052**.

## How Consumers Can Call the Service

### 1. Using TypeScript/Node.js Client

```typescript
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import type { LikePostRequest } from '@io/grpc-types';

// Load the proto file
const packageDef = protoLoader.loadSync('path/to/post-like.proto');
const grpcObject = grpc.loadPackageDefinition(packageDef);
const postLikePackage = grpcObject.post_like as grpc.GrpcObject;
const PostLikeService = postLikePackage.PostLikeService as grpc.ServiceClientConstructor;

// Create a client
const client = new PostLikeService('localhost:50052', grpc.credentials.createInsecure()) as any;

// Make a request
const request: LikePostRequest = {
  postId: 'post-123',
  userId: 'user-456',
};

client.LikePost(request, (error: any, response: any) => {
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Success:', response.success);
  }
});
```

### 2. Example Test Client

See `src/client-example.ts` for a complete working example that demonstrates:

- Creating a gRPC client
- Making multiple like requests
- Handling responses and errors
- Proper client cleanup

Run the example:

```bash
npx ts-node apps/like-service/src/client-example.ts
```

### 3. Using grpcurl (CLI Testing)

```bash
# Like a post
grpcurl -plaintext -d '{"post_id": "post-123", "user_id": "user-456"}' \
  localhost:50052 post_like.PostLikeService/LikePost
```

## API Reference

### LikePost RPC

**Request:**

- `post_id` (string, required): The ID of the post to like
- `user_id` (string, required): The ID of the user liking the post

**Response:**

- `success` (boolean): Indicates if the operation was successful

**Error Codes:**

- `INVALID_ARGUMENT`: Missing required fields (post_id or user_id)
- `INTERNAL`: Internal server error

## Service Behavior

1. **First Like**: When a user likes a post for the first time, it's recorded in the store
2. **Duplicate Likes**: If a user has already liked a post, subsequent likes are idempotent (no error, just logs)
3. **Multiple Users**: Multiple users can like the same post
4. **Storage**: Likes are stored in memory using `Map<postId, Set<userId>>`

## Development

### Building

```bash
nx build like-service
```

### Testing

```bash
nx test like-service
```

### Linting

```bash
nx lint like-service
```

## Dependencies

- `@io/grpc-types`: Shared gRPC type definitions and proto files
- `@grpc/grpc-js`: gRPC implementation for Node.js
- `@grpc/proto-loader`: Dynamic proto loading

## Future Enhancements

- [ ] Add persistent storage (Redis, PostgreSQL)
- [ ] Add unlike functionality
- [ ] Add get likes count endpoint
- [ ] Add get users who liked a post endpoint
- [ ] Add authentication and authorization
- [ ] Add rate limiting
- [ ] Add monitoring and metrics
- [ ] Add unit and integration tests

## Port Configuration

- **Service Port**: 50052
- **Protocol**: gRPC (HTTP/2)

## Related Services

- `@io/grpc-types`: Shared proto definitions library

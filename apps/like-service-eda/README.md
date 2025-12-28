# Like Service (EDA)

A Kafka consumer microservice for handling post likes using an event-driven flow.

## Architecture

This service is built using:

- **TypeScript** for type safety
- **esbuild** for fast compilation
- **Kafka (KafkaJS)** via `@io/messaging-util`

## Event Contract

- **Topic**: `post_liked`
- **Key**: `postId`
- **Payload**: `{ postId, userId, likedAt }`

These events are produced by `apps/mobile-eda`.

## Features

- ✅ Consume like events from Kafka (`post_liked`)
- ✅ Validate required fields (`postId`, `userId`)
- ✅ In-memory storage of likes (Map<postId, Set<userId>>)
- ✅ Idempotent operations (duplicate likes are handled gracefully)
- ✅ Graceful shutdown support
- ✅ Comprehensive logging

## Running the Service

### Using Nx Serve

```bash
nx build messaging-util
nx serve like-service-eda
```

## Service Behavior

1. **First Like**: When a `post_liked` event is consumed for a `(postId, userId)` pair, it's recorded in the store.
2. **Duplicate Likes**: Duplicate events are handled idempotently (no error, just logs).
3. **Multiple Users**: Multiple users can like the same post.
4. **Storage**: Likes are stored in memory using `Map<postId, Set<userId>>`.

## Development

### Building

```bash
nx build like-service-eda
```

### Testing

```bash
nx test like-service-eda
```

### Linting

```bash
nx lint like-service-eda
```

## Dependencies

- `@io/messaging-util`: Kafka utilities (producer/consumer helpers)

## Future Enhancements

- [ ] Add persistent storage (Redis, PostgreSQL)
- [ ] Add unlike functionality
- [ ] Add get likes count endpoint
- [ ] Add get users who liked a post endpoint
- [ ] Add authentication and authorization
- [ ] Add rate limiting
- [ ] Add monitoring and metrics
- [ ] Add unit and integration tests

## Related Services

- `mobile-eda`: Produces `post_liked` events
- `messaging-util`: Kafka client helpers

## How to run
```
npx nx serve like-service-eda --output-style=stream
```
# Mobile App - Next.js with gRPC Integration

A Next.js mobile application that demonstrates integration with the `like-service` via gRPC using Next.js Server Actions. Features a beautiful UI with a like button that communicates directly with the backend microservice.

## Features

- ✅ Modern Next.js 15 with App Router
- ✅ Client-side like button with real-time feedback
- ✅ Next.js Server Actions for direct gRPC calls (no API route needed!)
- ✅ Random post and user ID generation
- ✅ Beautiful Tailwind CSS UI with animations
- ✅ Live response display
- ✅ Direct connection to `like-service` via gRPC

## Architecture

```
┌─────────────┐    Server Action      ┌──────────────────┐       gRPC        ┌──────────────┐
│   Browser   │ ─────────────────────> │  Next.js Server  │ ──────────────────>│ like-service │
│  (React UI) │   sendLike()          │  Action          │   localhost:50052  │   (gRPC)     │
└─────────────┘ <───────────────────── └──────────────────┘ <────────────────  └──────────────┘
                     Response                                    gRPC Response
```

### Why Server Actions?

With Next.js 13+, Server Actions allow us to call server-side code directly from client components without creating separate API routes:

1. **Browser** → Calls `sendLike()` Server Action
2. **Next.js Server Action** → Acts as gRPC client, calls like-service directly
3. **like-service** → Processes the request via gRPC
4. **Response flows back** through the Server Action to the client

**Benefits:**

- Cleaner code (no separate API route files)
- Type-safe communication
- Server-side execution for gRPC calls
- Simpler project structure

## Running the Application

### Prerequisites

Make sure the `like-service` is running:

```bash
# Build and run like-service
nx build like-service
node apps/like-service/dist/main.js
```

### Start the Mobile App

```bash
# Development mode
nx dev mobile

# Production build
nx build mobile
nx start mobile
```

The app will be available at **http://localhost:3000**

## Project Structure

```
apps/mobile/
├── src/
│   └── app/
│       ├── actions.ts                 # Server Actions (gRPC client)
│       ├── page.tsx                   # Main page with like button
│       ├── layout.tsx                 # App layout
│       └── global.css                 # Global styles
├── package.json
└── README.md
```

## Server Action Implementation

The `sendLike()` Server Action (`src/app/actions.ts`):

- Marked with `'use server'` directive
- Loads the `post-like.proto` file
- Creates a gRPC client connection to `localhost:50052`
- Generates random `postId` and `userId` for each request
- Calls the `LikePost` RPC method
- Returns the response directly to the client component

## UI Features

### Like Button

- Beautiful gradient design (pink to red)
- Hover animations
- Loading state with disabled styling
- Heart icon with bounce animation

### Response Display

- Real-time display of last response
- JSON formatted output
- Shows generated post and user IDs
- Success/error indication

### Like Counter

- Tracks total likes sent
- Large, colorful display
- Gradient text effect

### Info Section

- Explains the architecture
- Shows how the system works

## How It Works

1. **User clicks the like button** on the web page
2. **Frontend calls** `sendLike()` Server Action
3. **Server Action generates** random IDs:
   - `postId`: `post-{0-999}`
   - `userId`: `user-{0-999}`
4. **Server Action creates gRPC client** and connects to `localhost:50052`
5. **Calls like-service** with the generated IDs
6. **like-service processes** the request and stores in memory
7. **Response flows back** from the Server Action to the frontend
8. **UI updates** with the response data and increments counter

## Testing

### Manual Testing via Browser

1. Start both services (like-service and mobile app)
2. Open http://localhost:3000 in your browser
3. Click the "Send Like via gRPC" button
4. See the response with randomly generated IDs
5. Watch the counter increment

### Testing via Browser

The Server Action can only be called from the browser UI (not via cURL), which is a security feature of Next.js Server Actions. Simply:

1. Open http://localhost:3000
2. Click the like button multiple times
3. Watch the responses in the UI

## Dependencies

### Runtime

- `next`: ~15.2.4 - Next.js framework
- `react`: 19.0.0 - React library
- `react-dom`: 19.0.0 - React DOM
- `@grpc/grpc-js`: ^1.9.0 - gRPC implementation for Node.js
- `@grpc/proto-loader`: ^0.7.10 - Proto file loader

### Dev Dependencies

- Tailwind CSS - For styling
- TypeScript - For type safety
- ESLint - For code linting
- Jest - For testing

## Development

### Build

```bash
nx build mobile
```

### Development Server

```bash
nx dev mobile
```

### Linting

```bash
nx lint mobile
```

### Testing

```bash
nx test mobile
```

## Configuration

### gRPC Service Connection

The Server Action connects to the like-service at:

- **Host**: `localhost`
- **Port**: `50052`
- **Protocol**: gRPC (HTTP/2)

To change the connection settings, edit `src/app/actions.ts`:

```typescript
const client = new PostLikeService(
  'localhost:50052', // Change host:port here
  grpc.credentials.createInsecure()
);
```

### Random ID Generation

Current range: 0-999 for both post and user IDs.

To modify, edit in `src/app/actions.ts`:

```typescript
const postId = `post-${Math.floor(Math.random() * 1000)}`; // Change 1000
const userId = `user-${Math.floor(Math.random() * 1000)}`; // Change 1000
```

## Styling

The app uses Tailwind CSS with:

- Gradient backgrounds
- Smooth animations and transitions
- Responsive design
- Modern card-based layout
- Custom hover effects

## Troubleshooting

### "Failed to connect to like service"

**Solution**: Make sure like-service is running:

```bash
node apps/like-service/dist/main.js
```

### "Cannot find proto file"

**Solution**: The proto path in the Server Action is relative to the app directory. Make sure:

```typescript
const PROTO_PATH = join(process.cwd(), '../../libs/grpc-types/src/proto/post-like.proto');
```

### Port 3000 already in use

**Solution**: Kill the process or use a different port:

```bash
lsof -ti :3000 | xargs kill -9
# or
PORT=3001 nx dev mobile
```

## Future Enhancements

- [ ] Add authentication and real user IDs
- [ ] Display recent likes from service
- [ ] Add unlike functionality
- [ ] Show like counts per post
- [ ] Add post feed
- [ ] Real-time updates with WebSockets
- [ ] Error handling and retry logic
- [ ] Loading states and animations
- [ ] Responsive design for mobile devices
- [ ] Integration tests

## Related Services

- **like-service** (port 50052): gRPC service handling like operations
- **@io/grpc-types**: Shared proto definitions library

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **API**: Next.js API Routes (Server-side)
- **Communication**: gRPC via @grpc/grpc-js
- **Styling**: Tailwind CSS with custom gradients
- **Build Tool**: Nx

---

Built with ❤️ using Next.js and gRPC

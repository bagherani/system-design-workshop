# Mobile App Architecture - Server Actions with gRPC

## Overview

This mobile app demonstrates a modern approach to integrating gRPC services with Next.js using **Server Actions** instead of traditional API routes.

## Architecture Comparison

### ❌ Old Approach (API Routes)

```
Client Component → API Route (/api/like) → gRPC Client → like-service
     (page.tsx)        (route.ts)           (@grpc/grpc-js)   (port 50052)
```

**Downsides:**
- Extra file (`api/like/route.ts`)
- Extra HTTP hop
- More boilerplate code
- Separate file to maintain

### ✅ New Approach (Server Actions)

```
Client Component → Server Action → gRPC Client → like-service
     (page.tsx)      (actions.ts)    (@grpc/grpc-js)   (port 50052)
```

**Benefits:**
- ✅ Cleaner architecture
- ✅ Direct function calls from client
- ✅ Type-safe by default
- ✅ Less boilerplate
- ✅ One less file to maintain
- ✅ Better DX (Developer Experience)

## Implementation Details

### Server Action (`actions.ts`)

```typescript
'use server';

export async function sendLike() {
  // gRPC client code runs on server
  // Called directly from client component
  // No API route needed!
}
```

Key Points:
- `'use server'` directive marks this as server-side code
- Executed on the server, not in the browser
- Can be imported and called like regular functions
- Automatically serializes responses for the client

### Client Component (`page.tsx`)

```typescript
'use client';
import { sendLike } from './actions';

export default function Index() {
  const handleLike = async () => {
    const data = await sendLike(); // Direct call!
    // Handle response
  };
}
```

Key Points:
- Imports Server Action as a regular function
- Calls it like any async function
- No fetch() or HTTP request code needed
- Type-safe communication

## Why This Is Better

### 1. Simplified Code Structure

**Before:**
```
src/app/
├── api/
│   └── like/
│       └── route.ts    ← Extra API route file
├── page.tsx
└── actions.ts
```

**After:**
```
src/app/
├── actions.ts          ← Single file for server-side logic
└── page.tsx
```

### 2. Better Type Safety

Server Actions maintain TypeScript types across the server-client boundary automatically.

### 3. Cleaner Client Code

**Before (with API route):**
```typescript
const response = await fetch('/api/like', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
});
const data = await response.json();
```

**After (with Server Action):**
```typescript
const data = await sendLike();
```

### 4. No HTTP Overhead

Server Actions use Next.js's optimized RPC mechanism instead of traditional HTTP endpoints.

## When to Use Server Actions vs API Routes

### Use Server Actions When:
- ✅ Calling from React components
- ✅ Need type safety
- ✅ Simple request/response patterns
- ✅ Internal application logic

### Use API Routes When:
- ✅ Need RESTful endpoints
- ✅ External clients (mobile apps, third-party)
- ✅ Webhooks
- ✅ Public APIs

## Security Considerations

Server Actions are secure by default:
- Only callable from your Next.js app (CSRF protection built-in)
- Cannot be called via cURL or external clients
- Automatically handle POST requests
- Validate origin headers

## Performance

Server Actions:
- Use Next.js's optimized streaming
- Automatic code splitting
- Better caching strategies
- Reduced network overhead

## Best Practices

1. **Keep Server Actions focused**: One action per operation
2. **Use TypeScript**: Get full type safety
3. **Handle errors properly**: Use try-catch in actions
4. **Validate input**: Even though it's server-side
5. **Keep actions pure**: Avoid side effects where possible

## Code Organization

```
src/app/
├── actions.ts           # All Server Actions
│   ├── sendLike()
│   └── [other actions]
├── page.tsx             # Client UI
├── layout.tsx           # Layout
└── components/          # Reusable components
```

## Summary

By using Server Actions instead of API routes, we've:
- ✅ Reduced code complexity
- ✅ Improved type safety
- ✅ Simplified the architecture
- ✅ Maintained all functionality
- ✅ Improved developer experience

This is the **recommended approach** for Next.js 13+ applications when calling server-side code from client components.


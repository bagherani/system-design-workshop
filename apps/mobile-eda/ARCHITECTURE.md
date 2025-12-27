# Mobile EDA Architecture - Server Actions + Kafka (Event-Driven)

## Overview

This app demonstrates publishing domain events from a Next.js UI using **Server Actions** and Kafka.

## Flow

```
Client Component → Server Action → Kafka Producer → Topic: post_liked
    (page.tsx)       (actions.ts)   (@io/messaging-util)
```

## Why Server Actions?

- Keeps KafkaJS / TCP connections strictly on the server (never in the browser)
- No API routes needed for this simple “button → event” workflow
- Direct, type-safe-ish call pattern from the client component

## Event Contract

- **Topic**: `post_liked`
- **Key**: `postId`
- **Payload**:
  - `postId`
  - `userId`
  - `likedAt` (ISO string)

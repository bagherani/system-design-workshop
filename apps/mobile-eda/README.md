# Mobile EDA - Next.js with Kafka (Event-Driven)

A Next.js “mobile” demo app that publishes a **`post_liked`** event to Kafka using a Next.js **Server Action** and the workspace lib **`@io/messaging-util`**.

## What happens on “Like”

- Generates random `postId` and `userId`
- Publishes to Kafka topic **`post_liked`**
- Message key: `postId`
- Payload: `{ postId, userId, likedAt }`

## Architecture

```
┌─────────────┐    Server Action      ┌──────────────────┐      Kafka      ┌──────────────┐
│   Browser   │ ─────────────────────>│  Next.js Server  │ ───────────────>│   Brokers    │
│  (React UI) │     sendLike()        │  Action          │   post_liked    │ (9092/3/4)   │
└─────────────┘ <─────────────────────└──────────────────┘ <────────────── └──────────────┘
                     Response
```

## Prerequisites

- Kafka running at `localhost:9092`, `localhost:9093`, `localhost:9094` (matches `libs/messaging-util`)
- Topic `post_liked` created (or broker auto-topic-creation enabled)

## Run

```bash
nx build messaging-util
nx dev mobile-eda
```

App: `http://localhost:3000`

## Useful commands

```bash
nx build mobile-eda
nx start mobile-eda
nx lint mobile-eda
nx test mobile-eda
```

# Messaging Util - Usage Examples

## Importing

```typescript
import { sendMessage, sendMessageBatch, createConsumer, createTopic, disconnectProducer, disconnectConsumer } from '@io/messaging-util';
```

---

## Producer Example

### Send a Single Message

```typescript
// Send vehicle location event
await sendMessage(
  'vehicle-location',
  {
    vehicleId: '1001',
    routeId: '5',
    latitude: 40.7128,
    longitude: -74.006,
    timestamp: Date.now(),
  },
  '1001' // Optional key for partitioning
);
```

### Send Multiple Messages in Batch

```typescript
await sendMessageBatch('vehicle-location', [
  {
    value: {
      vehicleId: '1001',
      latitude: 40.7128,
      longitude: -74.006,
    },
    key: '1001',
  },
  {
    value: {
      vehicleId: '1002',
      latitude: 40.758,
      longitude: -73.9855,
    },
    key: '1002',
  },
]);
```

---

## Consumer Example

### Basic Consumer

```typescript
const consumer = await createConsumer(
  'vehicle-tracker-group', // Consumer group ID
  ['vehicle-location'], // Topics to subscribe to
  async (message) => {
    console.log('Received:', message.value);
    console.log('Topic:', message.topic);
    console.log('Partition:', message.partition);
    console.log('Key:', message.key);
    console.log('Offset:', message.offset);

    // Process the message
    const location = message.value;
    // ... your processing logic
  }
);

// Later, disconnect when shutting down
await disconnectConsumer(consumer);
```

---

## Topic Management

### Create a Topic Programmatically

```typescript
await createTopic(
  'vehicle-location',
  3, // Number of partitions
  1 // Replication factor
);
```

---

## Complete Producer App Example

```typescript
import { sendMessage, disconnectProducer } from '@io/messaging-util';

async function main() {
  // Send events
  await sendMessage('vehicle-location', {
    vehicleId: '1001',
    latitude: 40.7128,
    longitude: -74.006,
  });

  console.log('Message sent!');
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectProducer();
  process.exit(0);
});

main();
```

---

## Complete Consumer App Example

```typescript
import { createConsumer, disconnectConsumer } from '@io/messaging-util';

let consumer;

async function main() {
  consumer = await createConsumer('my-service', ['vehicle-location'], async (message) => {
    console.log('Processing:', message.value);
    // Your business logic here
  });

  console.log('Consumer running...');
}

// Graceful shutdown
process.on('SIGINT', async () => {
  if (consumer) {
    await disconnectConsumer(consumer);
  }
  process.exit(0);
});

main();
```

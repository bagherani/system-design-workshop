import { Kafka, Producer, Consumer, logLevel } from 'kafkajs';

// Create Kafka client instance
export const kafka = new Kafka({
  clientId: 'io-app',
  brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
  logLevel: logLevel.ERROR,
});

// Create admin client for topic management
export const kafkaAdmin = kafka.admin();

// Shared producer instance
let producerInstance: Producer | null = null;

/**
 * Get or create a Kafka producer
 */
export async function getProducer(): Promise<Producer> {
  if (!producerInstance) {
    producerInstance = kafka.producer();
    await producerInstance.connect();
    console.log('✅ Kafka producer connected');
  }
  return producerInstance;
}

/**
 * Send a message to a Kafka topic
 * @param topic - The topic to send to
 * @param message - The message payload (will be JSON stringified)
 * @param key - Optional message key for partitioning
 */
export async function sendMessage(
  topic: string,
  message: Record<string, unknown>,
  key?: string
): Promise<void> {
  const producer = await getProducer();

  await producer.send({
    topic,
    messages: [
      {
        key: key,
        value: JSON.stringify(message),
        timestamp: Date.now().toString(),
      },
    ],
  });
}

/**
 * Send multiple messages to a Kafka topic in batch
 * @param topic - The topic to send to
 * @param messages - Array of messages (will be JSON stringified)
 */
export async function sendMessageBatch(
  topic: string,
  messages: Array<{ value: Record<string, unknown>; key?: string }>
): Promise<void> {
  const producer = await getProducer();

  await producer.send({
    topic,
    messages: messages.map((msg) => ({
      key: msg.key,
      value: JSON.stringify(msg.value),
      timestamp: Date.now().toString(),
    })),
  });
}

/**
 * Create a Kafka consumer
 * @param groupId - The consumer group ID
 * @param topics - Array of topics to subscribe to
 * @param handler - Message handler function
 */
export async function createConsumer(
  groupId: string,
  topics: string[],
  handler: (message: {
    topic: string;
    partition: number;
    key: string | null;
    value: Record<string, unknown>;
    offset: string;
  }) => Promise<void>
): Promise<Consumer> {
  const consumer = kafka.consumer({ groupId });

  await consumer.connect();
  console.log(`✅ Kafka consumer connected (group: ${groupId})`);

  // Subscribe to topics
  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
    console.log(`📫 Subscribed to topic: ${topic}`);
  }

  // Run consumer
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const value = message.value
          ? JSON.parse(message.value.toString())
          : null;

        await handler({
          topic,
          partition,
          key: message.key ? message.key.toString() : null,
          value,
          offset: message.offset,
        });
      } catch (error) {
        console.error('Error processing message:', error);
        throw error;
      }
    },
  });

  return consumer;
}

/**
 * Create a topic if it doesn't exist
 * @param topic - Topic name
 * @param numPartitions - Number of partitions (default: 3)
 * @param replicationFactor - Replication factor (default: 1)
 */
export async function createTopic(
  topic: string,
  numPartitions = 3,
  replicationFactor = 1
): Promise<void> {
  await kafkaAdmin.connect();

  const topics = await kafkaAdmin.listTopics();

  if (!topics.includes(topic)) {
    await kafkaAdmin.createTopics({
      topics: [
        {
          topic,
          numPartitions,
          replicationFactor,
        },
      ],
    });
    console.log(`✅ Topic created: ${topic}`);
  } else {
    console.log(`ℹ️  Topic already exists: ${topic}`);
  }

  await kafkaAdmin.disconnect();
}

/**
 * Disconnect producer
 */
export async function disconnectProducer(): Promise<void> {
  if (producerInstance) {
    await producerInstance.disconnect();
    producerInstance = null;
    console.log('✅ Kafka producer disconnected');
  }
}

/**
 * Disconnect consumer
 */
export async function disconnectConsumer(consumer: Consumer): Promise<void> {
  await consumer.disconnect();
  console.log('✅ Kafka consumer disconnected');
}

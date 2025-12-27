import { Kafka, Producer, Consumer } from 'kafkajs';
export declare const kafka: Kafka;
export declare const kafkaAdmin: import("kafkajs").Admin;
/**
 * Get or create a Kafka producer
 */
export declare function getProducer(): Promise<Producer>;
/**
 * Send a message to a Kafka topic
 * @param topic - The topic to send to
 * @param message - The message payload (will be JSON stringified)
 * @param key - Optional message key for partitioning
 */
export declare function sendMessage(topic: string, message: Record<string, unknown>, key?: string): Promise<void>;
/**
 * Send multiple messages to a Kafka topic in batch
 * @param topic - The topic to send to
 * @param messages - Array of messages (will be JSON stringified)
 */
export declare function sendMessageBatch(topic: string, messages: Array<{
    value: Record<string, unknown>;
    key?: string;
}>): Promise<void>;
/**
 * Create a Kafka consumer
 * @param groupId - The consumer group ID
 * @param topics - Array of topics to subscribe to
 * @param handler - Message handler function
 */
export declare function createConsumer(groupId: string, topics: string[], handler: (message: {
    topic: string;
    partition: number;
    key: string | null;
    value: Record<string, unknown> | null;
    offset: string;
}) => Promise<void>): Promise<Consumer>;
/**
 * Create a topic if it doesn't exist
 * @param topic - Topic name
 * @param numPartitions - Number of partitions (default: 3)
 * @param replicationFactor - Replication factor (default: 1)
 */
export declare function createTopic(topic: string, numPartitions?: number, replicationFactor?: number): Promise<void>;
/**
 * Disconnect producer
 */
export declare function disconnectProducer(): Promise<void>;
/**
 * Disconnect consumer
 */
export declare function disconnectConsumer(consumer: Consumer): Promise<void>;
//# sourceMappingURL=messaging-util.d.ts.map
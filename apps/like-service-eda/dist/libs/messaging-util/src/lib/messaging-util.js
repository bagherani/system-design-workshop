"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var messaging_util_exports = {};
__export(messaging_util_exports, {
  createConsumer: () => createConsumer,
  createTopic: () => createTopic,
  disconnectConsumer: () => disconnectConsumer,
  disconnectProducer: () => disconnectProducer,
  getProducer: () => getProducer,
  kafka: () => kafka,
  kafkaAdmin: () => kafkaAdmin,
  sendMessage: () => sendMessage,
  sendMessageBatch: () => sendMessageBatch
});
module.exports = __toCommonJS(messaging_util_exports);
var import_kafkajs = require("kafkajs");
const kafka = new import_kafkajs.Kafka({
  clientId: "io-app",
  brokers: ["localhost:9092", "localhost:9093", "localhost:9094"],
  logLevel: import_kafkajs.logLevel.ERROR
});
const kafkaAdmin = kafka.admin();
let producerInstance = null;
async function getProducer() {
  if (!producerInstance) {
    producerInstance = kafka.producer();
    await producerInstance.connect();
    console.log("\u2705 Kafka producer connected");
  }
  return producerInstance;
}
async function sendMessage(topic, message, key) {
  const producer = await getProducer();
  await producer.send({
    topic,
    messages: [
      {
        key,
        value: JSON.stringify(message),
        timestamp: Date.now().toString()
      }
    ]
  });
}
async function sendMessageBatch(topic, messages) {
  const producer = await getProducer();
  await producer.send({
    topic,
    messages: messages.map((msg) => ({
      key: msg.key,
      value: JSON.stringify(msg.value),
      timestamp: Date.now().toString()
    }))
  });
}
async function createConsumer(groupId, topics, handler) {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  console.log(`\u2705 Kafka consumer connected (group: ${groupId})`);
  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
    console.log(`\u{1F4EB} Subscribed to topic: ${topic}`);
  }
  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const value = message.value ? JSON.parse(message.value.toString()) : null;
        await handler({
          topic,
          partition,
          key: message.key ? message.key.toString() : null,
          value,
          offset: message.offset
        });
      } catch (error) {
        console.error("Error processing message:", error);
        throw error;
      }
    }
  });
  return consumer;
}
async function createTopic(topic, numPartitions = 3, replicationFactor = 1) {
  await kafkaAdmin.connect();
  const topics = await kafkaAdmin.listTopics();
  if (!topics.includes(topic)) {
    await kafkaAdmin.createTopics({
      topics: [
        {
          topic,
          numPartitions,
          replicationFactor
        }
      ]
    });
    console.log(`\u2705 Topic created: ${topic}`);
  } else {
    console.log(`\u2139\uFE0F  Topic already exists: ${topic}`);
  }
  await kafkaAdmin.disconnect();
}
async function disconnectProducer() {
  if (producerInstance) {
    await producerInstance.disconnect();
    producerInstance = null;
    console.log("\u2705 Kafka producer disconnected");
  }
}
async function disconnectConsumer(consumer) {
  await consumer.disconnect();
  console.log("\u2705 Kafka consumer disconnected");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createConsumer,
  createTopic,
  disconnectConsumer,
  disconnectProducer,
  getProducer,
  kafka,
  kafkaAdmin,
  sendMessage,
  sendMessageBatch
});

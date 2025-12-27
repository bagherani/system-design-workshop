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
var src_exports = {};
__export(src_exports, {
  createConsumer: () => import_messaging_util.createConsumer,
  createTopic: () => import_messaging_util.createTopic,
  disconnectConsumer: () => import_messaging_util.disconnectConsumer,
  disconnectProducer: () => import_messaging_util.disconnectProducer,
  getProducer: () => import_messaging_util.getProducer,
  kafka: () => import_messaging_util.kafka,
  kafkaAdmin: () => import_messaging_util.kafkaAdmin,
  sendMessage: () => import_messaging_util.sendMessage,
  sendMessageBatch: () => import_messaging_util.sendMessageBatch
});
module.exports = __toCommonJS(src_exports);
var import_messaging_util = require("./lib/messaging-util.js");
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

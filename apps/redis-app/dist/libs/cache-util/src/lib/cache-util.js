"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var cache_util_exports = {};
__export(cache_util_exports, {
  closeRedisCluster: () => closeRedisCluster,
  redisCluster: () => redisCluster
});
module.exports = __toCommonJS(cache_util_exports);
var import_ioredis = __toESM(require("ioredis"), 1);
const redisCluster = new import_ioredis.default.Cluster(
  [
    { host: "localhost", port: 6379 },
    { host: "localhost", port: 6380 },
    { host: "localhost", port: 6381 }
  ],
  {
    redisOptions: {
      connectTimeout: 1e4
    },
    clusterRetryStrategy: (times) => {
      const delay = Math.min(100 + times * 2, 2e3);
      return delay;
    },
    // Map internal Docker IPs to localhost
    natMap: {
      "172.18.0.2:6379": { host: "localhost", port: 6379 },
      "172.18.0.3:6380": { host: "localhost", port: 6380 },
      "172.18.0.4:6381": { host: "localhost", port: 6381 }
    }
  }
);
redisCluster.on("connect", () => {
  console.log("\u2705 Redis Cluster connected");
});
redisCluster.on("ready", () => {
  console.log("\u2705 Redis Cluster ready");
});
redisCluster.on("error", (err) => {
  console.error("\u274C Redis Cluster Error:", err.message);
});
redisCluster.on("close", () => {
  console.log("\u{1F50C} Redis Cluster connection closed");
});
async function closeRedisCluster() {
  try {
    await redisCluster.quit();
    console.log("\u2705 Redis cluster connection closed gracefully");
  } catch (error) {
    console.error("\u26A0\uFE0F Error closing Redis connection:", error);
    redisCluster.disconnect();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  closeRedisCluster,
  redisCluster
});

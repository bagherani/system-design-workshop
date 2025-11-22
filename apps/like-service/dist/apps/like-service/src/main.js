"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var grpc = __toESM(require("@grpc/grpc-js"));
var protoLoader = __toESM(require("@grpc/proto-loader"));
var import_path = require("path");
var import_devkit = require("@nx/devkit");
const packageDef = protoLoader.loadSync(
  (0, import_path.join)(import_devkit.workspaceRoot, "libs/grpc-types/src/proto", "post-like.proto")
);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const postLikePackage = grpcObject.post_like;
const PostLikeService = postLikePackage.PostLikeService;
const server = new grpc.Server();
const postLikesStore = /* @__PURE__ */ new Map();
server.addService(PostLikeService.service, {
  LikePost: (call, callback) => {
    const request = call.request;
    if (!request.postId || !request.userId) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: "Post ID and User ID are required"
      });
      return;
    }
    const { postId, userId } = request;
    if (!postLikesStore.has(postId)) {
      postLikesStore.set(postId, /* @__PURE__ */ new Set());
    }
    const likesSet = postLikesStore.get(postId);
    if (!likesSet) {
      callback({
        code: grpc.status.INTERNAL,
        message: "Failed to retrieve likes for post"
      });
      return;
    }
    if (likesSet.has(userId)) {
      console.log(`User ${userId} already liked post ${postId}`);
      callback(null, { success: true });
      return;
    }
    likesSet.add(userId);
    console.log(`User ${userId} liked post ${postId}`);
    console.log(`  Total likes for post: ${likesSet.size}`);
    console.log(`  Total posts with likes: ${postLikesStore.size}`);
    callback(null, { success: true });
  }
});
server.bindAsync(
  "0.0.0.0:50052",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error("Failed to start gRPC server:", error);
      return;
    }
    console.log(`Post Like Service running on port ${port}`);
    console.log("Ready to receive like requests...");
  }
);
process.on("SIGINT", () => {
  console.log("\nShutting down Post Like Service...");
  server.tryShutdown(() => {
    console.log("Server shut down gracefully");
    process.exit(0);
  });
});

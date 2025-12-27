"use strict";
var import_messaging_util = require("@io/messaging-util");
const postLikesStore = /* @__PURE__ */ new Map();
function isPostLikedEvent(value) {
  if (!value || typeof value !== "object") return false;
  const v = value;
  return typeof v.postId === "string" && typeof v.userId === "string";
}
let consumer = null;
async function start() {
  console.log("\u{1F680} like-service-eda starting (Kafka consumer)...");
  console.log("  Topic: post_liked");
  console.log("  Group: like-service-eda");
  consumer = await (0, import_messaging_util.createConsumer)(
    "like-service-eda",
    ["post_liked"],
    async ({ topic, partition, key, value, offset }) => {
      if (!isPostLikedEvent(value)) {
        console.warn("\u26A0\uFE0F  Ignoring invalid post_liked message", {
          topic,
          partition,
          key,
          offset,
          value
        });
        return;
      }
      const { postId, userId, likedAt } = value;
      if (!postLikesStore.has(postId)) {
        postLikesStore.set(postId, /* @__PURE__ */ new Set());
      }
      const likesSet = postLikesStore.get(postId);
      if (!likesSet) return;
      const alreadyLiked = likesSet.has(userId);
      if (!alreadyLiked) likesSet.add(userId);
      console.log(
        `\u2764\uFE0F  Consumed post_liked: postId=${postId} userId=${userId}${likedAt ? ` likedAt=${likedAt}` : ""}`
      );
      console.log(
        `  Idempotent: ${alreadyLiked ? "already-liked" : "new-like"}`
      );
      console.log(`  Total likes for post: ${likesSet.size}`);
      console.log(`  Total posts with likes: ${postLikesStore.size}`);
    }
  );
  console.log("\u2705 like-service-eda is consuming...");
}
async function shutdown(signal) {
  console.log(`
Shutting down like-service-eda (${signal})...`);
  try {
    if (consumer) await (0, import_messaging_util.disconnectConsumer)(consumer);
  } catch (error) {
    console.error("Error during shutdown:", error);
  } finally {
    process.exit(0);
  }
}
process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
start().catch((error) => {
  console.error("Failed to start like-service-eda:", error);
  process.exit(1);
});

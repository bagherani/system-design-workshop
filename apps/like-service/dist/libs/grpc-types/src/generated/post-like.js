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
var post_like_exports = {};
__export(post_like_exports, {
  LikePostReply: () => LikePostReply,
  LikePostRequest: () => LikePostRequest,
  PostLikeServiceClientImpl: () => PostLikeServiceClientImpl,
  PostLikeServiceServiceName: () => PostLikeServiceServiceName,
  protobufPackage: () => protobufPackage
});
module.exports = __toCommonJS(post_like_exports);
var import_wire = require("@bufbuild/protobuf/wire");
const protobufPackage = "post_like";
function createBaseLikePostRequest() {
  return { postId: "", userId: "" };
}
const LikePostRequest = {
  encode(message, writer = new import_wire.BinaryWriter()) {
    if (message.postId !== "") {
      writer.uint32(10).string(message.postId);
    }
    if (message.userId !== "") {
      writer.uint32(18).string(message.userId);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_wire.BinaryReader ? input : new import_wire.BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseLikePostRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.postId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }
          message.userId = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      postId: isSet(object.postId) ? globalThis.String(object.postId) : "",
      userId: isSet(object.userId) ? globalThis.String(object.userId) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.postId !== "") {
      obj.postId = message.postId;
    }
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    return obj;
  },
  create(base) {
    return LikePostRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseLikePostRequest();
    message.postId = object.postId ?? "";
    message.userId = object.userId ?? "";
    return message;
  }
};
function createBaseLikePostReply() {
  return { success: false };
}
const LikePostReply = {
  encode(message, writer = new import_wire.BinaryWriter()) {
    if (message.success !== false) {
      writer.uint32(8).bool(message.success);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_wire.BinaryReader ? input : new import_wire.BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseLikePostReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }
          message.success = reader.bool();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { success: isSet(object.success) ? globalThis.Boolean(object.success) : false };
  },
  toJSON(message) {
    const obj = {};
    if (message.success !== false) {
      obj.success = message.success;
    }
    return obj;
  },
  create(base) {
    return LikePostReply.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseLikePostReply();
    message.success = object.success ?? false;
    return message;
  }
};
const PostLikeServiceServiceName = "post_like.PostLikeService";
class PostLikeServiceClientImpl {
  rpc;
  service;
  constructor(rpc, opts) {
    this.service = opts?.service || PostLikeServiceServiceName;
    this.rpc = rpc;
    this.LikePost = this.LikePost.bind(this);
  }
  LikePost(request) {
    const data = LikePostRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "LikePost", data);
    return promise.then((data2) => LikePostReply.decode(new import_wire.BinaryReader(data2)));
  }
}
function isSet(value) {
  return value !== null && value !== void 0;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LikePostReply,
  LikePostRequest,
  PostLikeServiceClientImpl,
  PostLikeServiceServiceName,
  protobufPackage
});

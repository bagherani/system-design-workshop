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
var nearby_stops_exports = {};
__export(nearby_stops_exports, {
  NearbyStopsReply: () => NearbyStopsReply,
  NearbyStopsRequest: () => NearbyStopsRequest,
  NearbyStopsServiceClientImpl: () => NearbyStopsServiceClientImpl,
  NearbyStopsServiceServiceName: () => NearbyStopsServiceServiceName,
  protobufPackage: () => protobufPackage
});
module.exports = __toCommonJS(nearby_stops_exports);
var import_wire = require("@bufbuild/protobuf/wire");
const protobufPackage = "nearby_stops";
function createBaseNearbyStopsRequest() {
  return {};
}
const NearbyStopsRequest = {
  encode(_, writer = new import_wire.BinaryWriter()) {
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_wire.BinaryReader ? input : new import_wire.BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseNearbyStopsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(_) {
    return {};
  },
  toJSON(_) {
    const obj = {};
    return obj;
  },
  create(base) {
    return NearbyStopsRequest.fromPartial(base ?? {});
  },
  fromPartial(_) {
    const message = createBaseNearbyStopsRequest();
    return message;
  }
};
function createBaseNearbyStopsReply() {
  return {};
}
const NearbyStopsReply = {
  encode(_, writer = new import_wire.BinaryWriter()) {
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_wire.BinaryReader ? input : new import_wire.BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseNearbyStopsReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(_) {
    return {};
  },
  toJSON(_) {
    const obj = {};
    return obj;
  },
  create(base) {
    return NearbyStopsReply.fromPartial(base ?? {});
  },
  fromPartial(_) {
    const message = createBaseNearbyStopsReply();
    return message;
  }
};
const NearbyStopsServiceServiceName = "nearby_stops.NearbyStopsService";
class NearbyStopsServiceClientImpl {
  rpc;
  service;
  constructor(rpc, opts) {
    this.service = opts?.service || NearbyStopsServiceServiceName;
    this.rpc = rpc;
    this.GetNearbyStops = this.GetNearbyStops.bind(this);
  }
  GetNearbyStops(request) {
    const data = NearbyStopsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetNearbyStops", data);
    return promise.then(
      (data2) => NearbyStopsReply.decode(new import_wire.BinaryReader(data2))
    );
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NearbyStopsReply,
  NearbyStopsRequest,
  NearbyStopsServiceClientImpl,
  NearbyStopsServiceServiceName,
  protobufPackage
});

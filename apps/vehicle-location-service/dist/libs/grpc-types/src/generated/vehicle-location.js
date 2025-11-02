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
var vehicle_location_exports = {};
__export(vehicle_location_exports, {
  VehicleLocation: () => VehicleLocation,
  VehicleLocationReply: () => VehicleLocationReply,
  VehicleLocationRequest: () => VehicleLocationRequest,
  VehicleLocationServiceClientImpl: () => VehicleLocationServiceClientImpl,
  VehicleLocationServiceServiceName: () => VehicleLocationServiceServiceName,
  protobufPackage: () => protobufPackage
});
module.exports = __toCommonJS(vehicle_location_exports);
var import_wire = require("@bufbuild/protobuf/wire");
const protobufPackage = "vehicle_location";
function createBaseVehicleLocationRequest() {
  return { vehicleLocations: void 0 };
}
const VehicleLocationRequest = {
  encode(message, writer = new import_wire.BinaryWriter()) {
    if (message.vehicleLocations !== void 0) {
      VehicleLocation.encode(message.vehicleLocations, writer.uint32(10).fork()).join();
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_wire.BinaryReader ? input : new import_wire.BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseVehicleLocationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.vehicleLocations = VehicleLocation.decode(reader, reader.uint32());
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
      vehicleLocations: isSet(object.vehicleLocations) ? VehicleLocation.fromJSON(object.vehicleLocations) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.vehicleLocations !== void 0) {
      obj.vehicleLocations = VehicleLocation.toJSON(message.vehicleLocations);
    }
    return obj;
  },
  create(base) {
    return VehicleLocationRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseVehicleLocationRequest();
    message.vehicleLocations = object.vehicleLocations !== void 0 && object.vehicleLocations !== null ? VehicleLocation.fromPartial(object.vehicleLocations) : void 0;
    return message;
  }
};
function createBaseVehicleLocationReply() {
  return { status: 0 };
}
const VehicleLocationReply = {
  encode(message, writer = new import_wire.BinaryWriter()) {
    if (message.status !== 0) {
      writer.uint32(8).int32(message.status);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_wire.BinaryReader ? input : new import_wire.BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseVehicleLocationReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }
          message.status = reader.int32();
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
    return { status: isSet(object.status) ? globalThis.Number(object.status) : 0 };
  },
  toJSON(message) {
    const obj = {};
    if (message.status !== 0) {
      obj.status = Math.round(message.status);
    }
    return obj;
  },
  create(base) {
    return VehicleLocationReply.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseVehicleLocationReply();
    message.status = object.status ?? 0;
    return message;
  }
};
function createBaseVehicleLocation() {
  return { vehicleId: "", routeId: "", latitude: "", longitude: "" };
}
const VehicleLocation = {
  encode(message, writer = new import_wire.BinaryWriter()) {
    if (message.vehicleId !== "") {
      writer.uint32(10).string(message.vehicleId);
    }
    if (message.routeId !== "") {
      writer.uint32(18).string(message.routeId);
    }
    if (message.latitude !== "") {
      writer.uint32(26).string(message.latitude);
    }
    if (message.longitude !== "") {
      writer.uint32(34).string(message.longitude);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_wire.BinaryReader ? input : new import_wire.BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseVehicleLocation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.vehicleId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }
          message.routeId = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }
          message.latitude = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }
          message.longitude = reader.string();
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
      vehicleId: isSet(object.vehicleId) ? globalThis.String(object.vehicleId) : "",
      routeId: isSet(object.routeId) ? globalThis.String(object.routeId) : "",
      latitude: isSet(object.latitude) ? globalThis.String(object.latitude) : "",
      longitude: isSet(object.longitude) ? globalThis.String(object.longitude) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.vehicleId !== "") {
      obj.vehicleId = message.vehicleId;
    }
    if (message.routeId !== "") {
      obj.routeId = message.routeId;
    }
    if (message.latitude !== "") {
      obj.latitude = message.latitude;
    }
    if (message.longitude !== "") {
      obj.longitude = message.longitude;
    }
    return obj;
  },
  create(base) {
    return VehicleLocation.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseVehicleLocation();
    message.vehicleId = object.vehicleId ?? "";
    message.routeId = object.routeId ?? "";
    message.latitude = object.latitude ?? "";
    message.longitude = object.longitude ?? "";
    return message;
  }
};
const VehicleLocationServiceServiceName = "vehicle_location.VehicleLocationService";
class VehicleLocationServiceClientImpl {
  rpc;
  service;
  constructor(rpc, opts) {
    this.service = opts?.service || VehicleLocationServiceServiceName;
    this.rpc = rpc;
    this.SendVehicleLocation = this.SendVehicleLocation.bind(this);
  }
  SendVehicleLocation(request) {
    const data = VehicleLocationRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "SendVehicleLocation", data);
    return promise.then((data2) => VehicleLocationReply.decode(new import_wire.BinaryReader(data2)));
  }
}
function isSet(value) {
  return value !== null && value !== void 0;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VehicleLocation,
  VehicleLocationReply,
  VehicleLocationRequest,
  VehicleLocationServiceClientImpl,
  VehicleLocationServiceServiceName,
  protobufPackage
});
//# sourceMappingURL=vehicle-location.js.map

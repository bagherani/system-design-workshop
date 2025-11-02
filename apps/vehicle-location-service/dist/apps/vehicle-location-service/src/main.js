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
  (0, import_path.join)(import_devkit.workspaceRoot, "libs/grpc-types/src/proto", "vehicle-location.proto")
);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const vehicleLocationPackage = grpcObject.vehicle_location;
const VehicleLocationService = vehicleLocationPackage.VehicleLocationService;
const server = new grpc.Server();
const vehicleLocationStore = /* @__PURE__ */ new Map();
server.addService(VehicleLocationService.service, {
  SendVehicleLocation: (call, callback) => {
    const request = call.request;
    if (!request.vehicleLocations) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: "Vehicle location data is required"
      });
      return;
    }
    const vehicleLocation = request.vehicleLocations;
    if (!vehicleLocation.vehicleId || !vehicleLocation.routeId || !vehicleLocation.latitude || !vehicleLocation.longitude) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: "Vehicle ID, Route ID, latitude, and longitude are required"
      });
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    vehicleLocationStore.set(vehicleLocation.vehicleId, {
      ...vehicleLocation
    });
    console.log(
      `Updated location for vehicle ${vehicleLocation.vehicleId} on route ${vehicleLocation.routeId}:`
    );
    console.log(
      `  Position: ${vehicleLocation.latitude}, ${vehicleLocation.longitude}`
    );
    console.log(`  Timestamp: ${now}`);
    console.log(`  Total tracked vehicles: ${vehicleLocationStore.size}`);
    callback(null, { status: 200 });
  }
});
server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error("Failed to start gRPC server:", error);
      return;
    }
    console.log(`Vehicle Location Service running on port ${port}`);
    console.log("Ready to receive vehicle location updates...");
  }
);
process.on("SIGINT", () => {
  console.log("\nShutting down Vehicle Location Service...");
  server.tryShutdown(() => {
    console.log("Server shut down gracefully");
    process.exit(0);
  });
});
//# sourceMappingURL=main.js.map

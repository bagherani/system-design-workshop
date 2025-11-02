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
var import_faker = require("@faker-js/faker");
var grpc = __toESM(require("@grpc/grpc-js"));
var protoLoader = __toESM(require("@grpc/proto-loader"));
var import_path = require("path");
var import_devkit = require("@nx/devkit");
const packageDef = protoLoader.loadSync(
  (0, import_path.join)(import_devkit.workspaceRoot, "libs/grpc-types/src/proto", "vehicle-location.proto")
);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const vehicleLocationPackage = grpcObject.vehicle_location;
const VehicleLocationClient = vehicleLocationPackage.VehicleLocationService;
const vehicleLocationClient = new VehicleLocationClient(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
function sendVehicleLocation(vehicle) {
  return new Promise((resolve, reject) => {
    const locationData = {
      vehicleId: vehicle.id,
      routeId: vehicle.routeId,
      latitude: vehicle.currentLocation.latitude,
      longitude: vehicle.currentLocation.longitude
    };
    const request = {
      vehicleLocations: locationData
    };
    vehicleLocationClient.SendVehicleLocation(
      request,
      (error, response) => {
        if (error) {
          console.error(
            `Error sending location for vehicle ${vehicle.id}:`,
            error
          );
          reject(error);
          return;
        }
        console.log(
          `\u2705 Location sent for vehicle ${vehicle.id} on route ${vehicle.routeId}`
        );
        resolve(response);
      }
    );
  });
}
console.log("\u{1F697} Vehicle Location Client started");
console.log("\u{1F4E1} Connected to Vehicle Location Service at localhost:50051");
console.log("\u{1F504} Auto-sending vehicle locations every 30 seconds...");
console.log("\u{1F4A1} To stop: Press Ctrl+C or send SIGTERM/SIGINT signal");
console.log("\u{1F4DD} Process PID:", process.pid);
console.log("---");
const appInterval = setInterval(async () => {
  console.log("\n\u{1F697} Auto-updating vehicle locations...");
  try {
    const vehicle = {
      id: "1",
      routeId: "1",
      currentLocation: {
        latitude: import_faker.faker.location.latitude().toString(),
        longitude: import_faker.faker.location.longitude().toString()
      }
    };
    await sendVehicleLocation(vehicle);
    console.log(
      `\u{1F4CD} Sent vehicle location for vehicle ${vehicle.id} on route ${vehicle.routeId} at ${vehicle.currentLocation.latitude}, ${vehicle.currentLocation.longitude}`
    );
  } catch (error) {
    console.error("Error in auto-update:", error);
  }
}, 3e3);
function gracefulShutdown(signal) {
  console.log(`
\u{1F6D1} Received ${signal}, shutting down Vehicle App...`);
  if (appInterval) {
    clearInterval(appInterval);
    console.log("\u2705 Interval cleared");
  }
  try {
    vehicleLocationClient.close();
    console.log("\u2705 gRPC client connection closed");
  } catch (error) {
    console.error("\u26A0\uFE0F Error closing gRPC client:", error);
  }
  console.log("\u2705 Vehicle App shutdown complete");
  process.exit(0);
}
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGUSR1", () => gracefulShutdown("SIGUSR1"));
process.on("SIGUSR2", () => gracefulShutdown("SIGUSR2"));
process.on("uncaughtException", (error) => {
  console.error("\u{1F4A5} Uncaught Exception:", error);
  if (appInterval) clearInterval(appInterval);
  vehicleLocationClient.close();
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("\u{1F4A5} Unhandled Rejection at:", promise, "reason:", reason);
  if (appInterval) clearInterval(appInterval);
  vehicleLocationClient.close();
  process.exit(1);
});
process.stdin.setEncoding("utf8");
process.stdin.on("data", (data) => {
  const input = data.toString().trim();
  if (input === "quit" || input === "exit" || input === "stop") {
    console.log("\u{1F4DD} Manual shutdown requested via stdin");
    gracefulShutdown("MANUAL");
  }
});
//# sourceMappingURL=main.js.map

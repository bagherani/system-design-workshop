import { faker } from '@faker-js/faker';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import {
  VehicleLocationRequest,
  VehicleLocationReply,
  VehicleLocation,
} from '@io/grpc-types';
import { join } from 'path';
import { workspaceRoot } from '@nx/devkit';

// Load the vehicle location proto
const packageDef = protoLoader.loadSync(
  join(workspaceRoot, 'libs/grpc-types/src/proto', 'vehicle-location.proto')
);

const grpcObject = grpc.loadPackageDefinition(packageDef);

const vehicleLocationPackage = grpcObject.vehicle_location as grpc.GrpcObject;
const VehicleLocationClient =
  vehicleLocationPackage.VehicleLocationService as grpc.ServiceClientConstructor;

// Create gRPC client to connect to vehicle-location-service
const vehicleLocationClient = new VehicleLocationClient(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

interface Vehicle {
  id: string;
  routeId: string;
  currentLocation: {
    latitude: string;
    longitude: string;
  };
}

function sendVehicleLocation(vehicle: Vehicle): Promise<VehicleLocationReply> {
  return new Promise((resolve, reject) => {
    const locationData: VehicleLocation = {
      vehicleId: vehicle.id,
      routeId: vehicle.routeId,
      latitude: vehicle.currentLocation.latitude,
      longitude: vehicle.currentLocation.longitude,
    };

    const request: VehicleLocationRequest = {
      vehicleLocations: locationData,
    };

    vehicleLocationClient.SendVehicleLocation(
      request,
      (error: grpc.ServiceError | null, response: VehicleLocationReply) => {
        if (error) {
          console.error(
            `Error sending location for vehicle ${vehicle.id}:`,
            error
          );
          reject(error);
          return;
        }

        console.log(
          `✅ Location sent for vehicle ${vehicle.id} on route ${vehicle.routeId}`
        );
        resolve(response);
      }
    );
  });
}

// Startup message
console.log('🚗 Vehicle Location Client started');
console.log('📡 Connected to Vehicle Location Service at localhost:50051');
console.log('🔄 Auto-sending vehicle locations every 30 seconds...');
console.log('💡 To stop: Press Ctrl+C or send SIGTERM/SIGINT signal');
console.log('📝 Process PID:', process.pid);
console.log('---');

const appInterval = setInterval(async () => {
  console.log('\n🚗 Auto-updating vehicle locations...');

  try {
    const vehicle = {
      id: '1',
      routeId: '1',
      currentLocation: {
        latitude: faker.location.latitude().toString(),
        longitude: faker.location.longitude().toString(),
      },
    };

    await sendVehicleLocation(vehicle);

    console.log(
      `📍 Sent vehicle location for vehicle ${vehicle.id} on route ${vehicle.routeId} at ${vehicle.currentLocation.latitude}, ${vehicle.currentLocation.longitude}`
    );
  } catch (error) {
    console.error('Error in auto-update:', error);
  }
}, 3000);

// Graceful shutdown function
function gracefulShutdown(signal: string) {
  console.log(`\n🛑 Received ${signal}, shutting down Vehicle App...`);

  // 1. Clear the interval first
  if (appInterval) {
    clearInterval(appInterval);
    console.log('✅ Interval cleared');
  }

  // 2. Close gRPC client connection gracefully
  try {
    vehicleLocationClient.close();
    console.log('✅ gRPC client connection closed');
  } catch (error) {
    console.error('⚠️ Error closing gRPC client:', error);
  }

  console.log('✅ Vehicle App shutdown complete');
  process.exit(0);
}

// Handle different termination signals
process.on('SIGINT', () => gracefulShutdown('SIGINT')); // Ctrl+C
process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); // Docker/PM2 stop
process.on('SIGUSR1', () => gracefulShutdown('SIGUSR1')); // Custom shutdown
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // Custom shutdown

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  if (appInterval) clearInterval(appInterval);
  vehicleLocationClient.close();
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  if (appInterval) clearInterval(appInterval);
  vehicleLocationClient.close();
  process.exit(1);
});

// Optional: Add a manual shutdown endpoint (useful for testing)
process.stdin.setEncoding('utf8');
process.stdin.on('data', (data) => {
  const input = data.toString().trim();
  if (input === 'quit' || input === 'exit' || input === 'stop') {
    console.log('📝 Manual shutdown requested via stdin');
    gracefulShutdown('MANUAL');
  }
});

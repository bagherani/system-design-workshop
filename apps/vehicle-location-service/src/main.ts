import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import {
  VehicleLocationRequest,
  VehicleLocationReply,
  VehicleLocation,
} from '@io/grpc-types';
import { join } from 'path';
import { workspaceRoot } from '@nx/devkit';

const packageDef = protoLoader.loadSync(
  join(workspaceRoot, 'libs/grpc-types/src/proto', 'vehicle-location.proto')
);
const grpcObject = grpc.loadPackageDefinition(packageDef);

const vehicleLocationPackage = grpcObject.vehicle_location as grpc.GrpcObject;
const VehicleLocationService =
  vehicleLocationPackage.VehicleLocationService as grpc.ServiceClientConstructor & {
    service: grpc.ServiceDefinition;
  };

const server = new grpc.Server();

// In-memory store for vehicle locations (in a real app, you'd use a database)
const vehicleLocationStore = new Map<string, VehicleLocation>();

server.addService(VehicleLocationService.service, {
  SendVehicleLocation: (
    call: grpc.ServerUnaryCall<VehicleLocationRequest, VehicleLocationReply>,
    callback: grpc.sendUnaryData<VehicleLocationReply>
  ) => {
    const request = call.request;

    if (!request.vehicleLocations) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Vehicle location data is required',
      });
      return;
    }

    const vehicleLocation = request.vehicleLocations;

    // Validate required fields
    if (
      !vehicleLocation.vehicleId ||
      !vehicleLocation.routeId ||
      !vehicleLocation.latitude ||
      !vehicleLocation.longitude
    ) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Vehicle ID, Route ID, latitude, and longitude are required',
      });
      return;
    }

    const now = new Date().toISOString();
    // Store the vehicle location
    vehicleLocationStore.set(vehicleLocation.vehicleId, {
      ...vehicleLocation,
    });

    console.log(
      `Updated location for vehicle ${vehicleLocation.vehicleId} on route ${vehicleLocation.routeId}:`
    );
    console.log(
      `  Position: ${vehicleLocation.latitude}, ${vehicleLocation.longitude}`
    );
    console.log(`  Timestamp: ${now}`);
    console.log(`  Total tracked vehicles: ${vehicleLocationStore.size}`);

    // Return success status
    callback(null, { status: 200 });
  },
});

server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error('Failed to start gRPC server:', error);
      return;
    }
    console.log(`Vehicle Location Service running on port ${port}`);
    console.log('Ready to receive vehicle location updates...');
  }
);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down Vehicle Location Service...');
  server.tryShutdown(() => {
    console.log('Server shut down gracefully');
    process.exit(0);
  });
});

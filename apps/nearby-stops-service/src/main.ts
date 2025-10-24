import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import {
  NearbyStopsRequest,
  NearbyStopsReply,
  NearbyStop,
} from '@io/grpc-types';
import { join } from 'path';
import { workspaceRoot } from '@nx/devkit';

const packageDef = protoLoader.loadSync(
  join(workspaceRoot, 'libs/grpc-types/src/proto', 'nearby-stops.proto')
);
const grpcObject = grpc.loadPackageDefinition(packageDef);

const vehicleLocationPackage = grpcObject.nearby_stops as grpc.GrpcObject;
const VehicleLocationService =
  vehicleLocationPackage.NearbyStopsService as grpc.ServiceClientConstructor & {
    service: grpc.ServiceDefinition;
  };

const server = new grpc.Server();

// TODO: GRPC - to be implemented here:
// server.addService(...);


server.bindAsync(
  '0.0.0.0:50052',
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error('Failed to start gRPC server:', error);
      return;
    }
    console.log(`Nearby Stops Service running on port ${port}`);
  }
);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down Nearby Stops Service...');
  server.tryShutdown(() => {
    console.log('Server shut down gracefully');
    process.exit(0);
  });
});

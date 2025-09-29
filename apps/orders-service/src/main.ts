import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { faker } from '@faker-js/faker';
import { GetOrdersRequest, GetOrdersReply } from '@io/grpc-types';
import { generateMockOrders } from './utils/mock-data';
import { join } from 'path';
import { workspaceRoot } from '@nx/devkit';

const packageDef = protoLoader.loadSync(
  join(workspaceRoot, 'libs/grpc-types/src/proto', 'orders.proto')
);
const grpcObject = grpc.loadPackageDefinition(packageDef);

const ordersPackage = grpcObject.orders as grpc.GrpcObject;
const orders = ordersPackage.Orders as grpc.ServiceClientConstructor & {
  service: grpc.ServiceDefinition;
};

const server = new grpc.Server();

server.addService(orders.service, {
  GetOrders: (
    call: grpc.ServerUnaryCall<GetOrdersRequest, GetOrdersReply>,
    callback: grpc.sendUnaryData<GetOrdersReply>
  ) => {
    const userId = call.request.userId;

    if (!userId) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'userId is required',
      });
      return;
    }

    console.log(`Fetching orders for user: ${userId}`);

    const mockOrders = generateMockOrders(
      userId,
      faker.number.int({ min: 2, max: 8 })
    );

    callback(null, { orders: mockOrders });
  },
});

server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log('gRPC server running at http://0.0.0.0:50051');
  }
);

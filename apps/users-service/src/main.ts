import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const packageDef = protoLoader.loadSync('./proto/greeting.proto');
const grpcObject = grpc.loadPackageDefinition(packageDef);
const greeter = grpcObject.greeter.Greeter;

const server = new grpc.Server();

server.addService(greeter.service, {
  SayHello: (call: any, callback: any) => {
    callback(null, { message: `Hello ${call.request.name}` });
  },
});

server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log('gRPC server running at http://0.0.0.0:50051');
  }
);

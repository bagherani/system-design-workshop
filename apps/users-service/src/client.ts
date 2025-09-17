import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const packageDef = protoLoader.loadSync('./proto/greeting.proto');
const grpcObject = grpc.loadPackageDefinition(packageDef);
const Greeter = grpcObject.greeter.Greeter;

const client = new Greeter(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

client.SayHello({ name: 'Mohi' }, (err, res) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log(res.message);
  }
});

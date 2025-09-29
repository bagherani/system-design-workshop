import express from 'express';
import { faker } from '@faker-js/faker';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { GetOrdersRequest, GetOrdersReply, Order } from '@io/grpc-types';
import { join } from 'path';
import { workspaceRoot } from '@nx/devkit';

const app = express();
const port = 3001;

const packageDef = protoLoader.loadSync(
  join(workspaceRoot, 'libs/grpc-types/src/proto', 'orders.proto')
);

const grpcObject = grpc.loadPackageDefinition(packageDef);

const ordersPackage = grpcObject.orders as grpc.GrpcObject;
const Orders = ordersPackage.Orders as grpc.ServiceClientConstructor;

const ordersClient = new Orders(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  orders?: Order[];
}

function generateMockUsers(count: number): User[] {
  const users: User[] = [];

  for (let i = 0; i < count; i++) {
    users.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress({ useFullAddress: true }),
      avatar: faker.image.avatar(),
    });
  }

  return users;
}

function getUserOrders(userId: string): Promise<Order[]> {
  return new Promise((resolve) => {
    const request: GetOrdersRequest = { userId };

    ordersClient.GetOrders(
      request,
      (error: grpc.ServiceError | null, response: GetOrdersReply) => {
        if (error) {
          console.error(`Error fetching orders for user ${userId}:`, error);
          resolve([]);
          return;
        }

        resolve(response.orders || []);
      }
    );
  });
}

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'users-service' });
});

app.get('/api/users', async (req, res) => {
  try {
    console.log('Fetching users with their orders...');

    const mockUsers = generateMockUsers(5);

    const usersWithOrders = await Promise.all(
      mockUsers.map(async (user) => {
        try {
          const orders = await getUserOrders(user.id);
          return { ...user, orders };
        } catch (error) {
          console.error(`Failed to fetch orders for user ${user.id}:`, error);
          return { ...user, orders: [] };
        }
      })
    );

    res.json({
      success: true,
      data: usersWithOrders,
      meta: {
        total: usersWithOrders.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in /api/users endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.listen(port, () => {
  console.log(`Users service running at http://localhost:${port}`);
  console.log(`Available endpoints:`);
  console.log(`  GET /health - Health check`);
  console.log(`  GET /api/users - Get users with their orders`);
});

process.on('SIGINT', () => {
  console.log('Shutting down users service...');
  process.exit(0);
});

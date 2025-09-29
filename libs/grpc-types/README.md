# @io/grpc-types

Shared gRPC protocol buffer definitions and generated TypeScript types for the IO microservices.

## Files

- **`src/proto/orders.proto`** - Protocol buffer definitions for Orders service
- **`src/generated/orders.ts`** - Generated TypeScript types and client interfaces (auto-generated)
- **`src/index.ts`** - Exports for consuming applications

## Usage

Install dependencies if needed:

```bash
npm install @bufbuild/protobuf
```

Generate TypeScript types from proto files:

```bash
# From the grpc-types library directory
npm run generate

# OR from the project root
nx run @io/grpc-types:generate
```

### Using Types

```typescript
import { Order, GetOrdersRequest, GetOrdersReply } from '@io/grpc-types';

const order: Order = {
  id: '123',
  userId: 'user-456',
  productId: 'prod-789',
  productName: 'Sample Product',
  quantity: 2,
  status: 'pending',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

### Using in gRPC Services

```typescript
import { GetOrdersRequest, GetOrdersReply } from '@io/grpc-types';
import * as grpc from '@grpc/grpc-js';

// Use in server implementation
server.addService(orders.service, {
  GetOrders: (call: grpc.ServerUnaryCall<GetOrdersRequest, GetOrdersReply>, callback: grpc.sendUnaryData<GetOrdersReply>) => {
    // Implementation here
  },
});
```

## Scripts

### Regenerate Types

After making changes to any `.proto` files:

```bash
# From libs/grpc-types directory
npm run generate
```

## Building

Build the library:

```bash
nx build grpc-types
```

## Adding New Proto Files

1. Add your `.proto` file to `src/proto/`
2. Update the generation script in `package.json` to include the new proto file
3. Run the generation script
4. Export the new types in `src/index.ts`

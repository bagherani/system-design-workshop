# @io/data-models

Simple data models library containing OpenAPI schema and generated TypeScript types.

## Files

- **`src/schemas/users-schema.yaml`** - OpenAPI schema for users API
- **`src/types/`** - Generated TypeScript types and client functions (auto-generated)
  - `types.gen.ts` - TypeScript types
  - `sdk.gen.ts` - API client functions ⭐
  - `client.gen.ts` - HTTP client setup
- **`src/index.ts`** - Exports for consuming applications

## Usage

Install dependencies:

```bash
npm install --save-dev @hey-api/openapi-ts
```

Generate both types AND client functions from schema:

```bash
# From project root
npx @hey-api/openapi-ts --input libs/data-models/src/schemas/users-schema.yaml --output libs/data-models/src/types --client @hey-api/client-fetch

# OR use the npm script (recommended) - from within libs/data-models:
npm run generate

# OR watch for changes and auto-regenerate:
npm run generate:watch
```

### Using Types

```typescript
import { User, UsersListResponse } from '@io/data-models';

const user: User = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
};
```

### Using API Client Functions ⭐

```typescript
import { getUsers } from '@io/data-models';

// Call the API directly - no need to write fetch code!
const response = await getUsers({
  baseUrl: 'https://your-api.com', // Configure your API URL
});

if (response.data) {
  console.log('Users:', response.data.users);
  console.log('Total:', response.data.total);
}

// With error handling
try {
  const response = await getUsers({
    baseUrl: 'https://your-api.com',
    throwOnError: true,
  });
  console.log('Success:', response.data);
} catch (error) {
  console.error('API Error:', error);
}
```

## Scripts

### Regenerate Types & Client Functions

After making changes to `users-schema.yaml`:

```bash
# From libs/data-models directory
npm run generate

# OR watch for changes and auto-regenerate
npm run generate:watch
```

## Building

Build the library:

```bash
nx build data-models
```

// Export all generated types and client functions
export * from './types';

// Re-export commonly used types with simpler names
export type {
  User,
  UsersListResponse,
  _Error as ApiError,
} from './types/types.gen';

// Re-export the API client function
export { getUsers } from './types/sdk.gen';

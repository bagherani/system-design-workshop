export type User = {
    /**
     * User unique identifier
     */
    id: string;
    /**
     * User full name
     */
    name: string;
    /**
     * User email address
     */
    email: string;
};
/**
 * List of users
 */
export type UsersListResponse = Array<User>;
export type _Error = {
    /**
     * Error message
     */
    message: string;
    /**
     * Error code
     */
    code?: string;
};
export type GetUsersData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/users';
};
export type GetUsersErrors = {
    /**
     * Internal server error
     */
    500: _Error;
};
export type GetUsersError = GetUsersErrors[keyof GetUsersErrors];
export type GetUsersResponses = {
    /**
     * List of users retrieved successfully
     */
    200: UsersListResponse;
};
export type GetUsersResponse = GetUsersResponses[keyof GetUsersResponses];
export type ClientOptions = {
    baseUrl: `${string}://src` | (string & {});
};
//# sourceMappingURL=types.gen.d.ts.map
import type { Options as ClientOptions, Client, TDataShape } from './client';
import type { GetUsersData, GetUsersResponses, GetUsersErrors } from './types.gen';
export type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = ClientOptions<TData, ThrowOnError> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
    /**
     * You can pass arbitrary values through the `meta` object. This can be
     * used to access values that aren't defined as part of the SDK function.
     */
    meta?: Record<string, unknown>;
};
/**
 * Get list of users
 */
export declare const getUsers: <ThrowOnError extends boolean = false>(options?: Options<GetUsersData, ThrowOnError>) => import("./client").RequestResult<GetUsersResponses, GetUsersErrors, ThrowOnError, "fields">;
//# sourceMappingURL=sdk.gen.d.ts.map
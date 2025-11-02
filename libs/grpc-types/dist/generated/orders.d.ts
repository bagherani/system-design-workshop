import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
export declare const protobufPackage = "orders";
export interface GetOrdersRequest {
    userId: string;
}
export interface GetOrdersReply {
    orders: Order[];
}
export interface Order {
    id: string;
    userId: string;
    productId: string;
    productName: string;
    quantity: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}
export declare const GetOrdersRequest: MessageFns<GetOrdersRequest>;
export declare const GetOrdersReply: MessageFns<GetOrdersReply>;
export declare const Order: MessageFns<Order>;
export interface Orders {
    GetOrders(request: GetOrdersRequest): Promise<GetOrdersReply>;
}
export declare const OrdersServiceName = "orders.Orders";
export declare class OrdersClientImpl implements Orders {
    private readonly rpc;
    private readonly service;
    constructor(rpc: Rpc, opts?: {
        service?: string;
    });
    GetOrders(request: GetOrdersRequest): Promise<GetOrdersReply>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
    create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
    fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
export {};
//# sourceMappingURL=orders.d.ts.map
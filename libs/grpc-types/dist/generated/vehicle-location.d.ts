import { BinaryReader, BinaryWriter } from '@bufbuild/protobuf/wire';
export declare const protobufPackage = "vehicle_location";
export interface VehicleLocationRequest {
    vehicleLocations: VehicleLocation | undefined;
}
export interface VehicleLocationReply {
    status: number;
}
export interface VehicleLocation {
    vehicleId: string;
    routeId: string;
    latitude: string;
    longitude: string;
}
export declare const VehicleLocationRequest: MessageFns<VehicleLocationRequest>;
export declare const VehicleLocationReply: MessageFns<VehicleLocationReply>;
export declare const VehicleLocation: MessageFns<VehicleLocation>;
export interface VehicleLocationService {
    SendVehicleLocation(request: VehicleLocationRequest): Promise<VehicleLocationReply>;
}
export declare const VehicleLocationServiceServiceName = "vehicle_location.VehicleLocationService";
export declare class VehicleLocationServiceClientImpl implements VehicleLocationService {
    private readonly rpc;
    private readonly service;
    constructor(rpc: Rpc, opts?: {
        service?: string;
    });
    SendVehicleLocation(request: VehicleLocationRequest): Promise<VehicleLocationReply>;
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
//# sourceMappingURL=vehicle-location.d.ts.map
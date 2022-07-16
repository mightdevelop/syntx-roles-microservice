/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import { Any } from "./google/protobuf/any.pb";

export const protobufPackage = "cache";

export interface Void {}

export interface Cache {
  data: string;
}

export interface CacheKey {
  packageName: string;
  rpcMethod: string;
  rpcArg: string;
}

export interface SetCacheRequest {
  key: CacheKey | undefined;
  data: Any[];
  ttl?: number | undefined;
}

export interface DoesUserHavePermissionRequest {
  userId: string;
  projectId: string;
  permissionId: number;
}

export interface AddPermissionsToUserRequest {
  userId: string;
  projectId: string;
  roleId?: string | undefined;
  permissionId: number;
}

export interface RemovePermissionsFromRoleRequest {
  roleId: string;
  permissionsIds: number[];
}

export interface Bool {
  bool?: boolean | undefined;
}

export const CACHE_PACKAGE_NAME = "cache";

export interface CacheServiceClient {
  getCacheByKey(request: CacheKey): Observable<Cache>;

  setCacheByKey(request: SetCacheRequest): Observable<Void>;
}

export interface CacheServiceController {
  getCacheByKey(request: CacheKey): Promise<Cache> | Observable<Cache> | Cache;

  setCacheByKey(
    request: SetCacheRequest
  ): Promise<Void> | Observable<Void> | Void;
}

export function CacheServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getCacheByKey", "setCacheByKey"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("CacheService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcStreamMethod("CacheService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const CACHE_SERVICE_NAME = "CacheService";

export interface PermissionsCacheServiceClient {
  doesUserHavePermission(
    request: DoesUserHavePermissionRequest
  ): Observable<Bool>;

  addPermissionToUserInProject(
    request: AddPermissionsToUserRequest
  ): Observable<Void>;

  removePermissionsFromRole(
    request: RemovePermissionsFromRoleRequest
  ): Observable<Void>;
}

export interface PermissionsCacheServiceController {
  doesUserHavePermission(
    request: DoesUserHavePermissionRequest
  ): Promise<Bool> | Observable<Bool> | Bool;

  addPermissionToUserInProject(
    request: AddPermissionsToUserRequest
  ): Promise<Void> | Observable<Void> | Void;

  removePermissionsFromRole(
    request: RemovePermissionsFromRoleRequest
  ): Promise<Void> | Observable<Void> | Void;
}

export function PermissionsCacheServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "doesUserHavePermission",
      "addPermissionToUserInProject",
      "removePermissionsFromRole",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("PermissionsCacheService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcStreamMethod("PermissionsCacheService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const PERMISSIONS_CACHE_SERVICE_NAME = "PermissionsCacheService";

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

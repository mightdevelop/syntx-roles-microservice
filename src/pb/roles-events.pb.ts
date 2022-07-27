/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import { Error } from "./common.pb";
import { Empty } from "./google/protobuf/empty.pb";

export const protobufPackage = "eventbus";

export interface Role {
  id?: string | undefined;
  projectId?: string | undefined;
  name?: string | undefined;
}

export interface RoleIdAndUserId {
  error?: Error | undefined;
  roleId: string;
  userId: string;
}

export interface RoleEvent {
  error?: Error | undefined;
  role: Role | undefined;
}

export interface SearchRolesParams {
  userId?: string | undefined;
  projectId?: string | undefined;
  name?: string | undefined;
  rolesIds: string[];
  limit?: number | undefined;
}

export interface SearchRolesEvent {
  error?: Error | undefined;
  searchParams: SearchRolesParams | undefined;
  roles: Role[];
}

export interface Permission {
  id?: number | undefined;
  name?: string | undefined;
}

export interface PermissionEvent {
  error?: Error | undefined;
  permission: Permission | undefined;
}

export interface PermissionsIdsAndUserIdAndProjectId {
  error?: Error | undefined;
  permissionsIds: number[];
  userId: string;
  projectId: string;
}

export interface PermissionsIdsAndRoleId {
  error?: Error | undefined;
  permissionsIds: number[];
  roleId: string;
}

export interface Bool {
  bool: boolean;
}

export interface UserIdAndProjectId {
  userId: string;
  projectId: string;
}

export interface SearchPermissionsParams {
  params?:
    | { $case: "userIdAndProjectId"; userIdAndProjectId: UserIdAndProjectId }
    | { $case: "roleId"; roleId: string };
  permissionsIds: number[];
  limit?: number | undefined;
}

export interface SearchPermissionsEvent {
  error?: Error | undefined;
  searchParams: SearchPermissionsParams | undefined;
  permissions: Permission[];
}

export const EVENTBUS_PACKAGE_NAME = "eventbus";

export interface RolesEventsServiceClient {
  getRoleByIdEvent(request: RoleEvent): Observable<Empty>;

  searchRolesEvent(request: SearchRolesEvent): Observable<Empty>;

  createRoleEvent(request: RoleEvent): Observable<Empty>;

  updateRoleEvent(request: RoleEvent): Observable<Empty>;

  deleteRoleEvent(request: RoleEvent): Observable<Empty>;

  addRoleToUserEvent(request: RoleIdAndUserId): Observable<Empty>;

  removeRoleFromUserEvent(request: RoleIdAndUserId): Observable<Empty>;
}

export interface RolesEventsServiceController {
  getRoleByIdEvent(request: RoleEvent): void;

  searchRolesEvent(request: SearchRolesEvent): void;

  createRoleEvent(request: RoleEvent): void;

  updateRoleEvent(request: RoleEvent): void;

  deleteRoleEvent(request: RoleEvent): void;

  addRoleToUserEvent(request: RoleIdAndUserId): void;

  removeRoleFromUserEvent(request: RoleIdAndUserId): void;
}

export function RolesEventsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getRoleByIdEvent",
      "searchRolesEvent",
      "createRoleEvent",
      "updateRoleEvent",
      "deleteRoleEvent",
      "addRoleToUserEvent",
      "removeRoleFromUserEvent",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("RolesEventsService", method)(
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
      GrpcStreamMethod("RolesEventsService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const ROLES_EVENTS_SERVICE_NAME = "RolesEventsService";

export interface PermissionsEventsServiceClient {
  getPermissionByIdEvent(request: PermissionEvent): Observable<Permission>;

  searchPermissionsEvent(
    request: SearchPermissionsEvent
  ): Observable<Permission>;

  addPermissionsToUserInProjectEvent(
    request: PermissionsIdsAndUserIdAndProjectId
  ): Observable<Empty>;

  addPermissionsToRoleEvent(
    request: PermissionsIdsAndRoleId
  ): Observable<Empty>;

  removePermissionsFromUserInProjectEvent(
    request: PermissionsIdsAndUserIdAndProjectId
  ): Observable<Empty>;

  removePermissionsFromRoleEvent(
    request: PermissionsIdsAndRoleId
  ): Observable<Empty>;
}

export interface PermissionsEventsServiceController {
  getPermissionByIdEvent(
    request: PermissionEvent
  ): Promise<Permission> | Observable<Permission> | Permission;

  searchPermissionsEvent(
    request: SearchPermissionsEvent
  ): Observable<Permission>;

  addPermissionsToUserInProjectEvent(
    request: PermissionsIdsAndUserIdAndProjectId
  ): void;

  addPermissionsToRoleEvent(request: PermissionsIdsAndRoleId): void;

  removePermissionsFromUserInProjectEvent(
    request: PermissionsIdsAndUserIdAndProjectId
  ): void;

  removePermissionsFromRoleEvent(request: PermissionsIdsAndRoleId): void;
}

export function PermissionsEventsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getPermissionByIdEvent",
      "searchPermissionsEvent",
      "addPermissionsToUserInProjectEvent",
      "addPermissionsToRoleEvent",
      "removePermissionsFromUserInProjectEvent",
      "removePermissionsFromRoleEvent",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("PermissionsEventsService", method)(
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
      GrpcStreamMethod("PermissionsEventsService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const PERMISSIONS_EVENTS_SERVICE_NAME = "PermissionsEventsService";

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

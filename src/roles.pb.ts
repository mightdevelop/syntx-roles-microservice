/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";

export const protobufPackage = "roles";

export interface Void {}

export interface Role {
  id: string;
  groupId: string;
  name: string;
}

export interface RoleByNameRequest {
  roleName: string;
}

export interface CreateRoleRequest {
  groupId: string;
  name: string;
}

export interface RoleIdAndName {
  roleId: string;
  name: string;
}

export interface RoleId {
  roleId: string;
}

export interface UserId {
  userId: string;
}

export interface GroupId {
  groupId: string;
}

export interface RoleIdAndUserId {
  roleId: string;
  userId: string;
}

export interface Permission {
  id: number;
  name: string;
}

export interface PermissionId {
  permissionId: number;
}

export interface PermissionIdAndUserId {
  permissionId: number;
  userId: string;
}

export interface PermissionIdAndRoleId {
  permissionId: number;
  roleId: string;
}

export const ROLES_PACKAGE_NAME = "roles";

export interface RolesServiceClient {
  getRoleById(request: RoleId): Observable<Role>;

  getRoleByName(request: RoleByNameRequest): Observable<Role>;

  getRolesByUserId(request: UserId): Observable<Role>;

  getRolesByGroupId(request: GroupId): Observable<Role>;

  getUsersIdsByRoleId(request: RoleId): Observable<UserId>;

  createRole(request: CreateRoleRequest): Observable<Role>;

  updateRole(request: RoleIdAndName): Observable<Role>;

  deleteRole(request: RoleId): Observable<Role>;

  addRoleToUser(request: RoleIdAndUserId): Observable<Void>;

  removeRoleFromUser(request: RoleIdAndUserId): Observable<Void>;
}

export interface RolesServiceController {
  getRoleById(request: RoleId): Promise<Role> | Observable<Role> | Role;

  getRoleByName(
    request: RoleByNameRequest
  ): Promise<Role> | Observable<Role> | Role;

  getRolesByUserId(request: UserId): Observable<Role>;

  getRolesByGroupId(request: GroupId): Observable<Role>;

  getUsersIdsByRoleId(request: RoleId): Observable<UserId>;

  createRole(
    request: CreateRoleRequest
  ): Promise<Role> | Observable<Role> | Role;

  updateRole(request: RoleIdAndName): Promise<Role> | Observable<Role> | Role;

  deleteRole(request: RoleId): Promise<Role> | Observable<Role> | Role;

  addRoleToUser(
    request: RoleIdAndUserId
  ): Promise<Void> | Observable<Void> | Void;

  removeRoleFromUser(
    request: RoleIdAndUserId
  ): Promise<Void> | Observable<Void> | Void;
}

export function RolesServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getRoleById",
      "getRoleByName",
      "getRolesByUserId",
      "getRolesByGroupId",
      "getUsersIdsByRoleId",
      "createRole",
      "updateRole",
      "deleteRole",
      "addRoleToUser",
      "removeRoleFromUser",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("RolesService", method)(
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
      GrpcStreamMethod("RolesService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const ROLES_SERVICE_NAME = "RolesService";

export interface PermissionsServiceClient {
  getPermissionById(request: PermissionId): Observable<Permission>;

  getPermissionsByUserId(request: UserId): Observable<Permission>;

  getPermissionsByRoleId(request: RoleId): Observable<Permission>;

  addPermissionToUser(request: PermissionIdAndUserId): Observable<Void>;

  addPermissionToRole(request: PermissionIdAndRoleId): Observable<Void>;

  removePermissionFromUser(request: PermissionIdAndUserId): Observable<Void>;

  removePermissionFromRole(request: PermissionIdAndRoleId): Observable<Void>;
}

export interface PermissionsServiceController {
  getPermissionById(
    request: PermissionId
  ): Promise<Permission> | Observable<Permission> | Permission;

  getPermissionsByUserId(request: UserId): Observable<Permission>;

  getPermissionsByRoleId(request: RoleId): Observable<Permission>;

  addPermissionToUser(
    request: PermissionIdAndUserId
  ): Promise<Void> | Observable<Void> | Void;

  addPermissionToRole(
    request: PermissionIdAndRoleId
  ): Promise<Void> | Observable<Void> | Void;

  removePermissionFromUser(
    request: PermissionIdAndUserId
  ): Promise<Void> | Observable<Void> | Void;

  removePermissionFromRole(
    request: PermissionIdAndRoleId
  ): Promise<Void> | Observable<Void> | Void;
}

export function PermissionsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getPermissionById",
      "getPermissionsByUserId",
      "getPermissionsByRoleId",
      "addPermissionToUser",
      "addPermissionToRole",
      "removePermissionFromUser",
      "removePermissionFromRole",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("PermissionsService", method)(
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
      GrpcStreamMethod("PermissionsService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const PERMISSIONS_SERVICE_NAME = "PermissionsService";

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

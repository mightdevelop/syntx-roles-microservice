/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";

export const protobufPackage = "roles";

export interface Void {}

export interface Role {
  id: string;
  projectId: string;
  name: string;
}

export interface CreateRoleRequest {
  projectId: string;
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

export interface UserIdAndProjectId {
  userId: string;
  projectId: string;
}

export interface RoleIdAndUserId {
  roleId: string;
  userId: string;
}

export interface SearchRolesParams {
  userId?: string | undefined;
  projectId?: string | undefined;
  name?: string | undefined;
  rolesIds: string[];
  limit?: number | undefined;
}

export interface Permission {
  id: number;
  name: string;
}

export interface PermissionId {
  permissionId: number;
}

export interface PermissionsIdsAndUserIdAndProjectId {
  permissionsIds: number[];
  userId: string;
  projectId: string;
}

export interface PermissionsIdsAndRoleId {
  permissionsIds: number[];
  roleId: string;
}

export interface Bool {
  bool: boolean;
}

export interface SearchPermissionsParams {
  params?:
    | { $case: "userIdAndProjectId"; userIdAndProjectId: UserIdAndProjectId }
    | { $case: "roleId"; roleId: string };
  permissionsIds: number[];
  limit?: number | undefined;
}

export const ROLES_PACKAGE_NAME = "roles";

export interface RolesServiceClient {
  getRoleById(request: RoleId): Observable<Role>;

  searchRoles(request: SearchRolesParams): Observable<Role>;

  getUsersIdsByRoleId(request: RoleId): Observable<UserId>;

  createRole(request: CreateRoleRequest): Observable<Role>;

  updateRole(request: RoleIdAndName): Observable<Role>;

  deleteRole(request: RoleId): Observable<Role>;

  addRoleToUser(request: RoleIdAndUserId): Observable<Void>;

  removeRoleFromUser(request: RoleIdAndUserId): Observable<Void>;
}

export interface RolesServiceController {
  getRoleById(request: RoleId): Promise<Role> | Observable<Role> | Role;

  searchRoles(
    request: SearchRolesParams
  ): Promise<Role> | Observable<Role> | Role;

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
      "searchRoles",
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

  searchPermissions(request: SearchPermissionsParams): Observable<Permission>;

  addPermissionsToUserInProject(
    request: PermissionsIdsAndUserIdAndProjectId
  ): Observable<Void>;

  addPermissionsToRole(request: PermissionsIdsAndRoleId): Observable<Void>;

  removePermissionsFromUserInProject(
    request: PermissionsIdsAndUserIdAndProjectId
  ): Observable<Void>;

  removePermissionsFromRole(request: PermissionsIdsAndRoleId): Observable<Void>;
}

export interface PermissionsServiceController {
  getPermissionById(
    request: PermissionId
  ): Promise<Permission> | Observable<Permission> | Permission;

  searchPermissions(request: SearchPermissionsParams): Observable<Permission>;

  addPermissionsToUserInProject(
    request: PermissionsIdsAndUserIdAndProjectId
  ): Promise<Void> | Observable<Void> | Void;

  addPermissionsToRole(
    request: PermissionsIdsAndRoleId
  ): Promise<Void> | Observable<Void> | Void;

  removePermissionsFromUserInProject(
    request: PermissionsIdsAndUserIdAndProjectId
  ): Promise<Void> | Observable<Void> | Void;

  removePermissionsFromRole(
    request: PermissionsIdsAndRoleId
  ): Promise<Void> | Observable<Void> | Void;
}

export function PermissionsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getPermissionById",
      "searchPermissions",
      "addPermissionsToUserInProject",
      "addPermissionsToRole",
      "removePermissionsFromUserInProject",
      "removePermissionsFromRole",
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

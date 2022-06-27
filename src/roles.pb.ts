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

export interface RoleByNameRequest {
  roleName: string;
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

export interface ProjectId {
  projectId: string;
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

export interface PermissionIdAndUserIdAndProjectId {
  permissionId: number;
  userId: string;
  projectId: string;
}

export interface PermissionIdAndRoleId {
  permissionId: number;
  roleId: string;
}

export interface Bool {
  bool: boolean;
}

export const ROLES_PACKAGE_NAME = "roles";

export interface RolesServiceClient {
  getRoleById(request: RoleId): Observable<Role>;

  getRoleByName(request: RoleByNameRequest): Observable<Role>;

  getRolesByUserIdAndProjectId(request: UserIdAndProjectId): Observable<Role>;

  getRolesByProjectId(request: ProjectId): Observable<Role>;

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

  getRolesByUserIdAndProjectId(request: UserIdAndProjectId): Observable<Role>;

  getRolesByProjectId(request: ProjectId): Observable<Role>;

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
      "getRolesByUserIdAndProjectId",
      "getRolesByProjectId",
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

  getPermissionsByUserIdAndProjectId(
    request: UserIdAndProjectId
  ): Observable<Permission>;

  getPermissionsByRoleId(request: RoleId): Observable<Permission>;

  doesUserHavePermission(
    request: PermissionIdAndUserIdAndProjectId
  ): Observable<Bool>;

  doesRoleHavePermission(request: PermissionIdAndRoleId): Observable<Bool>;

  addPermissionToUserInProject(
    request: PermissionIdAndUserIdAndProjectId
  ): Observable<Void>;

  addPermissionToRole(request: PermissionIdAndRoleId): Observable<Void>;

  removePermissionFromUserInProject(
    request: PermissionIdAndUserIdAndProjectId
  ): Observable<Void>;

  removePermissionFromRole(request: PermissionIdAndRoleId): Observable<Void>;
}

export interface PermissionsServiceController {
  getPermissionById(
    request: PermissionId
  ): Promise<Permission> | Observable<Permission> | Permission;

  getPermissionsByUserIdAndProjectId(
    request: UserIdAndProjectId
  ): Observable<Permission>;

  getPermissionsByRoleId(request: RoleId): Observable<Permission>;

  doesUserHavePermission(
    request: PermissionIdAndUserIdAndProjectId
  ): Promise<Bool> | Observable<Bool> | Bool;

  doesRoleHavePermission(
    request: PermissionIdAndRoleId
  ): Promise<Bool> | Observable<Bool> | Bool;

  addPermissionToUserInProject(
    request: PermissionIdAndUserIdAndProjectId
  ): Promise<Void> | Observable<Void> | Void;

  addPermissionToRole(
    request: PermissionIdAndRoleId
  ): Promise<Void> | Observable<Void> | Void;

  removePermissionFromUserInProject(
    request: PermissionIdAndUserIdAndProjectId
  ): Promise<Void> | Observable<Void> | Void;

  removePermissionFromRole(
    request: PermissionIdAndRoleId
  ): Promise<Void> | Observable<Void> | Void;
}

export function PermissionsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getPermissionById",
      "getPermissionsByUserIdAndProjectId",
      "getPermissionsByRoleId",
      "doesUserHavePermission",
      "doesRoleHavePermission",
      "addPermissionToUserInProject",
      "addPermissionToRole",
      "removePermissionFromUserInProject",
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

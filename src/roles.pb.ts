/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";

export const protobufPackage = "roles";

export interface Void {}

export interface Role {
  id: string;
  name: string;
}

export interface RoleByIdRequest {
  roleId: string;
}

export interface RoleByNameRequest {
  roleName: string;
}

export interface RolesByUserIdRequest {
  userId: string;
}

export interface UsersIdsByRoleIdRequest {
  roleId: string;
}

export interface CreateRoleRequest {
  name: string;
}

export interface UpdateRoleRequest {
  roleId: string;
  name: string;
}

export interface DeleteRoleRequest {
  roleId: string;
}

export interface RoleIdAndUserIdRequest {
  roleId: string;
  userId: string;
}

export interface UserIdResponse {
  userId: string;
}

export interface Permission {
  id: number;
  name: string;
}

export interface PermissionByIdRequest {
  permissionId: number;
}

export interface PermissionsByUserIdRequest {
  userId: string;
}

export interface PermissionsByRoleIdRequest {
  roleId: string;
}

export interface AddPermissionToUserRequest {
  permissionId: number;
  userId: string;
}

export interface AddPermissionToRoleRequest {
  permissionId: number;
  roleId: string;
}

export const ROLES_PACKAGE_NAME = "roles";

export interface RolesServiceClient {
  getRoleById(request: RoleByIdRequest): Observable<Role>;

  getRoleByName(request: RoleByNameRequest): Observable<Role>;

  getRolesByUserId(request: RolesByUserIdRequest): Observable<Role>;

  getUsersIdsByRoleId(
    request: UsersIdsByRoleIdRequest
  ): Observable<UserIdResponse>;

  createRole(request: CreateRoleRequest): Observable<Role>;

  updateRole(request: UpdateRoleRequest): Observable<Role>;

  deleteRole(request: DeleteRoleRequest): Observable<Role>;

  addRoleToUser(request: RoleIdAndUserIdRequest): Observable<Void>;

  removeRoleFromUser(request: RoleIdAndUserIdRequest): Observable<Void>;
}

export interface RolesServiceController {
  getRoleById(
    request: RoleByIdRequest
  ): Promise<Role> | Observable<Role> | Role;

  getRoleByName(
    request: RoleByNameRequest
  ): Promise<Role> | Observable<Role> | Role;

  getRolesByUserId(request: RolesByUserIdRequest): Observable<Role>;

  getUsersIdsByRoleId(
    request: UsersIdsByRoleIdRequest
  ): Observable<UserIdResponse>;

  createRole(
    request: CreateRoleRequest
  ): Promise<Role> | Observable<Role> | Role;

  updateRole(
    request: UpdateRoleRequest
  ): Promise<Role> | Observable<Role> | Role;

  deleteRole(
    request: DeleteRoleRequest
  ): Promise<Role> | Observable<Role> | Role;

  addRoleToUser(
    request: RoleIdAndUserIdRequest
  ): Promise<Void> | Observable<Void> | Void;

  removeRoleFromUser(
    request: RoleIdAndUserIdRequest
  ): Promise<Void> | Observable<Void> | Void;
}

export function RolesServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getRoleById",
      "getRoleByName",
      "getRolesByUserId",
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
  getPermissionById(request: PermissionByIdRequest): Observable<Permission>;

  getPermissionsByUserId(
    request: PermissionsByUserIdRequest
  ): Observable<Permission>;

  getPermissionsByRoleId(
    request: PermissionsByRoleIdRequest
  ): Observable<Permission>;

  addPermissionToUser(request: AddPermissionToUserRequest): Observable<Void>;

  addPermissionToRole(request: AddPermissionToRoleRequest): Observable<Void>;
}

export interface PermissionsServiceController {
  getPermissionById(
    request: PermissionByIdRequest
  ): Promise<Permission> | Observable<Permission> | Permission;

  getPermissionsByUserId(
    request: PermissionsByUserIdRequest
  ): Observable<Permission>;

  getPermissionsByRoleId(
    request: PermissionsByRoleIdRequest
  ): Observable<Permission>;

  addPermissionToUser(
    request: AddPermissionToUserRequest
  ): Promise<Void> | Observable<Void> | Void;

  addPermissionToRole(
    request: AddPermissionToRoleRequest
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

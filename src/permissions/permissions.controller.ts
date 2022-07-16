import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { concatMap, from, Observable } from 'rxjs'
import {
    PermissionsServiceController,
    PERMISSIONS_SERVICE_NAME,
    Permission as ProtoPermission,
    PermissionId,
    RoleId,
    PermissionIdAndRoleId,
    PermissionIdAndUserIdAndProjectId,
    Void,
    UserIdAndProjectId,
    Bool,
    PermissionsIdsAndRoleId,
    PermissionsIdsAndUserIdAndProjectId,
} from '../roles.pb'
import { PermissionsService } from './permissions.service'

@Controller()
export class PermissionsController implements PermissionsServiceController {

    constructor(
        private readonly permissionsService: PermissionsService
    ) {}

    @GrpcMethod(PERMISSIONS_SERVICE_NAME, 'getPermissionById')
    public getPermissionById(dto: PermissionId): Observable<ProtoPermission> {
        return from(this.permissionsService.getPermissionById(dto))
    }

    @GrpcMethod(PERMISSIONS_SERVICE_NAME, 'getPermissionsByRoleId')
    public getPermissionsByRoleId(dto: RoleId): Observable<ProtoPermission> {
        return from(this.permissionsService.getPermissionsByRoleId(dto)).pipe(concatMap(x => x))
    }

    @GrpcMethod(PERMISSIONS_SERVICE_NAME, 'getPermissionsByUserIdAndProjectId')
    public getPermissionsByUserIdAndProjectId(dto: UserIdAndProjectId): Observable<ProtoPermission> {
        return from(this.permissionsService.getPermissionsByUserIdAndProjectId(dto)).pipe(concatMap(x => x))
    }

    @GrpcMethod(PERMISSIONS_SERVICE_NAME, 'doesUserHavePermission')
    public doesUserHavePermission(dto: PermissionIdAndUserIdAndProjectId): Observable<Bool> {
        return from(this.permissionsService.doesUserHavePermission(dto))
    }

    @GrpcMethod(PERMISSIONS_SERVICE_NAME, 'doesRoleHavePermission')
    public doesRoleHavePermission(dto: PermissionIdAndRoleId): Observable<Bool> {
        return from(this.permissionsService.doesRoleHavePermission(dto))
    }

    @GrpcMethod(PERMISSIONS_SERVICE_NAME, 'addPermissionsToRole')
    public addPermissionsToRole(dto: PermissionsIdsAndRoleId): Observable<Void> {
        return from(this.permissionsService.addPermissionsToRole(dto))
    }

    @GrpcMethod(PERMISSIONS_SERVICE_NAME, 'addPermissionsToUserInProject')
    public addPermissionsToUserInProject(dto: PermissionsIdsAndUserIdAndProjectId): Observable<Void> {
        return from(this.permissionsService.addPermissionsToUserInProject(dto))
    }

    @GrpcMethod(PERMISSIONS_SERVICE_NAME, 'removePermissionsFromRole')
    public removePermissionsFromRole(dto: PermissionsIdsAndRoleId): Observable<Void> {
        return from(this.permissionsService.removePermissionsFromRole(dto))
    }

    @GrpcMethod(PERMISSIONS_SERVICE_NAME, 'removePermissionsFromUserInProject')
    public removePermissionsFromUserInProject(dto: PermissionsIdsAndUserIdAndProjectId): Observable<Void> {
        return from(this.permissionsService.removePermissionsFromUserInProject(dto))
    }

}

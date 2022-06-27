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

    @GrpcMethod(PERMISSIONS_SERVICE_NAME, 'getPermissionsByUserId')
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

    @GrpcMethod(PERMISSIONS_SERVICE_NAME, 'addPermissionToRole')
    public addPermissionToRole(dto: PermissionIdAndRoleId): Observable<Void> {
        return from(this.permissionsService.addPermissionToRole(dto))
    }

    @GrpcMethod(PERMISSIONS_SERVICE_NAME, 'addPermissionToUserInProject')
    public addPermissionToUserInProject(dto: PermissionIdAndUserIdAndProjectId): Observable<Void> {
        return from(this.permissionsService.addPermissionToUserInProject(dto))
    }

    @GrpcMethod(PERMISSIONS_SERVICE_NAME, 'removePermissionFromRole')
    public removePermissionFromRole(dto: PermissionIdAndRoleId): Observable<Void> {
        return from(this.permissionsService.removePermissionFromRole(dto))
    }

    @GrpcMethod(PERMISSIONS_SERVICE_NAME, 'removePermissionFromUserInProject')
    public removePermissionFromUserInProject(dto: PermissionIdAndUserIdAndProjectId): Observable<Void> {
        return from(this.permissionsService.removePermissionFromUserInProject(dto))
    }

}

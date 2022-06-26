import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { concatMap, from, Observable } from 'rxjs'
import {
    PermissionsServiceController,
    PERMISSIONS_SERVICE_NAME,
    Permission as ProtoPermission,
    PermissionId,
    UserId,
    RoleId,
    PermissionIdAndRoleId,
    PermissionIdAndUserId,
    Void,
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
    public getPermissionsByUserId(dto: UserId): Observable<ProtoPermission> {
        return from(this.permissionsService.getPermissionsByUserId(dto)).pipe(concatMap(x => x))
    }

    @GrpcMethod(PERMISSIONS_SERVICE_NAME, 'addPermissionToRole')
    public addPermissionToRole(dto: PermissionIdAndRoleId): Observable<Void> {
        return from(this.permissionsService.addPermissionToRole(dto))
    }

    @GrpcMethod(PERMISSIONS_SERVICE_NAME, 'addPermissionToUser')
    public addPermissionToUser(dto: PermissionIdAndUserId): Observable<Void> {
        return from(this.permissionsService.addPermissionToUser(dto))
    }

    @GrpcMethod(PERMISSIONS_SERVICE_NAME, 'removePermissionToRole')
    public removePermissionFromRole(dto: PermissionIdAndRoleId): Observable<Void> {
        return from(this.permissionsService.removePermissionFromRole(dto))
    }

    @GrpcMethod(PERMISSIONS_SERVICE_NAME, 'removePermissionToUser')
    public removePermissionFromUser(dto: PermissionIdAndUserId): Observable<Void> {
        return from(this.permissionsService.removePermissionFromUser(dto))
    }

}

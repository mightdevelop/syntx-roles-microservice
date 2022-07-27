import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { concatMap, from, Observable } from 'rxjs'
import {
    CreateRoleRequest,
    RoleIdAndName,
    Role as ProtoRole,
    SearchRolesParams,
    RolesServiceController,
    ROLES_SERVICE_NAME,
    Void,
    RoleId,
    UserId,
    RoleIdAndUserId,
} from './pb/roles.pb'
import { RolesService } from './roles.service'

@Controller()
export class RolesController implements RolesServiceController {

    constructor(
        private readonly rolesService: RolesService
    ) {}

    @GrpcMethod(ROLES_SERVICE_NAME, 'getRoleById')
    public getRoleById(dto: RoleId): Observable<ProtoRole> {
        return from(this.rolesService.getRoleById(dto))
    }

    @GrpcMethod(ROLES_SERVICE_NAME, 'searchRoles')
    public searchRoles(dto: SearchRolesParams): Observable<ProtoRole> {
        return from(this.rolesService.searchRoles(dto)).pipe(concatMap(x => x))
    }

    @GrpcMethod(ROLES_SERVICE_NAME, 'getUsersIdsByRoleId')
    public getUsersIdsByRoleId(dto: RoleId): Observable<UserId> {
        return from(this.rolesService.getUsersIdsByRoleId(dto)).pipe(concatMap(x => x))
    }

    @GrpcMethod(ROLES_SERVICE_NAME, 'createRole')
    public createRole(dto: CreateRoleRequest): Observable<ProtoRole> {
        return from(this.rolesService.createRole(dto))
    }

    @GrpcMethod(ROLES_SERVICE_NAME, 'updateRole')
    public updateRole(dto: RoleIdAndName): Observable<ProtoRole> {
        return from(this.rolesService.updateRole(dto))
    }

    @GrpcMethod(ROLES_SERVICE_NAME, 'deleteRole')
    public deleteRole(dto: RoleId): Observable<ProtoRole> {
        return from(this.rolesService.deleteRole(dto))
    }

    @GrpcMethod(ROLES_SERVICE_NAME, 'addRoleToUser')
    public addRoleToUser(dto: RoleIdAndUserId): Observable<Void> {
        return from(this.rolesService.addRoleToUser(dto))
    }

    @GrpcMethod(ROLES_SERVICE_NAME, 'removeRoleFromUser')
    public removeRoleFromUser(dto: RoleIdAndUserId): Observable<Void> {
        return from(this.rolesService.removeRoleFromUser(dto))
    }
}

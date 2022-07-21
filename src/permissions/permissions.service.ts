import { Inject, Injectable } from '@nestjs/common'
import { Driver } from 'neo4j-driver'
import {
    Permission,
    PermissionId,
    Void,
    PermissionsIdsAndRoleId,
    PermissionsIdsAndUserIdAndProjectId,
    SearchPermissionsParams
} from '../roles.pb'
import { session as neo4jSession } from 'neo4j-driver'
import { ClientGrpc, RpcException } from '@nestjs/microservices'
import { CACHE_PACKAGE_NAME, PermissionsCacheServiceClient, PERMISSIONS_CACHE_SERVICE_NAME } from 'src/cache.pb'
import { Status } from '@grpc/grpc-js/build/src/constants'

@Injectable()
export class PermissionsService {

    private permissionsCacheService: PermissionsCacheServiceClient

    @Inject(CACHE_PACKAGE_NAME)
    private readonly client: ClientGrpc

    onModuleInit(): void {
        this.permissionsCacheService = this.client.getService<PermissionsCacheServiceClient>(PERMISSIONS_CACHE_SERVICE_NAME)
    }

    @Inject('DATA_SOURCE')
    private readonly neo4jDriver: Driver

    public async getPermissionById(
        { permissionId }: PermissionId
    ): Promise<Permission> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const permission: Permission = (await session
            .run(
                `
                MATCH (permission:Permission {id: $permissionId})
                RETURN permission
                `,
                { permissionId }
            ))
            .records[0]
            ?.get('permission')
            .properties
        session.close()
        if (!permission)
            throw new RpcException({ code: Status.NOT_FOUND, message: 'Permission not found' })
        return permission
    }

    public async searchPermissions(
        { permissionsIds, limit, params }: SearchPermissionsParams
    ): Promise<Permission[]> {

        const roleId = params.$case === 'roleId'
            ? params.roleId
            : undefined

        const { userId, projectId } = params.$case === 'userIdAndProjectId'
            ? params.userIdAndProjectId
            : undefined

        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const permissions: Permission[] = (await session
            .run(
                `
                MATCH (p:Permission)
                WHERE
                    p.id IN &permissionsIds
                    AND
                    (
                        (p)<-[:HAS]-(:Role {id: $roleId})
                        OR
                        (
                            (p)<-[:HAS_IN_PROJECT {projectId: $projectId}]-(:UserId {id: $userId})
                            OR
                            (p)<-[:HAS]-(:Role)<-[:HAS]-(:UserId {id: $userId})
                        )
                    )
                RETURN p
                LIMIT $limit
                `,
                { permissionsIds, limit, roleId, userId, projectId }
            ))
            .records
            ?.map(record => record.get('p').properties)
        session.close()
        return permissions
    }

    public async addPermissionsToRole(
        { permissionsIds, roleId }: PermissionsIdsAndRoleId
    ): Promise<Void> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.WRITE })
        const permission: Permission = (await session
            .run(
                `
                MATCH (permission:Permission)
                WHERE permission.id IN $permissionsIds
                MATCH (role:Role {id: $roleId})
                MERGE (role)-[rel:HAS]->(permission)
                RETURN permission
                `,
                { roleId, permissionsIds }
            ))
            .records[0]
            ?.get('permission')
            .properties
        if (!permission)
            throw new RpcException({ code: Status.UNAVAILABLE, message: 'Query db error' })
        session.close()
        return {}
    }

    public async removePermissionsFromRole(
        { permissionsIds, roleId }: PermissionsIdsAndRoleId
    ): Promise<Void> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.WRITE })
        const records = (await session
            .run(
                `
                MATCH (permission:Permission)<-[rel:HAS]-(:Role {id: $roleId})
                WHERE permission.id IN $permissionsIds
                DELETE rel
                RETURN rel, permission.id as permissionsIds
                `,
                { roleId, permissionsIds }
            ))
            .records
        session.close()
        const rel = records[0]?.get('rel').properties
        if (!rel)
            throw new RpcException({ code: Status.NOT_FOUND, message: 'Role hasn`t this permissions' })

        permissionsIds = records.map(record => record.get('permissionsIds').properties.id)
        this.permissionsCacheService.removePermissionsFromRole({ permissionsIds, roleId })
        return {}
    }

    public async addPermissionsToUserInProject(
        { projectId, permissionsIds, userId }: PermissionsIdsAndUserIdAndProjectId
    ): Promise<Void> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.WRITE })
        const rel = (await session
            .run(
                `
                MATCH (permission:Permission)
                WHERE permission.id IN $permissionsIds
                MERGE (:UserId {id: $userId})-[rel:HAS_IN_PROJECT {projectId: $projectId}]->(permission)
                RETURN rel
                `,
                { projectId, userId, permissionsIds }
            ))
            .records[0]
            ?.get('rel')
            .properties
        session.close()
        if (!rel)
            throw new RpcException({ code: Status.NOT_FOUND, message: 'Permission not found' })
        return {}
    }

    public async removePermissionsFromUserInProject(
        { projectId, permissionsIds, userId }: PermissionsIdsAndUserIdAndProjectId
    ): Promise<Void> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.WRITE })
        const rel = (await session
            .run(
                `
                MATCH (:Permission)<-[rel:HAS_IN_PROJECT {projectId: $projectId}]-(:UserId {id: $userId})
                WHERE permission.id IN &permissionsIds
                DELETE rel
                RETURN rel
                `,
                { projectId, userId, permissionsIds }
            ))
            .records[0]
            ?.get('rel')
            .properties
        session.close()
        if (!rel)
            throw new RpcException({ code: Status.NOT_FOUND, message: 'User hasn`t this permission' })
        return {}
    }

}

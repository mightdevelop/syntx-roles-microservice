import { Inject, Injectable } from '@nestjs/common'
import { Driver } from 'neo4j-driver'
import {
    EVENTBUS_PACKAGE_NAME,
    PermissionsEventsServiceClient,
    PERMISSIONS_EVENTS_SERVICE_NAME,
} from '../pb/roles-events.pb'
import { session as neo4jSession } from 'neo4j-driver'
import { ClientGrpc, RpcException } from '@nestjs/microservices'
import { Status } from '@grpc/grpc-js/build/src/constants'
import { Error } from 'src/pb/common.pb'
import { Empty } from 'src/pb/google/protobuf/empty.pb'
import {
    PermissionId,
    Permission,
    PermissionsIdsAndRoleId,
    PermissionsIdsAndUserIdAndProjectId,
    SearchPermissionsParams,
} from 'src/pb/roles.pb'

@Injectable()
export class PermissionsService {

    private permissionsEventsService: PermissionsEventsServiceClient

    @Inject(EVENTBUS_PACKAGE_NAME)
    private readonly client: ClientGrpc

    onModuleInit(): void {
        this.permissionsEventsService = this.client.getService<PermissionsEventsServiceClient>(PERMISSIONS_EVENTS_SERVICE_NAME)
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
            )
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.permissionsEventsService.getPermissionByIdEvent({
                    error,
                    permission: { id: permissionId },
                })
                throw new RpcException(error)
            }))
            .records[0]
            ?.get('permission')
            .properties
        session.close()
        if (!permission) {
            const error: Error = {
                code: Status.NOT_FOUND,
                message: 'Permission not found',
            }
            this.permissionsEventsService.getPermissionByIdEvent({ error, permission: { id: permissionId } })
            throw new RpcException(error)
        }
        this.permissionsEventsService.getPermissionByIdEvent({ permission })
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
                        (p)<-[:HAS_IN_PROJECT {projectId: $projectId}]-(:UserId {id: $userId})
                        OR
                        (p)<-[:HAS]-(:Role)<-[:HAS]-(:UserId {id: $userId})
                    )
                RETURN p
                LIMIT $limit
                `,
                { permissionsIds, limit, roleId, userId, projectId }
            )
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.permissionsEventsService.searchPermissionsEvent({
                    error,
                    permissions: permissionsIds.map(id => ({ id })),
                    searchParams: { permissionsIds, limit, params },
                })
                throw new RpcException(error)
            }))
            .records
            ?.map(record => record.get('p').properties)
        session.close()
        this.permissionsEventsService.searchPermissionsEvent({
            permissions,
            searchParams: { permissionsIds, limit, params },
        })
        return permissions
    }

    public async addPermissionsToRole(
        { permissionsIds, roleId }: PermissionsIdsAndRoleId
    ): Promise<Empty> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.WRITE });
        (await session
            .run(
                `
                MATCH (p:Permission)
                WHERE p.id IN $permissionsIds
                MATCH (role:Role {id: $roleId})
                MERGE (role)-[rel:HAS]->(p)
                RETURN p
                `,
                { roleId, permissionsIds }
            )
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.permissionsEventsService.addPermissionsToRoleEvent({
                    error,
                    permissionsIds,
                    roleId,
                })
                throw new RpcException(error)
            }))
            .records[0]
            ?.get('p')
            .properties
        session.close()
        this.permissionsEventsService.addPermissionsToRoleEvent({
            permissionsIds,
            roleId,
        })
        return {}
    }

    public async removePermissionsFromRole(
        { permissionsIds, roleId }: PermissionsIdsAndRoleId
    ): Promise<Empty> {
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
            )
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.permissionsEventsService.removePermissionsFromRoleEvent({ error, permissionsIds, roleId })
                throw new RpcException(error)
            }))
            .records
        session.close()
        const rel = records[0]?.get('rel').properties
        if (!rel) {
            const error: Error = {
                code: Status.NOT_FOUND,
                message: 'Role hasn`t this permission',
            }
            this.permissionsEventsService.removePermissionsFromRoleEvent({ error, permissionsIds, roleId })
            throw new RpcException(error)
        }

        permissionsIds = records.map(record => record.get('permissionsIds').properties.id)
        this.permissionsEventsService.removePermissionsFromRoleEvent({ permissionsIds, roleId })
        return {}
    }

    public async addPermissionsToUserInProject(
        { projectId, permissionsIds, userId }: PermissionsIdsAndUserIdAndProjectId
    ): Promise<Empty> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.WRITE });
        (await session
            .run(
                `
                MATCH (permission:Permission)
                WHERE permission.id IN $permissionsIds
                MERGE (:UserId {id: $userId})-[rel:HAS_IN_PROJECT {projectId: $projectId}]->(permission)
                RETURN rel
                `,
                { projectId, userId, permissionsIds }
            )
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.permissionsEventsService.addPermissionsToUserInProjectEvent({
                    error,
                    permissionsIds,
                    userId,
                    projectId,
                })
                throw new RpcException(error)
            }))
            .records[0]
            ?.get('rel')
            .properties
        session.close()
        this.permissionsEventsService.addPermissionsToUserInProjectEvent({
            permissionsIds,
            userId,
            projectId,
        })
        return {}
    }

    public async removePermissionsFromUserInProject(
        { projectId, permissionsIds, userId }: PermissionsIdsAndUserIdAndProjectId
    ): Promise<Empty> {
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
            )
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.permissionsEventsService.removePermissionsFromUserInProjectEvent({
                    error,
                    permissionsIds,
                    userId,
                    projectId,
                })
                throw new RpcException(error)
            }))
            .records[0]
            ?.get('rel')
            .properties
        session.close()
        if (!rel) {
            const error: Error = {
                code: Status.NOT_FOUND,
                message: 'User hasn`t this permission',
            }
            this.permissionsEventsService.removePermissionsFromUserInProjectEvent({
                error,
                permissionsIds,
                userId,
                projectId,
            })
            throw new RpcException(error)
        }
        this.permissionsEventsService.removePermissionsFromUserInProjectEvent({
            permissionsIds,
            userId,
            projectId,
        })
        return {}
    }

}

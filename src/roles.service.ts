import { Inject, Injectable } from '@nestjs/common'
import { Driver } from 'neo4j-driver'
import {
    EVENTBUS_PACKAGE_NAME,
    RolesEventsServiceClient,
    ROLES_EVENTS_SERVICE_NAME,
} from './pb/roles-events.pb'
import {
    CreateRoleRequest,
    Role,
    RoleId,
    RoleIdAndName,
    RoleIdAndUserId,
    SearchRolesParams,
    UserId,
    Void,
} from './pb/roles.pb'
import { session as neo4jSession } from 'neo4j-driver'
import { ClientGrpc, RpcException } from '@nestjs/microservices'
import { v4 as uuidv4 } from 'uuid'
import { Status } from '@grpc/grpc-js/build/src/constants'
import { Error } from './pb/common.pb'

@Injectable()
export class RolesService {

    private rolesEventsService: RolesEventsServiceClient

    @Inject(EVENTBUS_PACKAGE_NAME)
    private readonly client: ClientGrpc

    onModuleInit(): void {
        this.rolesEventsService = this.client.getService<RolesEventsServiceClient>(ROLES_EVENTS_SERVICE_NAME)
    }

    @Inject('DATA_SOURCE')
    private readonly neo4jDriver: Driver

    public async getRoleById({ roleId }: RoleId): Promise<Role> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const role: Role = (await session
            .run(
                `
                MATCH (role:Role {id: $roleId})
                RETURN role
                `,
                { roleId }
            )
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.rolesEventsService.getRoleByIdEvent({
                    error,
                    role: { id: roleId },
                })
                throw new RpcException(error)
            }))
            .records[0]
            ?.get('role')
            .properties
        session.close()
        if (!role) {
            const error: Error = {
                code: Status.NOT_FOUND,
                message: 'Role not found',
            }
            this.rolesEventsService.getRoleByIdEvent({ error, role: { id: roleId } })
            throw new RpcException(error)
        }
        this.rolesEventsService.getRoleByIdEvent({ role })
        return role
    }

    public async searchRoles(
        searchParams: SearchRolesParams
    ): Promise<Role[]> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const roles: Role[] = (await session
            .run(
                `
                MATCH (role:Role)
                WHERE 
                    role.id IN &rolesIds
                    AND
                    role.name = $name
                    AND
                    (role {projectId: $projectId})<-[:HAS]-(:UserId {id: $userId})
                RETURN role
                LIMIT $limit
                `,
                searchParams
            )
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.rolesEventsService.searchRolesEvent({
                    error,
                    roles: searchParams.rolesIds.map(id => ({ id })),
                    searchParams,
                })
                throw new RpcException(error)
            }))
            .records[0]
            ?.map(record => record.get('role').properties.id)
        session.close()
        this.rolesEventsService.searchRolesEvent({ roles, searchParams })
        return roles
    }

    public async getUsersIdsByRoleId({ roleId }: RoleId): Promise<UserId[]> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const usersIds: string[] = (await session
            .run(
                `
                MATCH (:Role {id: $roleId})<-[:HAS]-(userId:UserId)
                RETURN userId
                `,
                { roleId }
            ))
            .records
            ?.map(record => record.get('userId').properties.id)
        session.close()
        return usersIds.map(userId => ({ userId }))
    }

    public async createRole({ name, projectId }: CreateRoleRequest): Promise<Role> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const roleId: string = uuidv4()
        const role: Role = (await session
            .run(
                `
                MERGE (role:Role {id: $roleId, name: $name, projectId: $projectId})
                RETURN role
                `,
                { roleId, name, projectId }
            )
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.rolesEventsService.createRoleEvent({ error, role: null })
                throw new RpcException(error)
            }))
            .records[0]
            ?.get('role')
            .properties
        session.close()
        this.rolesEventsService.createRoleEvent({ role })
        return role
    }

    public async updateRole({ name, roleId }: RoleIdAndName): Promise<Role> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const role: Role = (await session
            .run(
                `
                MATCH (role:Role {id: $roleId})
                SET role.name = $name
                RETURN role
                `,
                { roleId, name }
            )
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.rolesEventsService.updateRoleEvent({ error, role: { id: roleId, name } })
                throw new RpcException(error)
            }))
            .records[0]
            ?.get('role')
            .properties
        session.close()
        if (!role) {
            const error: Error = {
                code: Status.NOT_FOUND,
                message: 'Role not found',
            }
            this.rolesEventsService.updateRoleEvent({ error, role: { id: roleId } })
            throw new RpcException(error)
        }
        this.rolesEventsService.updateRoleEvent({ role })
        return role
    }

    public async deleteRole({ roleId }: RoleId): Promise<any> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const result = (await session
            .run(
                `
                MATCH (r:Role {id: $roleId}) 
                WITH r, r.id as id, r.projectId as projectId, r.name as name 
                DELETE r RETURN id, name, projectId
                `,
                { roleId }
            )
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.rolesEventsService.deleteRoleEvent({ error, role: { id: roleId } })
                throw new RpcException(error)
            }))
            .records[0]
        session.close()
        if (!result) {
            const error: Error = {
                code: Status.NOT_FOUND,
                message: 'Role not found',
            }
            this.rolesEventsService.updateRoleEvent({ error, role: { id: roleId } })
            throw new RpcException(error)
        }
        const role: Role = {
            id: result.get('id'),
            projectId: result.get('projectId'),
            name: result.get('name'),
        }
        this.rolesEventsService.updateRoleEvent({ role })
        return role
    }

    public async addRoleToUser({ roleId, userId }: RoleIdAndUserId): Promise<Void> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const rel = (await session
            .run(
                `
                MATCH (role:Role {id: $roleId})
                MERGE (:UserId {id: $userId})-[rel:HAS]->(role)
                RETURN rel
                `,
                { roleId, userId }
            )
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.rolesEventsService.addRoleToUserEvent({ error, roleId, userId })
                throw new RpcException(error)
            }))
            .records[0]
            ?.get('rel')
            .properties
        session.close()
        if (!rel) {
            const error: Error = {
                code: Status.NOT_FOUND,
                message: 'Role not found',
            }
            this.rolesEventsService.addRoleToUserEvent({ error, roleId, userId })
            throw new RpcException(error)
        }
        this.rolesEventsService.addRoleToUserEvent({ roleId, userId })
        return {}
    }

    public async removeRoleFromUser({ roleId, userId }: RoleIdAndUserId): Promise<Void> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const rel = (await session
            .run(
                `
                MATCH (:Role {id: $roleId})<-[rel:HAS]-(:UserId {id: $userId})
                DELETE rel
                RETURN rel
                `,
                { roleId, userId }
            )
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.rolesEventsService.removeRoleFromUserEvent({ error, roleId, userId })
                throw new RpcException(error)
            }))
            .records[0]
            ?.get('rel')
            .properties
        session.close()
        if (!rel) {
            const error: Error = {
                code: Status.NOT_FOUND,
                message: 'Role not found',
            }
            this.rolesEventsService.addRoleToUserEvent({ error, roleId, userId })
            throw new RpcException(error)
        }
        this.rolesEventsService.addRoleToUserEvent({ roleId, userId })
        return {}
    }

}

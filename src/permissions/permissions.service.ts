import { Inject, Injectable } from '@nestjs/common'
import { Driver } from 'neo4j-driver'
import {
    Permission,
    PermissionId,
    PermissionIdAndRoleId,
    PermissionIdAndUserIdAndProjectId,
    RoleId,
    UserIdAndProjectId,
    Void,
    Bool
} from '../roles.pb'
import { session as neo4jSession } from 'neo4j-driver'
import { RpcException } from '@nestjs/microservices'

@Injectable()
export class PermissionsService {

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
            throw new RpcException({ message: 'Permission not found' })
        return permission
    }

    public async getPermissionsByRoleId(
        { roleId }: RoleId
    ): Promise<Permission[]> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const permission: Permission[] = (await session
            .run(
                `
                MATCH (permission:Permission)<-[:HAS]-(:Role {id: $roleId})
                RETURN permission
                `,
                { roleId }
            ))
            .records
            ?.map(record => record.get('permission').properties)
        session.close()
        if (!permission)
            throw new RpcException({ message: 'Permission not found' })
        return permission
    }

    public async getPermissionsByUserIdAndProjectId(
        { userId, projectId }: UserIdAndProjectId
    ): Promise<Permission[]> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const permissions: Permission[] = (await session
            .run(
                `
                MATCH (p:Permission)
                WHERE 
                    (p)<-[:HAS_IN_PROJECT {projectId: $projectId}]-(:UserId {id: $userId})
                    OR 
                    (p)<-[:HAS]-(:Role)<-[:HAS]-(:UserId {id: $userId})
                RETURN p
                `,
                { userId, projectId }
            ))
            .records
            ?.map(record => record.get('p').properties)
        session.close()
        return permissions
    }

    public async doesUserHavePermission(
        { permissionId, projectId, userId }: PermissionIdAndUserIdAndProjectId
    ): Promise<Bool> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const bool = !!(await session
            .run(
                `
                MATCH (p:Permission {id: $permissionId})
                WHERE 
                    (p)<-[:HAS_IN_PROJECT {projectId: $projectId}]-(:UserId {id: $userId})
                    OR 
                    (p)<-[:HAS]-(:Role)<-[:HAS]-(:UserId {id: $userId})
                RETURN p
                `,
                { permissionId, projectId, userId }
            ))
            .records
            .length
        session.close()
        return { bool }
    }

    public async doesRoleHavePermission(
        { permissionId, roleId }: PermissionIdAndRoleId
    ): Promise<Bool> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const bool = !!(await session
            .run(
                `
                MATCH (p:Permission {id: $permissionId})<-[:HAS]-(:Role {id: $roleId})
                RETURN p
                `,
                { permissionId, roleId }
            ))
            .records
            .length
        session.close()
        return { bool }
    }

    public async addPermissionToRole(
        { permissionId, roleId }: PermissionIdAndRoleId
    ): Promise<Void> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.WRITE })
        const permission: Permission = (await session
            .run(
                `
                MATCH (permission:Permission {id: $permissionId})
                MATCH (role:Role {id: $roleId})
                MERGE (role)-[rel:HAS]->(permission)
                RETURN permission
                `,
                { permissionId, roleId }
            ))
            .records[0]
            ?.get('permission')
            .properties
        if (!permission)
            throw new RpcException({ message: 'Query db error' })
        session.close()
        return {}
    }

    public async removePermissionFromRole(
        { permissionId, roleId }: PermissionIdAndRoleId
    ): Promise<Void> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.WRITE })
        const rel = (await session
            .run(
                `
                MATCH (:Permission {id: $roleId})<-[rel:HAS]-(:UserId {id: $userId})
                DELETE rel
                RETURN rel
                `,
                { permissionId, roleId }
            ))
            .records[0]
            ?.get('rel')
            .properties
        session.close()
        if (!rel)
            throw new RpcException({ message: 'Role hasn`t this permission' })
        return {}
    }

    public async addPermissionToUserInProject(
        { projectId, permissionId, userId }: PermissionIdAndUserIdAndProjectId
    ): Promise<Void> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.WRITE })
        const rel = (await session
            .run(
                `
                MATCH (permission:Permission {id: $permissionId})
                MERGE (:UserId {id: $userId})-[rel:HAS_IN_PROJECT {projectId: $projectId}]->(permission)
                RETURN rel
                `,
                { projectId, permissionId, userId }
            ))
            .records[0]
            ?.get('rel')
            .properties
        session.close()
        if (!rel)
            throw new RpcException({ message: 'Permission not found' })
        return {}
    }

    public async removePermissionFromUserInProject(
        { projectId, permissionId, userId }: PermissionIdAndUserIdAndProjectId
    ): Promise<Void> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.WRITE })
        const rel = (await session
            .run(
                `
                MATCH (:Permission {id: $roleId})<-[rel:HAS]-(:UserId {id: $userId})
                DELETE rel
                RETURN rel
                `,
                { projectId, permissionId, userId }
            ))
            .records[0]
            ?.get('rel')
            .properties
        session.close()
        if (!rel)
            throw new RpcException({ message: 'User hasn`t this permission' })
        return {}
    }

}

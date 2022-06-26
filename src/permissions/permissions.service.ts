import { Inject, Injectable } from '@nestjs/common'
import { Driver } from 'neo4j-driver'
import {
    Permission, PermissionId, PermissionIdAndRoleId, PermissionIdAndUserId, RoleId, UserId, Void,
} from '../roles.pb'
import { session as neo4jSession } from 'neo4j-driver'
import { RpcException } from '@nestjs/microservices'

@Injectable()
export class PermissionsService {

    @Inject('DATA_SOURCE')
    private readonly neo4jDriver: Driver

    public async getPermissionById({ permissionId }: PermissionId): Promise<Permission> {
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

    public async getPermissionsByRoleId({ roleId }: RoleId): Promise<Permission[]> {
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

    public async getPermissionsByUserId({ userId }: UserId): Promise<Permission[]> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const permissions: Permission[] = (await session
            .run(
                `
                MATCH (p:Permission)
                WHERE 
                    (p)<-[:HAS]-(:UserId {id: $userId}) 
                    OR 
                    (p)<-[:HAS]-(:Role)<-[:HAS]-(:UserId {id: $userId})
                RETURN p
                `,
                { userId }
            ))
            .records
            ?.map(record => record.get('p').properties)
        session.close()
        return permissions
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

    public async addPermissionToUser({ permissionId, userId }: PermissionIdAndUserId): Promise<Void> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.WRITE })
        const rel = (await session
            .run(
                `
                MATCH (permission:Permission {id: $permissionId})
                MERGE (:UserId {id: $userId})-[rel:HAS]->(permission)
                RETURN rel
                `,
                { permissionId, userId }
            ))
            .records[0]
            ?.get('rel')
            .properties
        session.close()
        if (!rel)
            throw new RpcException({ message: 'Permission not found' })
        return {}
    }

    public async removePermissionFromUser({ permissionId, userId }: PermissionIdAndUserId): Promise<Void> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.WRITE })
        const rel = (await session
            .run(
                `
                MATCH (:Permission {id: $roleId})<-[rel:HAS]-(:UserId {id: $userId})
                DELETE rel
                RETURN rel
                `,
                { permissionId, userId }
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

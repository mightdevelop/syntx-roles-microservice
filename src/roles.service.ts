import { Inject, Injectable } from '@nestjs/common'
import { Driver } from 'neo4j-driver'
import {
    CreateRoleRequest,
    GroupId,
    Role,
    RoleByNameRequest,
    RoleId,
    RoleIdAndName,
    RoleIdAndUserId,
    UserId,
    Void,
} from './roles.pb'
import { session as neo4jSession } from 'neo4j-driver'
import { RpcException } from '@nestjs/microservices'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class RolesService {

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
            ))
            .records[0]
            ?.get('role')
            .properties
        session.close()
        if (!role)
            throw new RpcException({ message: 'Role not found' })
        return role
    }

    public async getRoleByName({ roleName }: RoleByNameRequest): Promise<Role> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const role: Role = (await session
            .run(
                `
                MATCH (role:Role {name: $roleName})
                RETURN role
                `,
                { roleName }
            ))
            .records[0]
            ?.get('role')
            .properties
        session.close()
        if (!role)
            throw new RpcException({ message: 'Role not found' })
        return role
    }

    public async getRolesByUserId({ userId }: UserId): Promise<Role[]> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const roles: Role[] = (await session
            .run(
                `
                MATCH (role:Role)<-[:HAS]-(:UserId {id: $userId})
                RETURN role
                `,
                { userId }
            ))
            .records
            ?.map(record => record.get('role').properties)
        session.close()
        return roles
    }

    public async getRolesByGroupId({ groupId }: GroupId): Promise<Role[]> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const roles: Role[] = (await session
            .run(
                `
                MATCH (role:Role {groupId: $groupId})
                RETURN role
                `,
                { groupId }
            ))
            .records
            ?.map(record => record.get('role').properties)
        session.close()
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

    public async createRole({ name, groupId }: CreateRoleRequest): Promise<Role> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const roleId: string = uuidv4()
        const role: Role = (await session
            .run(
                `
                MERGE (role:Role {id: $roleId, name: $name, groupId: $groupId})
                RETURN role
                `,
                { roleId, name, groupId }
            ))
            .records[0]
            ?.get('role')
            .properties
        session.close()
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
            ))
            .records[0]
            ?.get('role')
            .properties
        session.close()
        if (!role)
            throw new RpcException({ message: 'Role not found' })
        return role
    }

    public async deleteRole({ roleId }: RoleId): Promise<any> {
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        const result = (await session
            .run(
                `
                MATCH (r:Role {id: $roleId}) 
                WITH r, r.id as id, r.groupId as groupId, r.name as name 
                DELETE r RETURN id, name
                `,
                { roleId }
            ))
            .records[0]
        session.close()
        if (!result)
            throw new RpcException({ message: 'Role not found' })
        const role: Role = {
            id: result.get('id'),
            groupId: result.get('groupId'),
            name: result.get('name'),
        }
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
            ))
            .records[0]
            ?.get('rel')
            .properties
        session.close()
        if (!rel)
            throw new RpcException({ message: 'Role not found' })
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
            ))
            .records[0]
            ?.get('rel')
            .properties
        session.close()
        if (!rel)
            throw new RpcException({ message: 'User hasn`t this role' })
        return {}
    }

}

import { Inject, Module, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PermissionsController } from './permissions.controller'
import { PermissionsService } from './permissions.service'
import { driver, auth, Driver, session as neo4jSession } from 'neo4j-driver'
import { permissionsConfig } from './permissions.config'

@Module({
    exports: [ PermissionsService ],
    controllers: [ PermissionsController ],
    providers: [
        PermissionsService,
        {
            inject: [ ConfigService ],
            provide: 'DATA_SOURCE',
            useFactory: async (config: ConfigService) => driver(
                config.get('NEO4J_URL'),
                auth.basic(
                    config.get('NEO4J_USERNAME'),
                    config.get('NEO4J_PASSWORD')
                )
            ),
        }
    ],
})
export class PermissionsModule implements OnModuleInit {

    @Inject('DATA_SOURCE')
    private readonly neo4jDriver: Driver

    // Generate permissions from permissions.yaml
    async onModuleInit() {
        const permissions = permissionsConfig()
        const session = this.neo4jDriver.session({ defaultAccessMode: neo4jSession.READ })
        for (const [ permissionId, permissionName ] of Object.entries(permissions)) {
            await session.run(
                'MERGE (perm:Permission {id: $permissionId, name: $permissionName})',
                { permissionId: +permissionId, permissionName }
            )
        }

        session.close()
    }

}

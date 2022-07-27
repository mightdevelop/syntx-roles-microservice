import { Inject, Module, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PermissionsController } from './permissions.controller'
import { PermissionsService } from './permissions.service'
import { driver, auth, Driver, session as neo4jSession } from 'neo4j-driver'
import { permissionsConfig } from './permissions.config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { join } from 'path'
import { EVENTBUS_PACKAGE_NAME } from 'src/pb/roles-events.pb'

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
    imports: [
        ClientsModule.register([
            {
                name: EVENTBUS_PACKAGE_NAME,
                transport: Transport.GRPC,
                options: {
                    url: '127.0.0.1:50057',
                    package: EVENTBUS_PACKAGE_NAME,
                    protoPath: join(
                        __dirname, '..', '..', 'node_modules', 'syntx-protos', 'eventbus', 'roles-events.proto'
                    ),
                }
            },
        ]),
    ]
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

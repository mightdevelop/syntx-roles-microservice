import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RolesController } from './roles.controller'
import { RolesService } from './roles.service'
import { driver, auth } from 'neo4j-driver'
import { PermissionsModule } from './permissions/permissions.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { EVENTBUS_PACKAGE_NAME } from './pb/roles-events.pb'
import { join } from 'path'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [ `@${process.env.NODE_ENV}.env`, '@.env' ],
            isGlobal: true
        }),
        PermissionsModule,
        ClientsModule.register([
            {
                name: EVENTBUS_PACKAGE_NAME,
                transport: Transport.GRPC,
                options: {
                    url: '127.0.0.1:50057',
                    package: EVENTBUS_PACKAGE_NAME,
                    protoPath: join(
                        __dirname, '..', 'node_modules', 'syntx-protos', 'eventbus', 'roles-events.proto'
                    ),
                }
            },
        ]),
    ],
    controllers: [ RolesController ],
    providers: [
        RolesService,
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
export class RolesModule {}

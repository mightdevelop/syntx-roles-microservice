import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PermissionsController } from './permissions.controller'
import { PermissionsService } from './permissions.service'
import { driver, auth } from 'neo4j-driver'

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
export class PermissionsModule {}

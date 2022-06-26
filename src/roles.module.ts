import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RolesController } from './roles.controller'
import { RolesService } from './roles.service'
import { driver, auth } from 'neo4j-driver'
import { PermissionsModule } from './permissions/permissions.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [ `@${process.env.NODE_ENV}.env`, '@.env' ],
            isGlobal: true
        }),
        PermissionsModule
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

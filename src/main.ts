import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { join } from 'path'
import { RolesModule } from './roles.module'
import { ROLES_PACKAGE_NAME } from './pb/roles.pb'

async function bootstrap() {
    const app = await NestFactory.createMicroservice(
        RolesModule,
        {
            transport: Transport.GRPC,
            options: {
                url: process.env.APP_URL,
                package: ROLES_PACKAGE_NAME,
                protoPath: join(__dirname, '..', 'node_modules', 'syntx-protos', 'roles', 'roles.proto'),
            }
        },
    )
    await app.listen()
    console.log('Roles service started at ' + process.env.APP_URL)
}
bootstrap()
import { Module } from '@nestjs/common'
import { AdminModule as AdminJSModule } from '@adminjs/nestjs'

import * as AdminJSTypeorm from '@adminjs/typeorm'
import AdminJS from 'adminjs'

import { UsersModule } from '../users/users.module'
import { UsersService } from '../users/users.service'
import { AdminJSOptionsFactory } from './adminjs-options.factory'
import { HashService } from 'src/services/hash/hash.service'

AdminJS.registerAdapter(AdminJSTypeorm)

@Module({
  providers: [HashService],
  exports: [HashService],
})
class AdminJsImportsModule {}

@Module({
  imports: [
    AdminJSModule.createAdminAsync({
      imports: [UsersModule, AdminJsImportsModule],
      inject: [UsersService, HashService],
      useFactory: (usersService: UsersService, hashService: HashService) =>
        new AdminJSOptionsFactory(usersService, hashService).create(),
    }),
  ],
})
export class AdminModule {}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { JoiPipeModule } from 'nestjs-joi'
import { DatabaseModule } from 'src/database/database.module'
import { AllExceptionsFilter } from 'src/filters/all-exception.filter'
import { LoggerMiddleware } from 'src/middleware/logger.middleware'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CommentsModule } from './comments/comments.module'
import { PostsModule } from './posts/posts.module'
import { UsersModule } from './users/users.module'

import { AdminModule } from './admin/admin.module'

@Module({
  imports: [AuthModule, CommentsModule, PostsModule, UsersModule, JoiPipeModule, DatabaseModule, AdminModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}

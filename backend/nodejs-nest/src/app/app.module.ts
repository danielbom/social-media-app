import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JoiPipeModule } from 'nestjs-joi';
import { DatabaseModule } from 'src/database/database.module';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    CommentsModule,
    PostsModule,
    UsersModule,
    JoiPipeModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

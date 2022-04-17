import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { JoiPipeModule } from 'nestjs-joi';
import { DatabaseModule } from 'src/database/database.module';

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
export class AppModule {}

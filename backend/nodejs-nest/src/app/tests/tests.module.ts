import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Comment } from 'src/entities/comment.entity'
import { Post } from 'src/entities/post.entity'
import { User } from 'src/entities/user.entity'
import { HashService } from 'src/services/hash/hash.service'
import { env } from 'src/environment'

import { TestsController } from './tests.controller'
import { TestsService } from './tests.service'

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Post])],
  controllers: env.app.isDevelopment ? [TestsController] : [],
  providers: [TestsService, HashService],
  exports: [TestsService],
})
export class TestsModule {}

import { Module } from '@nestjs/common';
import { AdminModule as AdminXModule } from '@adminjs/nestjs';

import * as AdminJSTypeorm from '@adminjs/typeorm';
import AdminJS, { RecordActionResponse } from 'adminjs';

import { Comment } from 'src/entities/comment.entity';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { HashService } from 'src/services/hash/hash.service';

AdminJS.registerAdapter(AdminJSTypeorm);

const DEFAULT_ADMIN = {
  email: 'admin',
  password: 'admin',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

@Module({
  providers: [HashService],
  exports: [HashService],
})
class AdminJsImportsModule {}

@Module({
  imports: [
    AdminXModule.createAdminAsync({
      imports: [AdminJsImportsModule],
      inject: [HashService],
      useFactory: (hashService: HashService) => {
        return {
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              { resource: Comment },
              { resource: Post },
              {
                resource: User,
                options: {
                  new: {
                    before: async (request: RecordActionResponse) => {
                      request.payload.password = await hashService.hash(
                        request.payload.password,
                      );
                    },
                  },
                },
              },
            ],
          },
          auth: {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: 'secret',
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: 'secret',
          },
        };
      },
    }),
  ],
})
export class AdminModule {}

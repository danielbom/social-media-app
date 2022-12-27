import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Comment } from 'src/entities/comment.entity';

import { CurrentAdmin, RecordActionResponse } from 'adminjs';
import { UsersService } from '../users/users.service';
import { AdminModuleOptions } from '@adminjs/nestjs';
import { HttpException } from '@nestjs/common';
import { env } from 'src/environment';
import { HashService } from 'src/services/hash/hash.service';
import { Role } from 'src/entities/role.enum';

export class AdminJSOptionsFactory {
  constructor(private usersService: UsersService, private hashService: HashService) {}

  async create(): Promise<AdminModuleOptions> {
    return {
      shouldBeInitialized: env.adminJs.enable,
      adminJsOptions: {
        rootPath: '/admin',
        resources: [
          { 
            resource: Comment,
          },
          { 
            resource: Post,
          },
          {
            resource: User,
            options: {
              new: {
                before: async (request: RecordActionResponse) => {
                  request.payload.password = await this.hashService.hash(
                    request.payload.password,
                  );
                },
              },
            },
          },
        ],
      },
      auth: {
        authenticate: (username, password) =>
          this.autenticate(username, password),
        cookieName: env.adminJs.auth.cookieName,
        cookiePassword: env.adminJs.auth.cookiePassword,
      },
      sessionOptions: {
        resave: true,
        saveUninitialized: true,
        secret: env.adminJs.session.secret,
      },
    };
  }

  private async autenticate(
    username: string,
    password: string,
  ): Promise<CurrentAdmin | null> {
    try {
      const auth = await this.usersService.getAuthenticated({
        username,
        password,
      });
      
      const user = await this.usersService.getUserOrThrow({
        where: { id: auth.id },
      });

      if (user.role !== Role.ADMIN) return null

      return {
        id: user.id,
        email: user.username,
      };
    } catch (error) {
      if (error instanceof HttpException) return null;

      throw error;
    }
  }
}

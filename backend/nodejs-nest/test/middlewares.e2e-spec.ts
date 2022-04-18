import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JoiPipe } from 'nestjs-joi';
import request from 'supertest';

import { AppModule } from 'src/app/app.module';
import { AuthService } from 'src/app/auth/auth.service';
import { CommentsService } from 'src/app/comments/comments.service';
import { PostsService } from 'src/app/posts/posts.service';
import { UsersService } from 'src/app/users/users.service';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

function mockService<T extends { prototype: Record<string, any> }>(Cls: T) {
  const props = Object.getOwnPropertyNames(Cls.prototype);

  for (const prop of props) {
    if (prop === 'constructor') continue;

    const value = Cls.prototype[prop];
    if (typeof value === 'function') {
      Cls.prototype[prop] = jest.fn();
    }
  }
}

// Database: off
Reflect.deleteMetadata('imports', DatabaseModule);

// Services: off
mockService(AuthService);
mockService(CommentsService);
mockService(PostsService);
mockService(UsersService);
mockService(JwtService);

// Middleware: off
const middlewareSpy = {
  joi: jest.spyOn(JoiPipe.prototype, 'transform'),
  jwt: jest.spyOn(JwtAuthGuard.prototype, 'canActivate'),
};

middlewareSpy.jwt.mockImplementation(() => true);

type MiddlewareSpy = typeof middlewareSpy;

function middlewareMustBeCalled(
  middlewareCount: Partial<Record<keyof MiddlewareSpy, number>>,
) {
  expect(middlewareSpy.joi).toBeCalledTimes(middlewareCount.joi ?? 0);
  expect(middlewareSpy.jwt).toBeCalledTimes(middlewareCount.jwt ?? 0);
}

describe('Middleware', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          logging: false,
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/auth/login (POST)', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: '123', password: '12345678' });
    middlewareMustBeCalled({ joi: 1 });
  });

  it('/auth/register (POST)', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: '123', password: '12345678' })
      .expect(HttpStatus.CREATED);
    middlewareMustBeCalled({ joi: 1 });
  });

  it('/comments (POST)', async () => {
    await request(app.getHttpServer())
      .post('/comments')
      .send({ postId: 'y', content: 'x' })
      .expect(HttpStatus.CREATED);
    middlewareMustBeCalled({ joi: 1, jwt: 1 });
  });

  it('/posts (POST)', async () => {
    await request(app.getHttpServer())
      .post('/posts')
      .send({ content: 'x' })
      .expect(HttpStatus.CREATED);
    middlewareMustBeCalled({ joi: 2, jwt: 1 });
  });

  it('/posts/x (PATCH)', async () => {
    await request(app.getHttpServer())
      .patch('/posts/x')
      .send({ content: 'x' })
      .expect(HttpStatus.OK);
    middlewareMustBeCalled({ joi: 3, jwt: 1 });
  });

  it('/users (POST)', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ username: '123', password: '12345678' })
      .expect(HttpStatus.CREATED);
    middlewareMustBeCalled({ joi: 1, jwt: 1 });
  });

  it('/users (PATCH)', async () => {
    await request(app.getHttpServer()).patch('/users/x').expect(HttpStatus.OK);
    middlewareMustBeCalled({ joi: 2, jwt: 1 });
  });
});

import { describe, beforeEach, it, expect, afterEach, vi } from 'vitest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoiPipe } from 'nestjs-joi';
import { AppModule } from 'src/app/app.module';
import { AuthService } from 'src/app/auth/auth.service';
import { PasswordJwtStrategy } from 'src/app/auth/strategies/passport-jwt.strategy';
import { CommentsService } from 'src/app/comments/comments.service';
import { PostsService } from 'src/app/posts/posts.service';
import { UsersService } from 'src/app/users/users.service';
import { DatabaseModule } from 'src/database/database.module';
import { Role } from 'src/entities/role.enum';
import { User } from 'src/entities/user.entity';
import { env } from 'src/environment';
import { RolesGuard } from 'src/guards/roles.guard';
import { MockConnection } from 'src/tests/mock-connection';
import { MockFactory } from 'src/tests/mock-factory';
import request from 'supertest';
import { Connection } from 'typeorm';

env.jwt.secret = 'x';
const token = new JwtService({}).sign({ sub: 'x' }, { secret: env.jwt.secret });
const authorization = 'Bearer ' + token;

// Database: off
Reflect.deleteMetadata('imports', DatabaseModule);

// Services: off
MockFactory.pollutePrototype(AuthService);
MockFactory.pollutePrototype(CommentsService);
MockFactory.pollutePrototype(PostsService);
MockFactory.pollutePrototype(UsersService);
MockFactory.pollutePrototype(JwtService);

// Middleware: off
const middlewareSpy = {
  joi: vi.spyOn(JoiPipe.prototype, 'transform'),
  role: vi.spyOn(RolesGuard.prototype, 'canActivate'),
  jwt: vi.spyOn(PasswordJwtStrategy.prototype, 'validate'),
};

middlewareSpy.role.mockImplementation(() => true);
middlewareSpy.jwt.mockImplementation(async () => ({ role: 'admin' } as User));

type MiddlewareSpy = typeof middlewareSpy;

function middlewareMustBeCalled(
  middlewareCount: Partial<Record<keyof MiddlewareSpy, number>>,
) {
  expect(middlewareSpy.joi).toBeCalledTimes(middlewareCount.joi ?? 0);
  expect(middlewareSpy.jwt).toBeCalledTimes(middlewareCount.jwt ?? 0);
  expect(middlewareSpy.role).toBeCalledTimes(middlewareCount.role ?? 0);
}

describe('Middleware', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot({}), AppModule],
    })
      .overrideProvider(Connection)
      .useValue(new MockConnection())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    middlewareSpy.joi.mockClear();
    middlewareSpy.jwt.mockClear();
    middlewareSpy.role.mockClear();
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

  it('/comments (GET)', async () => {
    await request(app.getHttpServer())
      .get('/comments')
      .set('Authorization', authorization)
      .expect(HttpStatus.OK);
    middlewareMustBeCalled({ joi: 2, role: 1, jwt: 1 });
  });

  it('/comments (POST)', async () => {
    await request(app.getHttpServer())
      .post('/comments')
      .set('Authorization', authorization)
      .send({ postId: 'y', content: 'x' })
      .expect(HttpStatus.CREATED);
    middlewareMustBeCalled({ joi: 2, role: 1, jwt: 1 });
  });

  it('/comments/x (PATCH)', async () => {
    await request(app.getHttpServer())
      .patch('/comments/x')
      .set('Authorization', authorization)
      .send({ content: 'x' })
      .expect(HttpStatus.OK);
    middlewareMustBeCalled({ joi: 3, role: 1, jwt: 1 });
  });

  it('/comments/x (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete('/comments/x')
      .set('Authorization', authorization)
      .expect(HttpStatus.NO_CONTENT);
    middlewareMustBeCalled({ joi: 2, role: 1, jwt: 1 });
  });

  it('/posts (GET)', async () => {
    await request(app.getHttpServer())
      .get('/posts')
      .set('Authorization', authorization)
      .expect(HttpStatus.OK);
    middlewareMustBeCalled({ joi: 1, role: 1, jwt: 1 });
  });

  it('/posts (POST)', async () => {
    await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', authorization)
      .send({ content: 'x' })
      .expect(HttpStatus.CREATED);
    middlewareMustBeCalled({ joi: 2, role: 1, jwt: 1 });
  });

  it('/posts/x (PATCH)', async () => {
    await request(app.getHttpServer())
      .patch('/posts/x')
      .set('Authorization', authorization)
      .send({ content: 'x' })
      .expect(HttpStatus.OK);
    middlewareMustBeCalled({ joi: 3, role: 1, jwt: 1 });
  });

  it('/posts/x (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete('/posts/x')
      .set('Authorization', authorization)
      .expect(HttpStatus.NO_CONTENT);
    middlewareMustBeCalled({ joi: 2, role: 1, jwt: 1 });
  });

  it('/users (GET)', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', authorization)
      .expect(HttpStatus.OK);
    middlewareMustBeCalled({ role: 1, jwt: 1 });
  });

  it('/users (POST)', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', authorization)
      .send({ username: '123', password: '12345678', role: Role.USER })
      .expect(HttpStatus.CREATED);
    middlewareMustBeCalled({ joi: 1, role: 1, jwt: 1 });
  });

  it('/users/x (PATCH)', async () => {
    await request(app.getHttpServer())
      .patch('/users/x')
      .set('Authorization', authorization)
      .send({})
      .expect(HttpStatus.OK);
    middlewareMustBeCalled({ joi: 2, role: 1, jwt: 1 });
  });

  it('/users/x (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete('/users/x')
      .set('Authorization', authorization)
      .expect(HttpStatus.NO_CONTENT);
    middlewareMustBeCalled({ joi: 1, role: 1, jwt: 1 });
  });
});

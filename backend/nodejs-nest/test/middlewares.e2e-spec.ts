import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoiPipe } from 'nestjs-joi';
import { AppModule } from 'src/app/app.module';
import { AuthService } from 'src/app/auth/auth.service';
import { CommentsService } from 'src/app/comments/comments.service';
import { PostsService } from 'src/app/posts/posts.service';
import { UsersService } from 'src/app/users/users.service';
import { DatabaseModule } from 'src/database/database.module';
import { env } from 'src/environment';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { MockConnection } from 'src/tests/mock-connection';
import { MockFactory } from 'src/tests/mock-factory';
import request from 'supertest';
import { Connection } from 'typeorm';

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

env.jwt.secret = 'x';

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
    await request(app.getHttpServer()).get('/comments').expect(HttpStatus.OK);
    middlewareMustBeCalled({ joi: 1, jwt: 1 });
  });

  it('/comments (POST)', async () => {
    await request(app.getHttpServer())
      .post('/comments')
      .send({ postId: 'y', content: 'x' })
      .expect(HttpStatus.CREATED);
    middlewareMustBeCalled({ joi: 2, jwt: 1 });
  });

  it('/comments/x (PATCH)', async () => {
    await request(app.getHttpServer())
      .patch('/comments/x')
      .send({ content: 'x' })
      .expect(HttpStatus.OK);
    middlewareMustBeCalled({ joi: 3, jwt: 1 });
  });

  it('/comments/x (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete('/comments/x')
      .expect(HttpStatus.NO_CONTENT);
    middlewareMustBeCalled({ joi: 2, jwt: 1 });
  });

  it('/posts (GET)', async () => {
    await request(app.getHttpServer()).get('/posts').expect(HttpStatus.OK);
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

  it('/posts/x (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete('/posts/x')
      .expect(HttpStatus.NO_CONTENT);
    middlewareMustBeCalled({ joi: 2, jwt: 1 });
  });

  it('/users (GET)', async () => {
    await request(app.getHttpServer()).get('/users').expect(HttpStatus.OK);
    middlewareMustBeCalled({ jwt: 1 });
  });

  it('/users (POST)', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ username: '123', password: '12345678' })
      .expect(HttpStatus.CREATED);
    middlewareMustBeCalled({ joi: 1, jwt: 1 });
  });

  it('/users/x (PATCH)', async () => {
    await request(app.getHttpServer())
      .patch('/users/x')
      .send({})
      .expect(HttpStatus.OK);
    middlewareMustBeCalled({ joi: 2, jwt: 1 });
  });

  it('/users/x (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete('/users/x')
      .expect(HttpStatus.NO_CONTENT);
    middlewareMustBeCalled({ joi: 1, jwt: 1 });
  });
});

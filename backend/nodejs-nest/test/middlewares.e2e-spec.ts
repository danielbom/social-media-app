import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JoiPipe } from 'nestjs-joi';
import { AppModule } from 'src/app/app.module';
import { AuthService } from 'src/app/auth/auth.service';
import { CommentsService } from 'src/app/comments/comments.service';
import { PostsService } from 'src/app/posts/posts.service';
import { UsersService } from 'src/app/users/users.service';
import { DatabaseModule } from 'src/database/database.module';
import request from 'supertest';

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

const middlewareSpy = {
  joi: jest.spyOn(JoiPipe.prototype, 'transform'),
};

type MiddlewareSpy = typeof middlewareSpy;

function middlewareMustBeCalled(
  middlewareCount: Partial<Record<keyof MiddlewareSpy, number>>,
) {
  expect(middlewareSpy.joi).toBeCalledTimes(middlewareCount.joi ?? 0);
}

describe('Middleware', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', async () => {
    await request(app.getHttpServer()).get('/').expect(200).expect('Healthy!');
  });

  describe('/auth', () => {
    it('/auth/login (POST)', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: '123', password: '12345678' })
        .expect(HttpStatus.OK);
      middlewareMustBeCalled({ joi: 1 });
    });

    it('/auth/register (POST)', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: '123', password: '12345678' })
        .expect(HttpStatus.CREATED);
      middlewareMustBeCalled({ joi: 1 });
    });
  });

  describe('/comments', () => {
    it('/comments (POST)', async () => {
      await request(app.getHttpServer())
        .post('/comments')
        .send({ postId: 'y', content: 'x' })
        .expect(HttpStatus.CREATED);
      middlewareMustBeCalled({ joi: 1 });
    });
  });

  describe('/posts', () => {
    it('/posts (POST)', async () => {
      await request(app.getHttpServer())
        .post('/posts')
        .send({ content: 'x' })
        .expect(HttpStatus.CREATED);
      middlewareMustBeCalled({ joi: 1 });
    });
    it('/users (PATCH)', async () => {
      await request(app.getHttpServer())
        .patch('/users/x')
        .expect(HttpStatus.OK);
      middlewareMustBeCalled({ joi: 2 });
    });
  });

  describe('/users', () => {
    it('/users (POST)', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ username: '123', password: '12345678' })
        .expect(HttpStatus.CREATED);
      middlewareMustBeCalled({ joi: 1 });
    });
    it('/users (PATCH)', async () => {
      await request(app.getHttpServer())
        .patch('/users/x')
        .expect(HttpStatus.OK);
      middlewareMustBeCalled({ joi: 2 });
    });
  });
});

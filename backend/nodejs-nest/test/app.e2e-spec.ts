import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { env } from 'src/environment';
import request from 'supertest';

import { AppModule } from './../src/app/app.module';
import { MemoryTypeOrmModule } from './lib/memory-typeorm-module';

env.jwt.secret = 'x';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MemoryTypeOrmModule(), AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Healthy!');
  });
});

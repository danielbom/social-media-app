import { describe, beforeEach, it } from 'vitest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { env } from 'src/environment';
import request from 'supertest';
import { Connection } from 'typeorm';

import { MockConnection } from '../src/tests/mock-connection';
import { AppModule } from './../src/app/app.module';

env.jwt.secret = 'x';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(Connection)
      .useValue(new MockConnection())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Healthy!');
  });
});

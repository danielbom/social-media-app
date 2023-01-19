import { describe, it, beforeEach, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppWsGateway } from './app-ws.gateway';

describe('PostsGateway', () => {
  let gateway: AppWsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppWsGateway],
    }).compile();

    gateway = module.get<AppWsGateway>(AppWsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

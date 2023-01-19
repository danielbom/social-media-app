import { Mock } from 'vitest';
import { MockFactory } from './mock-factory';

export class MockService {
  static create<S>(Service: { prototype: any }): { [K in keyof S]: Mock } {
    return MockFactory.create(Service.prototype) as any;
  }
}

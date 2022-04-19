import { MockFactory } from './mock-factory';

export class MockService {
  static create<S>(Service: { prototype: any }): { [K in keyof S]: jest.Mock } {
    return MockFactory.create(Service.prototype) as any;
  }
}

export class MockService {
  static create<S>(Service: { prototype: any }): { [K in keyof S]: jest.Mock } {
    const mock: any = {};
    for (const key of Object.getOwnPropertyNames(Service.prototype)) {
      mock[key] = jest.fn();
    }
    mock.constructor = jest.fn(() => mock);
    return mock;
  }
}

export class MockFactory {
  static create<T>(obj: any): { [K in keyof T]: jest.Mock } {
    const mock: any = {};
    for (const key of Object.getOwnPropertyNames(obj)) {
      mock[key] = jest.fn();
    }
    return mock;
  }
}

export class MockFactory {
  static create<T>(obj: any): { [K in keyof T]: jest.Mock } {
    const mock: any = {};
    for (const key of Object.getOwnPropertyNames(obj)) {
      mock[key] = jest.fn();
    }
    return mock;
  }

  static pollutePrototype<T extends { prototype: Record<string, any> }>(
    Cls: T,
  ) {
    const props = Object.getOwnPropertyNames(Cls.prototype);

    for (const prop of props) {
      if (prop === 'constructor') continue;

      const value = Cls.prototype[prop];
      if (typeof value === 'function') {
        Cls.prototype[prop] = jest.fn();
      }
    }

    jest
      .spyOn(Cls.prototype, 'constructor')
      .mockImplementation(function self() {
        return this;
      });
  }
}

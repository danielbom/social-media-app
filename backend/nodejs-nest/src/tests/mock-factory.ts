import { vi, Mock } from 'vitest';

export class MockFactory {
  static create<T>(obj: any): { [K in keyof T]: Mock } {
    const mock: any = {};
    for (const key of Object.getOwnPropertyNames(obj)) {
      mock[key] = vi.fn();
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
        Cls.prototype[prop] = vi.fn();
      }
    }

    vi.spyOn(Cls.prototype, 'constructor').mockImplementation(function self() {
      return this;
    });
  }
}

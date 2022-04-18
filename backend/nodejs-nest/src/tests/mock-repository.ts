import { Repository } from 'typeorm';

type IMockRepository<T, R = Repository<T>> = {
  [K in keyof R]: R[K] extends (...args: infer A) => infer O
    ? jest.Mock<O, A>
    : never;
};

export class MockRepository {
  static create<T>(): IMockRepository<T> {
    const mock: any = {};
    for (const key of Object.getOwnPropertyNames(Repository.prototype)) {
      mock[key] = jest.fn();
    }
    return mock;
  }
}

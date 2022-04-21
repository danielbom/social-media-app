import { Repository } from 'typeorm';
import { MockFactory } from './mock-factory';

export type IMockRepository<T, R = Repository<T>> = {
  [K in keyof R]: R[K] extends (...args: infer A) => infer O
    ? jest.Mock<O, A>
    : never;
};

export class MockRepository {
  static create<T>(): IMockRepository<T> {
    return MockFactory.create(Repository.prototype) as any;
  }
}

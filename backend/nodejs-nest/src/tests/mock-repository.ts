import { ObjectLiteral, Repository } from 'typeorm';
import { Mock } from 'vitest';
import { MockFactory } from './mock-factory';

export type IMockRepository<T extends ObjectLiteral, R = Repository<T>> = {
  [K in keyof R]: R[K] extends (...args: infer A) => infer O
    ? Mock<A, O>
    : never;
};

export class MockRepository {
  static create<T extends ObjectLiteral>(): IMockRepository<T> {
    return MockFactory.create(Repository.prototype) as any;
  }
}

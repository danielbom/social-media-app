import Joi from 'joi';
import { getClassSchema } from 'nestjs-joi';

export interface Constructor<T = any> extends Function {
  new (...args: unknown[]): T;
}

export class TestSchema {
  constructor(private schema: Joi.Schema) {}

  static fromClass(type: Constructor) {
    return new TestSchema(getClassSchema(type));
  }

  mustWorks(value: any) {
    const response = this.schema.validate(value);
    expect(Joi.isError(response.error)).toBeFalsy();
    return response;
  }

  mustFail(value: any) {
    const response = this.schema.validate(value);
    expect(Joi.isError(response.error)).toBeTruthy();
    return response;
  }
}

import Joi from 'joi';
import { getClassSchema } from 'nestjs-joi';

export interface Constructor<T = any> extends Function {
  new (...args: unknown[]): T;
}

export class TestSchema {
  constructor(private schema: Joi.Schema) {}

  static fromClass(type: Constructor): TestSchema {
    return new TestSchema(getClassSchema(type));
  }

  mustWorks(value: any): Joi.ValidationResult {
    const result = this.schema.validate(value);
    expect(Joi.isError(result.error)).toBeFalsy();
    return result;
  }

  mustFail(value: any): Joi.ValidationResult {
    const result = this.schema.validate(value);
    try {
      expect(Joi.isError(result.error)).toBeTruthy();
    } catch (error) {
      console.error(result);
      throw error;
    }
    return result;
  }
}

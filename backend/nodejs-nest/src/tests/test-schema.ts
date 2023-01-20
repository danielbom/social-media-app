import Joi from 'joi'
import { getClassSchema } from 'nestjs-joi'
import { expect } from 'vitest'

export interface Constructor<T = any> extends Function {
  new (...args: unknown[]): T
}

export class TestSchema {
  constructor(private schema: Joi.Schema) {}

  static fromClass(type: Constructor): TestSchema {
    return new TestSchema(getClassSchema(type))
  }

  mustWorks(value: any, options?: Joi.ValidationOptions): Joi.ValidationResult {
    const result = this.schema.validate(value, options)
    try {
      expect(result.error).not.toBeDefined()
    } catch (error) {
      console.error(value, result.error)
      throw error
    }
    return result
  }

  mustFail(value: any, options?: Joi.ValidationOptions): Joi.ValidationResult {
    const result = this.schema.validate(value, options)
    try {
      expect(result.error).toBeDefined()
    } catch (error) {
      console.error(value, result.value)
      throw error
    }
    return result
  }

  mustMatch(value: any, output: any, options?: Joi.ValidationOptions): void {
    const result = this.mustWorks(value, options)
    try {
      expect(result.value).toStrictEqual(output)
    } catch (error) {
      console.error(value, result)
      throw error
    }
  }
}

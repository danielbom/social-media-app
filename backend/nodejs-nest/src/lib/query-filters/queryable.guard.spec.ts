import { describe, it, expect } from 'vitest'
import { BadRequestException, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { TestUnreachableException } from 'src/tests/test-unreachable.exception'
import { decoratorKey } from './queryable.decorator'

import { QueryableGuard } from './queryable.guard'
import { FilterOptions, FilterParams } from './types'

function createExecutionContext(filterOptions: FilterOptions, query?: Partial<FilterParams>): ExecutionContext {
  class Phantom {}
  const request = { query }
  const executionContext = {
    switchToHttp: () => ({ getRequest: () => request }),
    getClass: () => {
      Reflect.defineMetadata(decoratorKey, filterOptions, Phantom)
      return Phantom
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    getHandler: () => function () {} as any,
  } as ExecutionContext
  ;(executionContext as any).request = request
  return executionContext
}

describe(QueryableGuard.name, () => {
  describe(QueryableGuard.prototype.canActivate.name, () => {
    it('should works properly', () => {
      const guard = new QueryableGuard(new Reflector())
      const context = createExecutionContext({}, {})
      expect(guard.canActivate(context)).toBeTruthy()
      const filters = QueryableGuard.getQueryParams((context as any).request)
      expect(filters).toStrictEqual({
        page: 0,
        pageSize: 20,
        order: {},
        relations: [],
        select: [],
        queries: {},
      })
    })

    it('should return true if no options are provided', () => {
      const executor = new QueryableGuard(new Reflector())
      const context = createExecutionContext({ strict: true }, {})
      expect(executor.canActivate(context)).toBeTruthy()
    })

    it('should return true if query is undefined', () => {
      const executor = new QueryableGuard(new Reflector())
      const context = createExecutionContext({ strict: true }, undefined)
      expect(executor.canActivate(context)).toBeTruthy()
    })

    it('should throws if query was invalid', () => {
      const executor = new QueryableGuard(new Reflector())
      const context = createExecutionContext({ strict: true }, { order: ':asc', relations: 'field;' })
      try {
        executor.canActivate(context)
        throw new TestUnreachableException()
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.message).toBe(
          'Request validation failed because:' +
            ' "order" with value ":asc" fails to match the "semicolon separated list of relations w/ optional :asc or :desc order" pattern,' +
            ' "relations" with value "field;" fails to match the "semicolon separated list of fields" pattern',
        )
      }
    })

    it('should throws if not configured relations receive values', () => {
      const executor = new QueryableGuard(new Reflector())
      const context = createExecutionContext({ strict: true }, { relations: 'x' })
      try {
        executor.canActivate(context)
        throw new TestUnreachableException()
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.message).toBe(
          'Request validation failed because: "relations" was not configured to receive any value',
        )
      }
    })

    it('should throws if not configured order receive values', () => {
      const executor = new QueryableGuard(new Reflector())
      const context = createExecutionContext({ strict: true }, { order: 'x' })
      try {
        executor.canActivate(context)
        throw new TestUnreachableException()
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.message).toBe('Request validation failed because: "order" was not configured to receive any value')
      }
    })

    it('should throws if relations receive invalid values', () => {
      const executor = new QueryableGuard(new Reflector())
      const context = createExecutionContext(
        { strict: true, relations: ['valid_field'] },
        { relations: 'invalid_field' },
      )
      try {
        executor.canActivate(context)
        throw new TestUnreachableException()
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.message).toBe('Request validation failed because: "relations[0]" must be [valid_field]')
      }
    })

    it('should throws if order receive invalid values', () => {
      const executor = new QueryableGuard(new Reflector())
      const context = createExecutionContext({ strict: true, order: ['field'] }, { order: 'invalid_field' })
      try {
        executor.canActivate(context)
        throw new TestUnreachableException()
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.message).toBe('Request validation failed because: "order.invalid_field" is not allowed')
      }
    })
  })
})

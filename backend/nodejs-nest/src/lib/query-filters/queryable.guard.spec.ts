import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TestSchema } from 'src/tests/test-schema';
import { TestUnreachableException } from 'src/tests/test-unreachable.exception';
import { decoratorKey } from './queryable.decorator';

import { QueryableGuard } from './queryable.guard';
import { FilterOptions, FilterParams, Filters } from './types';
import { _getFilters, querySchema } from './_internal';

function createExecutionContext(
  filterOptions: FilterOptions,
  query?: Partial<FilterParams>,
): ExecutionContext {
  class Phantom {}
  const request = { query };
  const executionContext = {
    switchToHttp: () => ({ getRequest: () => request }),
    getClass: () => {
      Reflect.defineMetadata(decoratorKey, filterOptions, Phantom);
      return Phantom;
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    getHandler: () => function () {} as any,
  } as ExecutionContext;
  (executionContext as any).request = request;
  return executionContext;
}

describe(QueryableGuard, () => {
  describe('querySchema', () => {
    const testSchema = new TestSchema(querySchema);

    it('should works with valid data', () => {
      testSchema.mustMatch({}, { page: 0, pageSize: 20 });
      testSchema.mustMatch({ page: '2' }, { page: 2, pageSize: 20 });
      testSchema.mustMatch({ pageSize: '100' }, { page: 0, pageSize: 100 });
      testSchema.mustMatch(
        { page: '3', pageSize: '30' },
        { page: 3, pageSize: 30 },
      );

      testSchema.mustWorks({ order: 'field_1' });
      testSchema.mustWorks({ order: 'field_1;field_2' });
      testSchema.mustWorks({ order: 'field_1:asc;field_2' });
      testSchema.mustWorks({ order: 'field_1;field_2:desc' });

      testSchema.mustWorks({ relations: 'field_1.field_2' });
      testSchema.mustWorks({ relations: 'field_1;field_2' });

      testSchema.mustWorks({ select: 'field_1.field_2' });
      testSchema.mustWorks({ select: 'field_1;field_2' });
    });

    it('should fail with invalid data', () => {
      testSchema.mustFail({ page: '-1' });
      testSchema.mustFail({ pageSize: '0' });
      testSchema.mustFail({ page: '-1', pageSize: '0' });

      testSchema.mustFail({ order: '' });
      testSchema.mustFail({ order: ':desc' });
      testSchema.mustFail({ order: ':asc' });
      testSchema.mustFail({ order: 'field_1.' });
      testSchema.mustFail({ order: 'field_1;' });
      testSchema.mustFail({ order: 'field_1:asc.' });
      testSchema.mustFail({ order: 'field_1:asc;' });

      testSchema.mustFail({ relations: '' });
      testSchema.mustFail({ relations: 'field1.' });
      testSchema.mustFail({ relations: 'field1;' });

      testSchema.mustFail({ select: '' });
      testSchema.mustFail({ select: 'field1.' });
      testSchema.mustFail({ select: 'field1;' });
    });
  });

  describe(QueryableGuard.prototype.getFilterOptions, () => {
    it('should return default values', () => {
      const guard = new QueryableGuard(new Reflector());
      const context = createExecutionContext({});
      const options = guard.getFilterOptions(context);
      expect(options).toEqual({
        fields: [],
        order: [],
        relations: [],
        strict: true,
        pagination: true,
      });
    });
  });

  describe(QueryableGuard.prototype.getFilterOptionsSchema, () => {
    function createTestSchema(query: FilterOptions) {
      const guard = new QueryableGuard(new Reflector());
      const context = createExecutionContext(query);
      const options = guard.getFilterOptions(context);
      const schema = guard.getFilterOptionsSchema(options);
      return new TestSchema(schema);
    }

    it('should works properly with strictness enabled (default)', () => {
      const testSchema = createTestSchema({
        strict: true,
        relations: ['valid_relation'],
        order: ['valid_order'],
      });

      testSchema.mustFail({ select: [''] });

      testSchema.mustFail({ relations: [''] });
      testSchema.mustFail({ relations: ['x'] });
      testSchema.mustFail({ relations: ['xy'] });
      testSchema.mustFail({ relations: ['xyz'] });
      testSchema.mustFail({ relations: ['anything'] });

      testSchema.mustFail({ order: { x: 'x' } });
      testSchema.mustFail({ order: { x: 'x', y: 'y' } });
      testSchema.mustFail({ order: { x: 'x', y: 'y', anything: 'anything' } });

      testSchema.mustWorks({});
      testSchema.mustWorks({ relations: [] });
      testSchema.mustWorks({ order: {} });
      testSchema.mustWorks({ relations: ['valid_relation'] });
      testSchema.mustWorks({ order: { valid_order: 'anything' } });
    });

    it('should works properly with strictness disabled', () => {
      const testSchema = createTestSchema({ strict: false });

      testSchema.mustWorks({});

      testSchema.mustWorks({ relations: [] });
      testSchema.mustWorks({ relations: ['x'] });
      testSchema.mustWorks({ relations: ['xy'] });
      testSchema.mustWorks({ relations: ['xyz'] });
      testSchema.mustWorks({ relations: ['anything'] });

      testSchema.mustWorks({ order: {} });
      testSchema.mustWorks({ order: { x: 'x' } });
      testSchema.mustWorks({ order: { x: 'x', y: 'y' } });
      testSchema.mustWorks({ order: { x: 'x', y: 'y', anything: 'anything' } });
    });
  });

  describe(QueryableGuard.prototype.transformFilterParams, () => {
    it('should works properly', () => {
      const guard = new QueryableGuard(new Reflector());

      const inputDefaults = { page: 0, pageSize: 20 };
      const resultDefaults = {
        order: {},
        relations: [],
        select: [],
        queries: {},
      };
      const mustMatch = (
        filterParams: Partial<FilterParams>,
        filters: Partial<Filters>,
      ) => {
        const input = { ...inputDefaults, ...filterParams };
        const output = { ...resultDefaults, ...inputDefaults, ...filters };
        expect(guard.transformFilterParams(input)).toStrictEqual(output);
      };

      mustMatch({}, {});
      mustMatch(
        { order: 'field_1;field_2:desc', relations: 'field_3' },
        { order: { field_1: 'ASC', field_2: 'DESC' }, relations: ['field_3'] },
      );
      mustMatch({ 'q.field': '10' }, { queries: { field: '10' } });
    });
  });

  describe(QueryableGuard.prototype.canActivate, () => {
    it('should works properly', () => {
      const guard = new QueryableGuard(new Reflector());
      const context = createExecutionContext({}, {});
      expect(guard.canActivate(context)).toBeTruthy();
      const filters = _getFilters((context as any).request);
      expect(filters).toStrictEqual({
        page: 0,
        pageSize: 20,
        order: {},
        relations: [],
        select: [],
        queries: {},
      });
    });

    it('should return true if no options are provided', () => {
      const executor = new QueryableGuard(new Reflector());
      const context = createExecutionContext({ strict: true }, {});
      expect(executor.canActivate(context)).toBeTruthy();
    });

    it('should return true if query is undefined', () => {
      const executor = new QueryableGuard(new Reflector());
      const context = createExecutionContext({ strict: true }, undefined);
      expect(executor.canActivate(context)).toBeTruthy();
    });

    it('should throws if query was invalid', () => {
      const executor = new QueryableGuard(new Reflector());
      const context = createExecutionContext(
        { strict: true },
        { order: ':asc', relations: 'field;' },
      );
      try {
        executor.canActivate(context);
        throw new TestUnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          'Request validation failed because:' +
            ' "order" with value ":asc" fails to match the "semicolon separated list of relations w/ optional :asc or :desc order" pattern,' +
            ' "relations" with value "field;" fails to match the "semicolon separated list of fields" pattern',
        );
      }
    });

    it('should throws if not configured relations receive values', () => {
      const executor = new QueryableGuard(new Reflector());
      const context = createExecutionContext(
        { strict: true },
        { relations: 'x' },
      );
      try {
        executor.canActivate(context);
        throw new TestUnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          'Request validation failed because: "relations" was not configured to receive any value',
        );
      }
    });

    it('should throws if not configured order receive values', () => {
      const executor = new QueryableGuard(new Reflector());
      const context = createExecutionContext({ strict: true }, { order: 'x' });
      try {
        executor.canActivate(context);
        throw new TestUnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          'Request validation failed because: "order" was not configured to receive any value',
        );
      }
    });

    it('should throws if relations receive invalid values', () => {
      const executor = new QueryableGuard(new Reflector());
      const context = createExecutionContext(
        { strict: true, relations: ['valid_field'] },
        { relations: 'invalid_field' },
      );
      try {
        executor.canActivate(context);
        throw new TestUnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          'Request validation failed because: "relations[0]" must be [valid_field]',
        );
      }
    });

    it('should throws if order receive invalid values', () => {
      const executor = new QueryableGuard(new Reflector());
      const context = createExecutionContext(
        { strict: true, order: ['field'] },
        { order: 'invalid_field' },
      );
      try {
        executor.canActivate(context);
        throw new TestUnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          'Request validation failed because: "order.invalid_field" is not allowed',
        );
      }
    });
  });
});

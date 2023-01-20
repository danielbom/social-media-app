import { describe, it, expect } from 'vitest'
import { TestSchema } from 'src/tests/test-schema'

import { FilterOptions, FilterParams, Filters } from './types'
import { buildParamsSchema } from './_internal'
import { QueryableHandler } from './queryable-handler'

describe(QueryableHandler.name, () => {
  describe('querySchema', () => {
    const testSchema = new TestSchema(buildParamsSchema({ pagination: true } as any))

    it('should works with valid data', () => {
      testSchema.mustMatch({}, { page: 0, pageSize: 20 })
      testSchema.mustMatch({ page: '2' }, { page: 2, pageSize: 20 })
      testSchema.mustMatch({ pageSize: '100' }, { page: 0, pageSize: 100 })
      testSchema.mustMatch({ page: '3', pageSize: '30' }, { page: 3, pageSize: 30 })

      testSchema.mustWorks({ order: 'field_1' })
      testSchema.mustWorks({ order: 'field_1;field_2' })
      testSchema.mustWorks({ order: 'field_1:asc;field_2' })
      testSchema.mustWorks({ order: 'field_1;field_2:desc' })

      testSchema.mustWorks({ relations: 'field_1.field_2' })
      testSchema.mustWorks({ relations: 'field_1;field_2' })

      testSchema.mustWorks({ select: 'field_1.field_2' })
      testSchema.mustWorks({ select: 'field_1;field_2' })
    })

    it('should fail with invalid data', () => {
      testSchema.mustFail({ page: '-1' })
      testSchema.mustFail({ pageSize: '0' })
      testSchema.mustFail({ page: '-1', pageSize: '0' })

      testSchema.mustFail({ order: '' })
      testSchema.mustFail({ order: ':desc' })
      testSchema.mustFail({ order: ':asc' })
      testSchema.mustFail({ order: 'field_1.' })
      testSchema.mustFail({ order: 'field_1;' })
      testSchema.mustFail({ order: 'field_1:asc.' })
      testSchema.mustFail({ order: 'field_1:asc;' })

      testSchema.mustFail({ relations: '' })
      testSchema.mustFail({ relations: 'field1.' })
      testSchema.mustFail({ relations: 'field1;' })

      testSchema.mustFail({ select: '' })
      testSchema.mustFail({ select: 'field1.' })
      testSchema.mustFail({ select: 'field1;' })
    })
  })

  describe(QueryableHandler.name + '.optionsSchema', () => {
    function createTestSchema(filterOptions: FilterOptions) {
      const handler = QueryableHandler.fromOptions(filterOptions)
      return new TestSchema(handler.optionsSchema)
    }

    it('should works properly with strictness enabled (default)', () => {
      const testSchema = createTestSchema({
        strict: true,
        relations: ['valid_relation'],
        order: ['valid_order'],
      })

      testSchema.mustFail({ select: [''] })

      testSchema.mustFail({ relations: [''] })
      testSchema.mustFail({ relations: ['x'] })
      testSchema.mustFail({ relations: ['xy'] })
      testSchema.mustFail({ relations: ['xyz'] })
      testSchema.mustFail({ relations: ['anything'] })

      testSchema.mustFail({ order: { x: 'x' } })
      testSchema.mustFail({ order: { x: 'x', y: 'y' } })
      testSchema.mustFail({ order: { x: 'x', y: 'y', anything: 'anything' } })

      testSchema.mustWorks({})
      testSchema.mustWorks({ relations: [] })
      testSchema.mustWorks({ order: {} })
      testSchema.mustWorks({ relations: ['valid_relation'] })
      testSchema.mustWorks({ order: { valid_order: 'anything' } })
    })

    it('should works properly with strictness disabled', () => {
      const testSchema = createTestSchema({ strict: false })

      testSchema.mustWorks({})

      testSchema.mustWorks({ relations: [] })
      testSchema.mustWorks({ relations: ['x'] })
      testSchema.mustWorks({ relations: ['xy'] })
      testSchema.mustWorks({ relations: ['xyz'] })
      testSchema.mustWorks({ relations: ['anything'] })

      testSchema.mustWorks({ order: {} })
      testSchema.mustWorks({ order: { x: 'x' } })
      testSchema.mustWorks({ order: { x: 'x', y: 'y' } })
      testSchema.mustWorks({ order: { x: 'x', y: 'y', anything: 'anything' } })
    })
  })

  describe(QueryableHandler.prototype.transformParams.name, () => {
    it('should works properly', () => {
      const handler = QueryableHandler.fromOptions({})

      const inputDefaults = { page: 0, pageSize: 20 }
      const resultDefaults = {
        order: {},
        relations: [],
        select: [],
        queries: {},
      }
      const mustMatch = (filterParams: Partial<FilterParams>, filters: Partial<Filters>) => {
        const input = { ...inputDefaults, ...filterParams }
        const output = { ...resultDefaults, ...inputDefaults, ...filters }
        expect(handler.transformParams(input)).toStrictEqual(output)
      }

      mustMatch({}, {})
      mustMatch(
        { order: 'field_1;field_2:desc', relations: 'field_3' },
        { order: { field_1: 'ASC', field_2: 'DESC' }, relations: ['field_3'] },
      )
      mustMatch({ 'q.field': '10' }, { queries: { field: '10' } })
    })
  })
})

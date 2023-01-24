import { describe, it, expect } from 'vitest'
import { Chance } from 'chance'

import { FilterOptions, FilterParams, Filters } from './types'
import { QueryableHandler } from './queryable-handler'
import { transformers } from './_internal'

describe(QueryableHandler.name, () => {
  describe(QueryableHandler.prototype.execute.name + ' should works', () => {
    type ShouldWorks = {
      options: FilterOptions
      params: FilterParams
      expected: Filters
    }
    function shouldWorks({ options, params, expected }: ShouldWorks) {
      const handler = QueryableHandler.fromOptions(options)
      const result = handler.execute(params)
      expect(result.error).toBeUndefined()
      expect(result.value).toStrictEqual(expected)
    }

    // defaults
    const page = 0
    const pageSize = 20
    const order = {}
    const relations: string[] = []
    const select: string[] = []
    const queries = {}

    it('should works properly (default)', () => {
      shouldWorks({
        options: { strict: false, pagination: true },
        params: { page, pageSize },
        expected: { page, pageSize, order, relations, select, queries },
      })
    })

    it('should works properly (base)', () => {
      shouldWorks({
        options: { strict: false, pagination: true },
        params: {
          'page': 2,
          'pageSize': 22,
          'order': 'field',
          'relations': 'field',
          'select': 'field',
          'q.field': 'value',
        },
        expected: {
          page: 2,
          pageSize: 22,
          order: { field: 'ASC' },
          relations: ['field'],
          select: ['field'],
          queries: { field: 'value' },
        },
      })
    })

    it('should works properly (order)', () => {
      shouldWorks({
        options: { strict: true, order: ['field1', 'field2'] },
        params: { page, pageSize, order: 'field1:desc;field2:asc' },
        expected: { page, pageSize, order: { field1: 'DESC', field2: 'ASC' }, relations, select, queries },
      })
    })

    it('should works properly (relations)', () => {
      shouldWorks({
        options: { strict: true, relations: ['field1', 'field2'] },
        params: { page, pageSize, relations: 'field1;field2' },
        expected: { page, pageSize, order, relations: ['field1', 'field2'], select, queries },
      })
    })

    it('should works properly (select)', () => {
      shouldWorks({
        options: { strict: true, select: ['field1', 'field2'] },
        params: { page, pageSize, select: 'field1' },
        expected: { page, pageSize, order, relations, select: ['field1'], queries },
      })
      shouldWorks({
        options: { strict: true, select: ['field1', 'field2'] },
        params: { page, pageSize, select: 'field1;field2' },
        expected: { page, pageSize, order, relations, select: ['field1', 'field2'], queries },
      })
    })

    it('should works properly (query)', () => {
      shouldWorks({
        options: { strict: true, query: ['field1', 'field2'] },
        params: { page, pageSize, 'q.field2': 'value2' },
        expected: { page, pageSize, order, relations, select, queries: { field2: 'value2' } },
      })
      shouldWorks({
        options: { strict: true, query: ['field1', 'field2'] },
        params: { page, pageSize, 'q.field1': 'value1', 'q.field2': 'value2' },
        expected: { page, pageSize, order, relations, select, queries: { field1: 'value1', field2: 'value2' } },
      })
    })

    it('should works properly (ramdom)', () => {
      function generate(): ShouldWorks {
        const chance = new Chance()

        const chanceOrder = (word: string) => (chance.bool() ? `${word}:${chance.pickone(['asc', 'desc'])}` : word)

        const options: FilterOptions = {
          strict: true,
          pagination: true,
          order: chance.n(chance.word, chance.integer({ min: 1, max: 5 })),
          relations: chance.n(chance.word, chance.integer({ min: 1, max: 5 })),
          select: chance.n(chance.word, chance.integer({ min: 1, max: 5 })),
          query: chance.n(chance.word, chance.integer({ min: 1, max: 5 })),
        }
        const params: FilterParams = {
          page: chance.integer({ min: 1, max: 1000 }),
          pageSize: chance.integer({ min: 20, max: 100 }),
          order: joinIfNotEmpty(sample(options.order!).map(chanceOrder)),
          relations: joinIfNotEmpty(sample(options.relations!)),
          select: joinIfNotEmpty(sample(options.select!)),
          ...Object.fromEntries(sample(options.query!).map((it) => ['q.' + it, chance.word()])),
        }
        const expected: Filters = {
          page: params.page,
          pageSize: params.pageSize,
          order: transformers.order(params.order) as any,
          relations: transformers.relations(params.relations),
          select: transformers.select(params.select),
          queries: transformers.queries(
            Object.fromEntries(
              Object.entries(params)
                .filter(([key]) => key.startsWith('q.'))
                .map(([key, value]) => [key, String(value)]),
            ),
          ),
        }

        return { options, params, expected }
      }

      for (let i = 0; i < 10; i++) {
        shouldWorks(generate())
      }
    })
  })

  describe(QueryableHandler.prototype.execute.name + ' should not works', () => {
    type ShouldNotWorks = {
      options: FilterOptions
      params: FilterParams
      expected: any
    }
    function shouldNotWorks({ options, params, expected }: ShouldNotWorks) {
      const handler = QueryableHandler.fromOptions(options)
      const result = handler.execute(params)
      expect(result.error?.message).toStrictEqual(expected)
    }

    // defaults
    const page = 0
    const pageSize = 20

    it('should not works properly (order)', () => {
      shouldNotWorks({
        options: { strict: true, order: ['field1', 'field2'] },
        params: { page, pageSize, order: 'field1:desc;field2:descx' },
        expected:
          '"order" with value "field1:desc;field2:descx" fails to match the "semicolon separated list of relations w/ optional :asc or :desc order" pattern',
      })
      shouldNotWorks({
        options: { strict: true, order: ['field1', 'field2', 'field3'] },
        params: { page, pageSize, order: 'field1:desc;field3:asc;field2:descx' },
        expected:
          '"order" with value "field1:desc;field3:asc;field2:descx" fails to match the "semicolon separated list of relations w/ optional :asc or :desc order" pattern',
      })
      shouldNotWorks({
        options: { strict: true, order: ['field1', 'field2'] },
        params: { page, pageSize, order: 'field1:desc;field3:asc' },
        expected: '"order.field3" is not allowed',
      })
    })
  })
})

function sample<T>(array: T[]): T[] {
  if (array.length === 0) return array
  const shuffled = array.slice(0).sort(() => (Math.random() > 0.5 ? 1 : -1))
  const n = Math.floor(Math.random() * array.length)
  return shuffled.slice(0, n)
}

function joinIfNotEmpty(xs: string[]): string | undefined {
  return xs.length > 0 ? xs.join(';') : undefined
}

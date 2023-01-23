import { FindOneOptions } from 'typeorm'

import { Filters } from '../types'

export function applyFilters1<T>(options: FindOneOptions<T>, { relations, select }: Filters): FindOneOptions<T> {
  options.relations = relations
  if (select.length > 0) options.select = select as any
  return options
}

export function applyOptionalFilters1<T>(options: FindOneOptions<T>, filters?: Filters) {
  return filters ? applyFilters1(options, filters) : options
}

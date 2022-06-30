import { FindOneOptions } from 'typeorm';

import { Filters } from '../types';

export function applyFiltersOptionsOne<T>(
  options: FindOneOptions<T>,
  { relations, select }: Filters,
): FindOneOptions<T> {
  options.relations = relations;
  if (select.length > 0) options.select = select as any;
  return options;
}

export function applyFiltersOptionsOne1<T>(
  options: FindOneOptions<T>,
  filters?: Filters,
) {
  return filters ? applyFiltersOptionsOne(options, filters) : options;
}

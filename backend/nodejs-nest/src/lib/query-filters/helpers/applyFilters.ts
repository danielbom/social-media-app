import { FindManyOptions, Repository } from 'typeorm';
import { Page, Filters } from '../types';

export async function applyFilters<T>(
  { page, pageSize, order, relations, select }: Filters,
  repository: Repository<T>,
  userOptions?: FindManyOptions<T>,
): Promise<Page<T>> {
  const skip = page * pageSize;
  const take = skip + pageSize;
  const options = { order, relations, take, skip } as any;
  if (select.length > 0) options.select = select;
  const [items, count] = await repository.findAndCount({
    ...userOptions,
    ...options,
  });
  return {
    items,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
    totalItems: count,
    isLast: take >= count,
  };
}

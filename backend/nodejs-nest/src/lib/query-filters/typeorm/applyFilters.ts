import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm'
import { Page, Filters } from '../types'

export async function applyFilters<T extends ObjectLiteral>(
  { page, pageSize, order, relations, select }: Filters,
  repository: Repository<T>,
  otherOptions?: FindManyOptions<T>,
): Promise<Page<T>> {
  const skip = page * pageSize
  const take = skip + pageSize
  const options = { order, relations, take, skip } as any
  if (select.length > 0) options.select = select
  const [items, count] = await repository.findAndCount({
    ...otherOptions,
    ...options,
  })
  return {
    items,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
    totalItems: count,
    isLast: take >= count,
  }
}

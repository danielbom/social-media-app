import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { QueryableGuard } from './queryable.guard';
import { FilterOptions } from './types';

export const decoratorKey = '@QFDecorator';

export function Queryable(options: FilterOptions = {}) {
  return applyDecorators(SetMetadata(decoratorKey, options), UseGuards(QueryableGuard));
}

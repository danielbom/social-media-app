import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { getFiltersFromRequest } from './_internal';

export const QueryFilters = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  return getFiltersFromRequest(context.switchToHttp().getRequest());
});

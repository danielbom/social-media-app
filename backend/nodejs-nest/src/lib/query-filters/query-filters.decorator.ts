import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { _getFilters } from './_internal';

export const QueryFilters = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    return _getFilters(context.switchToHttp().getRequest());
  },
);

import { FilterParams, Filters } from './types';
import Joi from 'joi';
import { BadRequestException } from '@nestjs/common';

const requestKey = '@QF';

export function injectPagination(request: any, filters: Filters) {
  (request as any)[requestKey] = filters;
}

export function getFiltersFromRequest(request: any) {
  return (request as any)[requestKey];
}

export const transformers = {
  order(order?: string) {
    return Object.fromEntries(
      order?.split(';').map((item: string) => {
        const [field, direction = 'ASC'] = item.trim().split(':');
        return [field, direction.toUpperCase() !== 'ASC' ? 'DESC' : 'ASC'];
      }) || [],
    );
  },
  relations(relations?: string) {
    return relations?.split(';') || [];
  },
  select(select?: string) {
    return select?.split(';') || [];
  },
  queries(queries: Record<string, string> = {}) {
    return Object.fromEntries(
      Object.entries(queries).map(([key, value]) => [key.slice(2), value]),
    );
  },
};

export const querySchema = (() => {
  const listOfFields = Joi.string()
    .regex(/^\w+(.\w+)*(;\w+(.\w+)*)*$/, '"semicolon separated list of fields"')
    .optional();

  const schema = Joi.object<FilterParams>({
    page: Joi.number().min(0).default(0).optional(),
    pageSize: Joi.number().min(10).max(100).default(20).optional(),
    order: Joi.string()
      .regex(
        /^\w+(.\w+)*(:(asc|desc))?(;\w+(.\w+)*(:(asc|desc))?)*$/,
        '"semicolon separated list of relations w/ optional :asc or :desc order"',
      )
      .optional(),
    relations: listOfFields,
    select: listOfFields,
  })
    .pattern(
      Joi.string()
        .regex(/^q\.[a-zA-Z0-9_.:]+/)
        .required(),
      Joi.string().required(),
    )
    .options({ abortEarly: false });

  return schema;
})();

export const paginationDisable = (() => {
  const disable = (field: string) =>
    Joi.forbidden().messages({
      'any.unknown': `"${field}" was not allowed when "pagination" was disabled`,
    });

  return {
    order: disable('order'),
    page: disable('page'),
    pageSize: disable('pageSize'),
  };
})();

export function assertSchema<T>(validation: Joi.ValidationResult<T>): T {
  if (!validation.error) return validation.value;
  const reasons = validation.error.details
    .map((detail) => detail.message)
    .join(', ');
  throw new BadRequestException(
    `Request validation failed because: ${reasons}`,
  );
}

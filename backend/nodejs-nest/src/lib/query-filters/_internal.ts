import { FilterOptions, FilterParams, Filters } from './types';
import Joi from 'joi';
import { BadRequestException } from '@nestjs/common';

const requestKey = '@QF';

export function _setFilters(request: any, filters: Filters) {
  (request as any)[requestKey] = filters;
}

export function _getFilters(request: any) {
  return (request as any)[requestKey];
}

export function _assertSchema<T>(validation: Joi.ValidationResult<T>): T {
  if (!validation.error) return validation.value;
  const reasons = validation.error.details
    .map((detail) => detail.message)
    .join(', ');
  throw new BadRequestException(
    `Request validation failed because: ${reasons}`,
  );
}

export function buildOptionsSchema(
  options: Required<FilterOptions>,
): Joi.Schema<FilterOptions> {
  const builder = {
    strict: {
      select(select: string[]) {
        return select.length === 0
          ? Joi.array().items(Joi.forbidden()).messages({
              'array.excludes':
                '"select" was not was not configured to receive any value',
            })
          : Joi.array().items(Joi.string().valid(...select));
      },
      relations(relations: string[]) {
        return relations.length === 0
          ? Joi.array().items(Joi.forbidden()).messages({
              'array.excludes':
                '"relations" was not configured to receive any value',
            })
          : Joi.array().items(Joi.string().valid(...relations));
      },
      order(order: string[]) {
        return order.length === 0
          ? Joi.object().pattern(Joi.any(), Joi.forbidden()).messages({
              'any.unknown': '"order" was not configured to receive any value',
            })
          : Joi.object()
              .pattern(Joi.string().valid(...order), Joi.any())
              .options({ allowUnknown: false });
      },
      query(query: string[]) {
        return query.length === 0
          ? Joi.object().pattern(Joi.any(), Joi.forbidden()).messages({
              'any.unknown': '"query" was not configured to receive any value',
            })
          : Joi.object()
              .pattern(Joi.string().valid(...query), Joi.any())
              .options({ allowUnknown: false });
      },
    },
    normal: {
      relations() {
        return Joi.array().items(Joi.string());
      },
      order() {
        return Joi.object().pattern(Joi.string(), Joi.string());
      },
      select() {
        return Joi.array().items(Joi.string());
      },
      query() {
        return Joi.object().pattern(Joi.string(), Joi.string());
      },
    },
  };

  return Joi.object<FilterOptions>(
    options.strict
      ? {
          select: builder.strict.select(options.select),
          relations: builder.strict.relations(options.relations),
          order: builder.strict.order(options.order),
          query: builder.strict.query(options.query),
        }
      : {
          select: builder.normal.select(),
          relations: builder.normal.relations(),
          order: builder.normal.order(),
          query: builder.normal.query(),
        },
  ).options({ abortEarly: false, allowUnknown: true });
}

export function buildParamsSchema(
  options: Required<FilterOptions>,
): Joi.Schema<FilterParams> {
  return options.pagination
    ? paramsSchema
    : paramsSchema.keys(paginationDisable);
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

const paramsSchema = (() => {
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

const paginationDisable = (() => {
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

import { FilterParams, Filters } from './types';
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

export function _optionsSchemaBuilder(map: Record<string, Joi.Schema> = {}) {
  return {
    strict: {
      select(fields: string[]) {
        if (fields.length === 0) {
          map.select = Joi.array().items(Joi.forbidden()).messages({
            'array.excludes':
              '"fields" was not was not configured to receive any value',
          });
        } else {
          map.select = Joi.array().items(Joi.string().valid(...fields));
        }
      },
      relations(relations: string[]) {
        if (relations.length === 0) {
          map.relations = Joi.array().items(Joi.forbidden()).messages({
            'array.excludes':
              '"relations" was not configured to receive any value',
          });
        } else {
          map.relations = Joi.array().items(Joi.string().valid(...relations));
        }
      },
      order(order: string[]) {
        if (order.length === 0) {
          map.order = Joi.object()
            .pattern(Joi.any(), Joi.forbidden())
            .messages({
              'any.unknown': '"order" was not configured to receive any value',
            });
        } else {
          map.order = Joi.object()
            .pattern(Joi.string().valid(...order), Joi.any())
            .options({ allowUnknown: false });
        }
      },
    },
    normal: {
      relations() {
        map.relations = Joi.array().items(Joi.string());
      },
      order() {
        map.order = Joi.object().pattern(Joi.string(), Joi.string());
      },
      select() {
        map.select = Joi.array().items(Joi.string());
      },
      query() {
        map.query = Joi.object().pattern(Joi.string(), Joi.string());
      },
    },
    get() {
      return map;
    },
  };
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

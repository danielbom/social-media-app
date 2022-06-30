import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import Joi from 'joi';

import { injectPagination } from './_internal';
import { FilterOptions, FilterParams, Filters } from './types';
import { decoratorKey } from './queryable.decorator';

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

@Injectable({ scope: Scope.TRANSIENT })
export class QueryableGuard implements CanActivate {
  private options: Required<FilterOptions> | null = null;
  private schema: null | Joi.Schema<FilterOptions> = null;

  constructor(private readonly reflector: Reflector) {}

  getOptions(context: ExecutionContext): Required<FilterOptions> {
    if (this.options) return this.options;
    const rolesClass = this.reflector.get<FilterOptions | undefined>(
      decoratorKey,
      context.getClass(),
    );
    const rolesHandler = this.reflector.get<FilterOptions | undefined>(
      decoratorKey,
      context.getHandler(),
    );
    this.options = {
      fields: [],
      order: [],
      relations: [],
      strict: true,
      pagination: true,
      ...rolesClass,
      ...rolesHandler,
    };
    return this.options;
  }

  getQuerySchema(options: Required<FilterOptions>): Joi.Schema<FilterParams> {
    if (options.pagination) {
      return querySchema;
    } else {
      return querySchema.keys(paginationDisable);
    }
  }

  getOptionsSchema(
    options: Required<FilterOptions>,
  ): Joi.Schema<FilterOptions> {
    if (this.schema) return this.schema;

    const keys: Record<string, Joi.Schema> = {
      select: Joi.array().items(Joi.string()),
      query: Joi.object().pattern(Joi.string(), Joi.string()),
    };

    if (options.strict) {
      // 'select' are non strict by default. They are strict only when fields are specified in options.
      if (options.fields.length !== 0) {
        keys.select = Joi.array().items(Joi.string().valid(...options.fields));
      }

      if (options.relations.length === 0) {
        keys.relations = Joi.array().items(Joi.forbidden()).messages({
          'array.excludes':
            '"relations" was not configured to receive any value',
        });
      } else {
        keys.relations = Joi.array().items(
          Joi.string().valid(...options.relations),
        );
      }

      if (options.order.length === 0) {
        keys.order = Joi.object().pattern(Joi.any(), Joi.forbidden()).messages({
          'any.unknown': '"order" was not configured to receive any value',
        });
      } else {
        keys.order = Joi.object()
          .pattern(Joi.string().valid(...options.order), Joi.any())
          .options({ allowUnknown: false });
      }
    } else {
      keys.relations = Joi.array().items(Joi.string());
      keys.order = Joi.object().pattern(Joi.string(), Joi.string());
    }

    this.schema = Joi.object<FilterOptions>(keys).options({
      abortEarly: false,
      allowUnknown: true,
    });
    return this.schema;
  }

  private assert<T>(validation: Joi.ValidationResult<T>): T {
    if (!validation.error) return validation.value;
    const reasons = validation.error.details
      .map((detail) => detail.message)
      .join(', ');
    throw new BadRequestException(
      `Request validation failed because: ${reasons}`,
    );
  }

  transform({
    page,
    pageSize,
    order,
    relations,
    select,
    ...rest
  }: FilterParams): Filters {
    const order1 = Object.fromEntries(
      order?.split(';').map((item: string) => {
        const [field, direction = 'ASC'] = item.trim().split(':');
        return [field, direction.toUpperCase() !== 'ASC' ? 'DESC' : 'ASC'];
      }) || [],
    ) as any;
    const relations1 = relations?.split(';') || [];
    const select1 = select?.split(';') || [];
    return {
      page,
      pageSize,
      order: order1,
      relations: relations1,
      select: select1,
      queries: Object.fromEntries(
        Object.entries(rest).map(([key, value]) => [key.slice(2), value]),
      ),
    };
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.query) return true;

    const options = this.getOptions(context);
    const querySchema = this.getQuerySchema(options);
    const query = this.assert(querySchema.validate(request.query));
    const filters = this.transform(query);
    const optionsSchema = this.getOptionsSchema(options);
    this.assert(optionsSchema.validate(filters));

    injectPagination(request, filters);
    return true;
  }
}

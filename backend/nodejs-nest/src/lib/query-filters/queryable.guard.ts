import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import Joi from 'joi';

import {
  assertSchema,
  injectPagination,
  paginationDisable,
  querySchema,
  transformers,
} from './_internal';
import { FilterOptions, FilterParams, Filters } from './types';
import { decoratorKey } from './queryable.decorator';

@Injectable({ scope: Scope.TRANSIENT })
export class QueryableGuard implements CanActivate {
  private options: Required<FilterOptions> | null = null;
  private schema: null | Joi.Schema<FilterOptions> = null;

  constructor(private readonly reflector: Reflector) {}

  getOptions(context: ExecutionContext): Required<FilterOptions> {
    if (this.options) return this.options;
    const filterOptions = this.reflector.getAllAndOverride<FilterOptions>(
      decoratorKey,
      [context.getHandler(), context.getClass()],
    );
    this.options = {
      fields: [],
      order: [],
      relations: [],
      strict: true,
      pagination: true,
      ...filterOptions,
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

  transform({
    page,
    pageSize,
    order,
    relations,
    select,
    ...rest
  }: FilterParams): Filters {
    return {
      page,
      pageSize,
      order: transformers.order(order) as any,
      relations: transformers.relations(relations),
      select: transformers.select(select),
      queries: transformers.queries(rest as any),
    };
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.query) return true;

    const options = this.getOptions(context);
    const querySchema = this.getQuerySchema(options);
    const query = assertSchema(querySchema.validate(request.query));
    const filters = this.transform(query);
    const optionsSchema = this.getOptionsSchema(options);
    assertSchema(optionsSchema.validate(filters));

    injectPagination(request, filters);
    return true;
  }
}

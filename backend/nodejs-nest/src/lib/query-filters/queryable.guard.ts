import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import Joi from 'joi';

import {
  _assertSchema,
  _filterOptionsSchemaBuilder,
  _getFilters,
  _setFilters,
  paginationDisable,
  querySchema,
  transformers,
} from './_internal';
import { decoratorKey } from './queryable.decorator';
import { FilterOptions, FilterParams, Filters } from './types';

@Injectable({ scope: Scope.TRANSIENT })
export class QueryableGuard implements CanActivate {
  private options: Required<FilterOptions> | null = null;
  private schema: null | Joi.Schema<FilterOptions> = null;

  constructor(private readonly reflector: Reflector) {}

  getFilterOptions(context: ExecutionContext): Required<FilterOptions> {
    if (this.options) return this.options;
    const filterOptions = this.reflector.getAllAndOverride<FilterOptions>(
      decoratorKey,
      [context.getHandler(), context.getClass()],
    );
    this.options = {
      query: [],
      select: [],
      order: [],
      relations: [],
      strict: true,
      pagination: true,
      ...filterOptions,
    };
    return this.options;
  }

  getFilterParamsSchema(
    options: Required<FilterOptions>,
  ): Joi.Schema<FilterParams> {
    if (options.pagination) {
      return querySchema;
    } else {
      return querySchema.keys(paginationDisable);
    }
  }

  getFilterOptionsSchema(
    options: Required<FilterOptions>,
  ): Joi.Schema<FilterOptions> {
    if (this.schema) return this.schema;

    const builder = _filterOptionsSchemaBuilder();

    if (options.strict) {
      builder.strict.select(options.select);
      builder.strict.relations(options.relations);
      builder.strict.order(options.order);
      builder.strict.query(options.query);
    } else {
      builder.normal.select();
      builder.normal.relations();
      builder.normal.order();
      builder.normal.order();
    }

    this.schema = builder.build();
    return this.schema;
  }

  transformFilterParams({
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
    const query = request.query;
    if (!query) return true;

    const filterOptions = this.getFilterOptions(context);
    const filterParamsSchema = this.getFilterParamsSchema(filterOptions);
    const filterParams = _assertSchema(filterParamsSchema.validate(query));

    const filters = this.transformFilterParams(filterParams);
    const filterOptionsSchema = this.getFilterOptionsSchema(filterOptions);
    _assertSchema(filterOptionsSchema.validate(filters));

    _setFilters(request, filters);
    return true;
  }

  static getQueryParams(request: any) {
    return _getFilters(request);
  }
}

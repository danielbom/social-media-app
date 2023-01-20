import Joi from 'joi';
import { FilterOptions, FilterParams, Filters } from './types';
import {
  transformers,
  buildOptionsSchema,
  buildParamsSchema,
} from './_internal';

export class QueryableHandler {
  constructor(
    public optionsSchema: Joi.Schema<FilterOptions>,
    public paramsSchema: Joi.Schema<FilterParams>,
  ) {}

  static fromOptions(filterOptions: FilterOptions) {
    const options = {
      query: [],
      select: [],
      order: [],
      relations: [],
      strict: true,
      pagination: true,
      ...filterOptions,
    };

    const optionsSchema = buildOptionsSchema(options);
    const paramsSchema = buildParamsSchema(options);

    return new QueryableHandler(optionsSchema, paramsSchema);
  }

  handleParams(params: FilterParams) {
    return this.paramsSchema.validate(params);
  }

  handleFilters(filters: Filters) {
    return this.optionsSchema.validate(filters);
  }

  transformParams({
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
}

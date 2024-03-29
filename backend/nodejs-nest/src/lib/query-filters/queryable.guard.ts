import { CanActivate, ExecutionContext, Injectable, Scope } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { _assertSchema, _getFilters, _setFilters } from './_internal'
import { decoratorKey } from './queryable.decorator'
import { FilterOptions } from './types'
import { QueryableHandler } from './queryable-handler'

@Injectable({ scope: Scope.TRANSIENT })
export class QueryableGuard implements CanActivate {
  private handle: QueryableHandler | null = null

  constructor(private readonly reflector: Reflector) {}

  getHandler(context: ExecutionContext): QueryableHandler {
    if (!this.handle) {
      const filters = this.reflector.getAllAndOverride<FilterOptions>(decoratorKey, [
        context.getHandler(),
        context.getClass(),
      ])
      this.handle = QueryableHandler.fromOptions(filters)
    }
    return this.handle
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    if (request.query) {
      const filters = _assertSchema(this.getHandler(context).execute(request.query))
      _setFilters(request, filters)
    }

    return true
  }

  static getQueryParams(request: any) {
    return _getFilters(request)
  }
}

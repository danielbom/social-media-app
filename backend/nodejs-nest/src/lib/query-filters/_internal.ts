import { Filters } from './types';

const requestKey = '@QF';

export function injectPagination(request: any, filters: Filters) {
  (request as any)[requestKey] = filters;
}

export function getFiltersFromRequest(request: any) {
  return (request as any)[requestKey];
}

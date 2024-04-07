import { TypeCheck, checkObject, isObject } from '../lib/type-check'
import { castUuid } from '../lib/cast-uuid'

type SanitizeObjectOptions<T> = {
  uuidFields: Array<keyof T>
}

export function sanitizeObject<T>(
  value: unknown,
  typeCheck: TypeCheck<T>,
  options: Partial<SanitizeObjectOptions<T>> = {},
): T | null {
  if (isObject(value)) {
    options?.uuidFields?.forEach((key) => {
      castUuid(value, key)
    })

    if (checkObject(value, typeCheck)) {
      return value
    }
  }
  return null
}

export function sanitizeArrayWith<T>(value: unknown, sanitizer: (value: unknown) => T | null): (T | null)[] {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizer(item))
  }
  return []
}

export function sanitizeArray<T>(
  value: unknown,
  typeCheck: TypeCheck<T>,
  options: Partial<SanitizeObjectOptions<T>> = {},
): (T | null)[] {
  return sanitizeArrayWith(value, (item) => sanitizeObject(item, typeCheck, options))
}

export class Sanitizer<T> {
  constructor(public typeCheck: TypeCheck<T>, public options: Partial<SanitizeObjectOptions<any>> = {}) {}

  one(value: unknown): T | null {
    return sanitizeObject(value, this.typeCheck, this.options)
  }

  many(value: unknown): (T | null)[] {
    return sanitizeArrayWith(value, (item) => this.one(item))
  }
}

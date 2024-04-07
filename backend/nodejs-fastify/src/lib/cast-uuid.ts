import * as uuidBuffer from 'uuid-buffer'

export function castUuid(object: any, key: keyof any) {
  object[key] = uuidBuffer.toString(object[key])
}

import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { Page } from '../types'

export class PageResponseGenerated<T> implements Page<T> {
  items!: T[]
  page!: number
  pageSize!: number
  totalPages!: number
  totalItems!: number
  isLast!: boolean
}

export function PageResponse<T>(itemProperty: ApiPropertyOptions) {
  class PageResponseSwagger implements Page<T> {
    @ApiProperty({ ...itemProperty, isArray: true })
    items!: T[]

    @ApiProperty({ description: 'The current page number' })
    page!: number

    @ApiProperty({ description: 'The number of items per page' })
    pageSize!: number

    @ApiProperty({ description: 'The total number of pages' })
    totalPages!: number

    @ApiProperty({ description: 'The total number of items' })
    totalItems!: number

    @ApiProperty({ description: 'Hint to the last page' })
    isLast!: boolean
  }

  return PageResponseSwagger as { new(): PageResponseGenerated<T> }
}

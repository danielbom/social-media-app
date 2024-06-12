import { ApiProperty } from '@nestjs/swagger'

export class AuthLoginResponse {
  @ApiProperty({ description: 'JWT token' })
  access_token!: string
}

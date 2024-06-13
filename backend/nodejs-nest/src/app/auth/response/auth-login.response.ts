import { ApiProperty } from '@nestjs/swagger'

export class AuthLoginResponse {
  @ApiProperty({ description: 'JWT token' })
  access_token!: string
  refresh_token!: string
  token_type = 'Bearer'
}

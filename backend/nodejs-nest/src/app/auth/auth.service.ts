import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Role } from 'src/entities/role.enum'
import { User } from 'src/entities/user.entity'

import { UsersService } from '../users/users.service'
import { AuthLoginDto } from './dto/auth-login.dto'
import { AuthRegisterDto } from './dto/auth-register.dto'
import { AuthLoginResponse } from './response/auth-login.response'
import { TokenPayload } from './types/token-payload'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userService: UsersService) {}

  async login({ username, password }: AuthLoginDto): Promise<AuthLoginResponse> {
    const auth = await this.userService.getAuthenticated({
      username,
      password,
    })
    return await this._createAuthResponse(auth)
  }

  // TODO: Add a route
  async authRefresh(tokenData: any): Promise<AuthLoginResponse> {
    const user = tokenData.user
    const payload: TokenPayload = { sub: user.id, version: user.version }
    const access_token = await this.jwtService.signAsync(payload)
    return {
      access_token,
      refresh_token: tokenData.value,
      token_type: 'Bearer',
    }
  }

  async register({ username, password }: AuthRegisterDto): Promise<AuthLoginResponse> {
    const user = await this.userService.create({ username, password, role: Role.USER })
    user.version = user.version ?? 0
    return await this._createAuthResponse(user)
  }

  private async _createAuthResponse(auth: User): Promise<AuthLoginResponse> {
    const payload: TokenPayload = { sub: auth.id, version: auth.version! }
    const access_token = await this.jwtService.signAsync(payload)
    const refresh_token = await this.jwtService.signAsync(payload, { expiresIn: '7d' })
    return {
      access_token,
      refresh_token,
      token_type: 'Bearer',
    }
  }
}

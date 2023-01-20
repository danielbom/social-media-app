import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public handleRequest(err: any, user: any, info: any): any {
    if (err) throw err

    if (info) {
      if (info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token Expired')
      } else {
        throw new UnauthorizedException('Invalid token')
      }
    }

    if (!user) throw new UnauthorizedException('Invalid token')

    return user
  }
}

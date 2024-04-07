import Jwt from 'jsonwebtoken'
import { env } from './env'

export const jwt = {
  createToken(payload: any) {
    return Jwt.sign(payload, env.jwt.secret, {
      expiresIn: env.jwt.expiresIn,
      algorithm: 'HS256',
    })
  },

  verifyToken(token: string) {
    return Jwt.verify(token, env.jwt.secret)
  },
}

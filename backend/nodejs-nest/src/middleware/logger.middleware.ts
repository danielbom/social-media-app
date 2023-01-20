import { Request, Response, NextFunction } from 'express'
import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import chalk from 'chalk'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP')

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request
    const userAgent = request.get('user-agent') ?? ''
    const startTime = Date.now()

    response.on('finish', () => {
      const { statusCode } = response
      const contentLength = response.get('content-length') ?? '-'
      const endTime = Date.now()
      const totalTime = endTime - startTime
      const message = `${method} ${originalUrl} ${statusCode} ${contentLength} ${totalTime}ms - ${userAgent} ${ip}`

      if (statusCode >= 400) {
        this.logger.error(message)
      } else {
        this.logger.log(chalk.cyan(message))
      }
    })

    next()
  }
}

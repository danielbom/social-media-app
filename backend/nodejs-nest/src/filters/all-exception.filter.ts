import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { UnreachableException } from 'src/exceptions/unreachable.exception'
import { TypeormExceptions } from 'src/shared/typeorm-exceptions'
import { QueryFailedError } from 'typeorm'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger('AppExceptionsHandler')

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()

    const httpException = this.resolveException(exception)

    const statusCode = httpException.getStatus()
    const response = httpException.getResponse()
    const result = typeof response === 'string' ? { statusCode, message: response } : { ...response, statusCode }
    httpAdapter.reply(ctx.getResponse(), result, statusCode)
  }

  private resolveException(exception: unknown): HttpException {
    if (typeof exception === 'object' && exception !== null) {
      if (exception instanceof HttpException) return exception

      if (exception instanceof UnreachableException) {
        this.logger.error(exception.message)
        this.logger.verbose(exception.stack)
        return new InternalServerErrorException()
      }

      if (exception instanceof QueryFailedError) {
        this.logger.error(exception.message)
        this.logger.verbose(exception.stack)

        if (TypeormExceptions.TableDoesNotExists.mysql(exception)) {
          this.logger.verbose(
            [
              exception.message,
              'This generally happens when:',
              '    - you forget to run your migrations;',
              '    - you forget to run your initials sql script;',
              '    - you are connected to an incorrect database;',
              '    - you are trying access a new table that was not created yet;',
            ].join('\n'),
          )
        }

        return new InternalServerErrorException()
      }

      if (exception instanceof Error) {
        this.logger.error(exception.message)
        this.logger.verbose(exception.stack)
        return new InternalServerErrorException()
      }
    }

    this.logger.error(`Unknown Exception: ${exception}`)
    return new InternalServerErrorException()
  }
}

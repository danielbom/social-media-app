import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { UnreachableException } from 'src/exceptions/unreachable.exception';
import { QueryFailedError } from 'typeorm';

const tableDoestExists = {
  mysql(exception: QueryFailedError): boolean {
    return (
      exception.message.startsWith("Table '") &&
      exception.message.endsWith("' doesn't exist")
    );
  },
  postgres(exception: QueryFailedError): boolean {
    return (
      exception.message.startsWith('relation "') &&
      exception.message.endsWith('" does not exist')
    );
  },
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger('AllExceptionsHandler');

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpException = this.resolveException(exception);

    const statusCode = httpException.getStatus();
    const response = httpException.getResponse();
    const result =
      typeof response === 'string'
        ? { statusCode, message: response }
        : { ...response, statusCode };
    httpAdapter.reply(ctx.getResponse(), result, statusCode);
  }

  private resolveException(exception: unknown): HttpException {
    if (typeof exception === 'object' && exception !== null) {
      if (exception instanceof HttpException) return exception;

      if (exception instanceof UnreachableException) {
        this.logger.error(exception.message);
        this.logger.verbose(exception.stack);
        return new InternalServerErrorException();
      }

      if (exception instanceof QueryFailedError) {
        if (tableDoestExists.mysql(exception)) {
          this.logger.error(exception.message);
          this.logger.verbose(exception.stack);
          this.logger.log(
            [
              exception.message,
              'This generally happens when:',
              '    - you forget to run your migrations;',
              '    - you forget to run your initials sql script;',
              '    - you are connected to an incorrect database;',
              '    - you are trying access a new table that was not created yet;',
            ].join('\n'),
          );
          return new InternalServerErrorException();
        }
      }

      if (exception instanceof Error) {
        this.logger.error(exception.message);
        this.logger.verbose(exception.stack);
        return new InternalServerErrorException();
      }
    }

    this.logger.error(`Unknown Exception: ${exception}`);
    return new InternalServerErrorException();
  }
}

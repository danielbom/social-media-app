import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import chalk from 'chalk';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger('AllExceptionsHandler');

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    this.logException(exception);
    const result = this.resolveException(exception);
    httpAdapter.reply(ctx.getResponse(), result, result.status);
  }

  private tableDoestExists(exception: QueryFailedError): boolean {
    return (
      exception.message.startsWith("Table '") &&
      exception.message.endsWith("' doesn't exist")
    );
  }

  private logException(exception: unknown) {
    if (typeof exception === 'object' && exception !== null) {
      if (exception instanceof QueryFailedError) {
        if (this.tableDoestExists(exception)) {
          this.log(exception.message, exception.stack);
          return this.logTip(
            [
              exception.message,
              'This generally happens when:',
              '    - you forget to run your migrations;',
              '    - you forget to run your initials sql script;',
              '    - you are connected to an incorrect database;',
              '    - you are trying access a new table that was not created yet;',
            ].join('\n'),
          );
        }
      }

      const anyException = exception as any;
      if ('message' in exception && 'stack' in exception) {
        return this.log(anyException.message, anyException.stack);
      }
    }

    this.log(`Unknown Exception: ${exception}`);
  }

  private resolveException(exception: unknown) {
    if (exception instanceof HttpException) {
      return {
        status: exception.getStatus(),
        message: exception.getResponse(),
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    };
  }

  private logTip(...args: any[]) {
    this.logger.log(chalk.magenta('Tip:', ...args));
  }

  private log(message: string, ...args: any[]) {
    message = chalk.red('Error:', message);
    if (args.length > 0) message = message + '\n' + chalk.gray(args.join('\n'));
    this.logger.log(message);
  }
}

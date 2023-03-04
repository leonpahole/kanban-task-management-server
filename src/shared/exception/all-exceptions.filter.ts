import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AppException } from './app.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let httpException = new InternalServerErrorException();
    let { message } = httpException;

    if (exception instanceof AppException) {
      httpException = exception.httpException;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      httpException = exception;
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        message = (exceptionResponse as any)?.message || exception.message;
      }
    }

    this.logger.error(`An error has occured`);
    this.logger.error(exception);

    response.status(httpException.getStatus()).json({
      statusCode: httpException.getStatus(),
      message,
    });
  }
}

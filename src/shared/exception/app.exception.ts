import { HttpException } from '@nestjs/common';

// base exception
export abstract class AppException extends Error {
  httpException: HttpException;

  constructor(message: string, httpException: HttpException) {
    super(message);
    this.httpException = httpException;
  }

  public toHttpException(): HttpException {
    return this.httpException;
  }
}

import { InternalServerErrorException } from '@nestjs/common';
import { AppException } from './app.exception';

export class UnknownException extends AppException {
  constructor() {
    super('Unknown internal exception', new InternalServerErrorException());
  }
}

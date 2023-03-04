import { ConflictException } from '@nestjs/common';
import { AppException } from '../../shared/exception/app.exception';

export class EmailExistsException extends AppException {
  constructor() {
    super('This email already exists.', new ConflictException());
  }
}

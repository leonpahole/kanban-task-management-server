import { NotFoundException } from '@nestjs/common';
import { AppException } from '../../shared/exception/app.exception';

export class BoardNotFoundException extends AppException {
  constructor() {
    super('Board not found', new NotFoundException());
  }
}

import { NotFoundException } from '@nestjs/common';
import { AppException } from './app.exception';

export class EntityNotFoundException extends AppException {
  constructor() {
    super('Entity not found', new NotFoundException());
  }
}

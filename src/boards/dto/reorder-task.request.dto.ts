import { IsDefined } from 'class-validator';

export class ReorderTaskRequestDto {
  @IsDefined()
  columnId: number;

  insertAfterTaskId?: number;
}

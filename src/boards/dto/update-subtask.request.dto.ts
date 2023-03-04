import { IsDefined } from 'class-validator';

export class UpdateSubtaskRequestDto {
  @IsDefined()
  isCompleted: boolean;
}

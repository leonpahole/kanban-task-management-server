import { Type } from 'class-transformer';
import { MaxLength, ValidateNested } from 'class-validator';
import { CreateTaskRequestSubtaskDto } from './create-task.request.dto';

export class UpdateTaskRequestDto {
  @MaxLength(500)
  title?: string;

  @MaxLength(2000)
  description?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateTaskRequestSubtaskDto)
  subtasks: CreateTaskRequestSubtaskDto[];

  columnId?: number;
}

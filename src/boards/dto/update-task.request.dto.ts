import { Type } from 'class-transformer';
import { MaxLength, IsOptional, ValidateNested } from 'class-validator';
import { CreateTaskRequestSubtaskDto } from './create-task.request.dto';

export class UpdateTaskRequestDto {
  @IsOptional()
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskRequestSubtaskDto)
  subtasks: CreateTaskRequestSubtaskDto[];

  @IsOptional()
  columnId?: number;
}

/* eslint-disable max-classes-per-file */
import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, MaxLength, ValidateNested } from 'class-validator';

export class CreateTaskRequestSubtaskDto {
  id?: number;

  @IsNotEmpty()
  @MaxLength(500)
  name!: string;
}

export class CreateTaskRequestDto {
  @IsNotEmpty()
  @MaxLength(500)
  title!: string;

  @MaxLength(2000)
  description?: string;

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskRequestSubtaskDto)
  subtasks: CreateTaskRequestSubtaskDto[];
}

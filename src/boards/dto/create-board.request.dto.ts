/* eslint-disable max-classes-per-file */
import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, MaxLength, ValidateNested } from 'class-validator';

export class CreateBoardRequestColumnDto {
  id?: number;

  @IsNotEmpty()
  @MaxLength(500)
  name!: string;
}

export class CreateBoardRequestDto {
  @IsNotEmpty()
  @MaxLength(500)
  name!: string;

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CreateBoardRequestColumnDto)
  columns: CreateBoardRequestColumnDto[];
}

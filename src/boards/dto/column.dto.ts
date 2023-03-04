import { ColumnEntity } from '../entity/column.entity';
import { TaskDto } from './task.dto';

export class ColumnDto {
  id!: number;

  name!: string;

  tasks!: TaskDto[];

  static fromEntity(column: ColumnEntity): ColumnDto {
    return {
      id: column.id,
      name: column.name,
      tasks: TaskDto.fromEntities(column.tasks),
    };
  }

  static fromEntities(columns: ColumnEntity[]): ColumnDto[] {
    return columns.map((l) => ColumnDto.fromEntity(l));
  }
}

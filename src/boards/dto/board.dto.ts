import { BoardEntity } from '../entity/board.entity';
import { ColumnDto } from './column.dto';

export class BoardDto {
  id!: number;

  name!: string;

  columns!: ColumnDto[];

  static fromEntity(board: BoardEntity): BoardDto {
    return {
      id: board.id,
      name: board.name,
      columns: ColumnDto.fromEntities(board.columns),
    };
  }

  static fromEntities(boards: BoardEntity[]): BoardDto[] {
    return boards.map((l) => BoardDto.fromEntity(l));
  }
}

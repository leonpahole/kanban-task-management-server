import { BoardEntity } from '../entity/board.entity';

export class BoardExceprtDto {
  id!: number;

  name!: string;

  static fromEntity(board: BoardEntity): BoardExceprtDto {
    return {
      id: board.id,
      name: board.name,
    };
  }

  static fromEntities(boards: BoardEntity[]): BoardExceprtDto[] {
    return boards.map((l) => BoardExceprtDto.fromEntity(l));
  }
}

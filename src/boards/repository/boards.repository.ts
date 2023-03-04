import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BoardEntity } from '../entity/board.entity';

@Injectable()
export class BoardsRepository extends Repository<BoardEntity> {
  constructor(dataSource: DataSource) {
    super(BoardEntity, dataSource.createEntityManager());
  }
}

import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SubtaskEntity } from '../entity/subtask.entity';

@Injectable()
export class SubtasksRepository extends Repository<SubtaskEntity> {
  constructor(dataSource: DataSource) {
    super(SubtaskEntity, dataSource.createEntityManager());
  }
}

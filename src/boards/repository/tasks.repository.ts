import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TaskEntity } from '../entity/task.entity';

@Injectable()
export class TasksRepository extends Repository<TaskEntity> {
  constructor(dataSource: DataSource) {
    super(TaskEntity, dataSource.createEntityManager());
  }
}

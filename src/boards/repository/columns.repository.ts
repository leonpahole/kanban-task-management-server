import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ColumnEntity } from '../entity/column.entity';

@Injectable()
export class ColumnsRepository extends Repository<ColumnEntity> {
  constructor(dataSource: DataSource) {
    super(ColumnEntity, dataSource.createEntityManager());
  }
}

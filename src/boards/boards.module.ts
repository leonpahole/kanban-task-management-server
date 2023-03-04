import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsController } from './controller/boards.controller';
import { TasksController } from './controller/tasks.controller';
import { BoardEntity } from './entity/board.entity';
import { ColumnEntity } from './entity/column.entity';
import { SubtaskEntity } from './entity/subtask.entity';
import { TaskEntity } from './entity/task.entity';
import { BoardsRepository } from './repository/boards.repository';
import { ColumnsRepository } from './repository/columns.repository';
import { SubtasksRepository } from './repository/subtasks.entity';
import { TasksRepository } from './repository/tasks.repository';
import { BoardsService } from './service/boards.service';
import { TasksService } from './service/tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity, ColumnEntity, TaskEntity, SubtaskEntity])],
  controllers: [BoardsController, TasksController],
  providers: [
    BoardsService,
    TasksService,
    BoardsRepository,
    ColumnsRepository,
    TasksRepository,
    SubtasksRepository,
  ],
})
export class BoardsModule {}

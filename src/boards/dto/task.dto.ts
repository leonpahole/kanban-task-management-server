import { TaskEntity } from '../entity/task.entity';
import { SubtaskDto } from './subtask.dto';

export class TaskDto {
  id!: number;

  title!: string;

  columnId?: number;

  description!: string;

  subtasks!: SubtaskDto[];

  static fromEntity(task: TaskEntity): TaskDto {
    return {
      id: task.id,
      title: task.title,
      columnId: task.column?.id,
      description: task.description,
      subtasks: SubtaskDto.fromEntities(task.subtasks),
    };
  }

  static fromEntities(tasks: TaskEntity[]): TaskDto[] {
    return tasks.map((l) => TaskDto.fromEntity(l));
  }
}

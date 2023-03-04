import { SubtaskEntity } from '../entity/subtask.entity';

export class SubtaskDto {
  id!: number;

  name!: string;

  isCompleted!: boolean;

  static fromEntity(subtask: SubtaskEntity): SubtaskDto {
    return {
      id: subtask.id,
      name: subtask.name,
      isCompleted: subtask.isCompleted,
    };
  }

  static fromEntities(subtasks: SubtaskEntity[]): SubtaskDto[] {
    return subtasks.map((l) => SubtaskDto.fromEntity(l));
  }
}

import { SubtaskEntity } from '../entity/subtask.entity';

export class SubtaskDto {
  id!: number;

  name!: string;

  static fromEntity(subtask: SubtaskEntity): SubtaskDto {
    return {
      id: subtask.id,
      name: subtask.name,
    };
  }

  static fromEntities(subtasks: SubtaskEntity[]): SubtaskDto[] {
    return subtasks.map((l) => SubtaskDto.fromEntity(l));
  }
}

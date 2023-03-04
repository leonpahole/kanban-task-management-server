import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { TaskEntity } from './task.entity';

@Entity({ name: 'subtask' })
export class SubtaskEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  isCompleted!: boolean;

  @ManyToOne(() => TaskEntity, (task) => task.subtasks)
  task!: TaskEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  lastUpdatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}

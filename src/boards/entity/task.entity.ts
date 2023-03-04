import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
  Generated,
  RelationId,
} from 'typeorm';
import { ColumnEntity } from './column.entity';
import { SubtaskEntity } from './subtask.entity';

@Entity({ name: 'task' })
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ default: '' })
  description!: string;

  @Column()
  @Generated('increment')
  sequenceNumber!: number;

  @ManyToOne(() => ColumnEntity, (column) => column.tasks)
  column!: ColumnEntity;

  @RelationId((task: TaskEntity) => task.column)
  columnId: number;

  @OneToMany(() => SubtaskEntity, (subtask) => subtask.task)
  subtasks!: SubtaskEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  lastUpdatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}

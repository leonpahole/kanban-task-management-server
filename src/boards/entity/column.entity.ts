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
} from 'typeorm';
import { BoardEntity } from './board.entity';
import { TaskEntity } from './task.entity';

@Entity({ name: 'column' })
export class ColumnEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  @Generated('increment')
  sequenceNumber!: number;

  @ManyToOne(() => BoardEntity, (board) => board.columns)
  board!: BoardEntity;

  @OneToMany(() => TaskEntity, (task) => task.column)
  tasks!: TaskEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  lastUpdatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}

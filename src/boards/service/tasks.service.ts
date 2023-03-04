import { Injectable, Logger } from '@nestjs/common';
import { FindOptionsRelations, In, IsNull } from 'typeorm';
import { successfulResponse, SuccessResponseDto } from '../../shared/dto/success-response.dto';
import { EntityNotFoundException } from '../../shared/exception/entity-not-found.exception';
import { CreateTaskRequestDto, CreateTaskRequestSubtaskDto } from '../dto/create-task.request.dto';
import { ReorderTaskRequestDto } from '../dto/reorder-task.request.dto';
import { TaskDto } from '../dto/task.dto';
import { UpdateSubtaskRequestDto } from '../dto/update-subtask.request.dto';
import { UpdateTaskRequestDto } from '../dto/update-task.request.dto';
import { ColumnEntity } from '../entity/column.entity';
import { SubtaskEntity } from '../entity/subtask.entity';
import { TaskEntity } from '../entity/task.entity';
import { BoardNotFoundException } from '../exception/board-not-found-exception';
import { ColumnsRepository } from '../repository/columns.repository';
import { SubtasksRepository } from '../repository/subtasks.entity';
import { TasksRepository } from '../repository/tasks.repository';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private columnsRepository: ColumnsRepository,
    private tasksRespository: TasksRepository,
    private subtasksRepository: SubtasksRepository,
  ) {}

  public async getEntity(
    id: number,
    userId: string,
    relations: FindOptionsRelations<TaskEntity> = {
      subtasks: true,
      column: true,
    },
  ): Promise<TaskEntity> {
    const task = await this.tasksRespository.findOne({
      where: {
        column: {
          board: {
            userId,
          },
        },
        id,
        deletedAt: IsNull(),
      },
      relations,
    });

    if (!task) {
      throw new EntityNotFoundException();
    }

    return task;
  }

  public async get(id: number, userId: string): Promise<TaskDto> {
    const task = await this.getEntity(id, userId);
    return TaskDto.fromEntity(task);
  }

  public async create(
    boardId: number,
    columnId: number,
    req: CreateTaskRequestDto,
    userId: string,
  ): Promise<TaskDto> {
    const column = await this.columnsRepository.findOne({
      where: {
        id: columnId,
        board: {
          id: boardId,
          userId,
        },
      },
    });

    if (!column) {
      throw new BoardNotFoundException();
    }

    const newTask = await this.tasksRespository.save({
      column,
      title: req.title,
      description: req.description,
    });

    await this.createSubtasks(newTask, req.subtasks);

    return this.get(newTask.id, userId);
  }

  private async createSubtasks(
    task: TaskEntity,
    subtasks: CreateTaskRequestSubtaskDto[],
  ): Promise<void> {
    if (subtasks.length === 0) {
      return;
    }

    await this.subtasksRepository
      .createQueryBuilder()
      .insert()
      .into(SubtaskEntity)
      .values(
        subtasks.map((s) => ({
          task,
          name: s.name,
        })),
      )
      .execute();
  }

  public async update(id: number, req: UpdateTaskRequestDto, userId: string): Promise<TaskDto> {
    const task = await this.getEntity(id, userId, {
      subtasks: true,
      column: {
        board: true,
      },
    });

    let columnToUpdate: ColumnEntity | undefined;
    if (req.columnId != null && req.columnId !== task.column.id) {
      columnToUpdate = await this.columnsRepository.findOne({
        where: { id: req.columnId, board: { id: task.column.board.id } },
      });

      if (!columnToUpdate) {
        throw new EntityNotFoundException();
      }
    }

    const subtasksToAdd = req.subtasks.filter((c) => c.id == null);
    await this.createSubtasks(task, subtasksToAdd);

    const subtasksToUpdate = req.subtasks.filter((c) =>
      task.subtasks.some((col) => col.id === c.id),
    );

    await this.subtasksRepository
      .createQueryBuilder()
      .insert()
      .into(SubtaskEntity)
      .values(subtasksToUpdate.map((c) => ({ id: c.id, name: c.name })))
      .orUpdate(['name'], 'PK_cee3c7ee3135537fb8f5df4422b')
      .execute();

    const subtasksToRemove = task.subtasks.filter(
      (t) => !req.subtasks.some((st) => st.id === t.id),
    );

    await this.subtasksRepository.update(
      { id: In(subtasksToRemove.map((c) => c.id)) },
      { deletedAt: new Date() },
    );

    await this.tasksRespository.update(
      { id: task.id, description: task.description, column: columnToUpdate },
      { title: req.title },
    );

    return this.get(id, userId);
  }

  public async delete(id: number, userId: string): Promise<SuccessResponseDto> {
    const deleteResult = await this.tasksRespository.update(
      { id, column: { board: { userId } } },
      { deletedAt: new Date() },
    );

    if (!deleteResult.affected) {
      throw new EntityNotFoundException();
    }

    return successfulResponse();
  }

  public async updateSubtaskStatus(
    id: number,
    taskId: number,
    req: UpdateSubtaskRequestDto,
    userId: string,
  ): Promise<TaskDto> {
    const task = await this.getEntity(taskId, userId, {
      subtasks: true,
    });

    const subtask = task.subtasks.find((st) => st.id === id);
    if (subtask == null) {
      throw new EntityNotFoundException();
    }

    subtask.isCompleted = req.isCompleted;
    await this.subtasksRepository.save(subtask);

    return TaskDto.fromEntity(task);
  }

  public async reorderTask(
    id: number,
    req: ReorderTaskRequestDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    await this.columnsRepository.query(
      `
      do $$ 
      declare
         taskId    						          integer := ${id};
         
         insertToColumn    				      integer := ${req.columnId};
         insertAfterTaskId 				      integer := ${req.insertAfterTaskId ?? 0};
         
         userId    		                  varchar := '${userId}';
         
         newColumnId						        integer;
         insertAfterTaskSequenceNumber 	integer;
         newSequenceNumber				      integer;
         taskExists						          integer;
         lowestSequenceNumber           integer;
      begin
        select into taskExists count(*)
        from public.task
        LEFT JOIN public.column ON public.column.id = public.task."columnId"
        LEFT JOIN public.board ON public.board.id = public.column."boardId" 
        WHERE public.task.id = taskId AND public.board."userId" = userId;
        
        if taskExists = 0 then
          RAISE exception 'Task not found';
        end if;
        
        if insertAfterTaskId = 0 then
          SELECT INTO newColumnId public.column.id
          FROM public.column
          LEFT JOIN public.board ON public.board.id = public.column."boardId" 
          WHERE public.column.id = insertToColumn AND public.board."userId" = userId;

          SELECT INTO lowestSequenceNumber COALESCE(MIN("sequenceNumber"), 1)
          FROM public.task
          WHERE public.task."columnId" = newColumnId;
          
          newSequenceNumber := lowestSequenceNumber;
        else
          SELECT INTO newColumnId, insertAfterTaskSequenceNumber public.column.id, public.task."sequenceNumber"
          FROM public.task
          LEFT JOIN public.column ON public.column.id = public.task."columnId"
          LEFT JOIN public.board ON public.board.id = public.column."boardId" 
          WHERE public.task.id = insertAfterTaskId AND public.column.id = insertToColumn AND public.board."userId" = userId;
          
          newSequenceNumber := insertAfterTaskSequenceNumber + 1;
        end if;
        
        if newColumnId IS NULL then
          RAISE exception 'New column id is null';
        end if;
        
        UPDATE public.task
        SET "columnId" = newColumnId, "sequenceNumber" = newSequenceNumber
        WHERE public.task.id = taskId;
        
        UPDATE public.task SET "sequenceNumber" = CASE
          WHEN id = taskId THEN newSequenceNumber                       	
          WHEN "sequenceNumber" < newSequenceNumber 	THEN "sequenceNumber" - 1
          WHEN "sequenceNumber" >= newSequenceNumber 	THEN "sequenceNumber" + 1
        END
        WHERE "columnId" = newColumnId;
      end $$
    `,
      [],
    );

    return successfulResponse();
  }
}

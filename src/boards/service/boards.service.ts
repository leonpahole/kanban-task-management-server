import { Injectable, Logger } from '@nestjs/common';
import { In, IsNull } from 'typeorm';
import { successfulResponse, SuccessResponseDto } from '../../shared/dto/success-response.dto';
import { BoardExceprtDto } from '../dto/board-excerpt.dto';
import { BoardDto } from '../dto/board.dto';
import {
  CreateBoardRequestColumnDto,
  CreateBoardRequestDto,
} from '../dto/create-board.request.dto';
import { ReorderColumnRequestDto } from '../dto/reorder-column.request.dto';
import { BoardEntity } from '../entity/board.entity';
import { ColumnEntity } from '../entity/column.entity';
import { BoardNotFoundException } from '../exception/board-not-found-exception';
import { BoardsRepository } from '../repository/boards.repository';
import { ColumnsRepository } from '../repository/columns.repository';

@Injectable()
export class BoardsService {
  private readonly logger = new Logger(BoardsService.name);

  constructor(
    private boardsRepository: BoardsRepository,
    private columnsRepository: ColumnsRepository,
  ) {}

  public async list(userId: string): Promise<BoardExceprtDto[]> {
    const boards = await this.boardsRepository.find({
      where: { userId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
    return BoardExceprtDto.fromEntities(boards);
  }

  public async get(id: number, userId: string): Promise<BoardDto> {
    const board = await this.boardsRepository.findOne({
      where: {
        userId,
        id,
        deletedAt: IsNull(),
        columns: {
          deletedAt: IsNull(),
          tasks: {
            deletedAt: IsNull(),
            subtasks: {
              deletedAt: IsNull(),
            },
          },
        },
      },
      order: {
        createdAt: 'DESC',
        columns: {
          sequenceNumber: 'ASC',
          tasks: { sequenceNumber: 'ASC', subtasks: { createdAt: 'DESC' } },
        },
      },
      relations: {
        columns: {
          tasks: {
            subtasks: true,
          },
        },
      },
    });

    if (!board) {
      throw new BoardNotFoundException();
    }

    return BoardDto.fromEntity(board);
  }

  public async create(req: CreateBoardRequestDto, userId: string): Promise<BoardDto> {
    const newBoard = await this.boardsRepository.save({
      userId,
      name: req.name,
    });

    await this.createColumns(newBoard, req.columns);

    return this.get(newBoard.id, userId);
  }

  private async createColumns(
    board: BoardEntity,
    columns: CreateBoardRequestColumnDto[],
  ): Promise<void> {
    if (columns.length === 0) {
      return;
    }

    await this.columnsRepository
      .createQueryBuilder()
      .insert()
      .into(ColumnEntity)
      .values(
        columns.map((c) => ({
          board,
          name: c.name,
        })),
      )
      .execute();
  }

  public async update(id: number, req: CreateBoardRequestDto, userId: string): Promise<BoardDto> {
    const board = await this.boardsRepository.findOne({
      where: { id, userId },
      relations: { columns: true },
    });

    if (!board) {
      throw new BoardNotFoundException();
    }

    const columnsToAdd = req.columns.filter((c) => c.id == null);
    await this.createColumns(board, columnsToAdd);

    const columnsToUpdate = req.columns.filter((c) => board.columns.some((col) => col.id === c.id));
    for (const column of columnsToUpdate) {
      await this.columnsRepository.update({ id: column.id, board: { id } }, { name: column.name });
    }

    const columnsToRemove = board.columns.filter(
      (c) => !req.columns.some((col) => col.id === c.id),
    );

    await this.columnsRepository.update(
      { id: In(columnsToRemove.map((c) => c.id)), board: { id } },
      { deletedAt: new Date() },
    );

    await this.boardsRepository.update({ id: board.id, userId }, { name: req.name });

    return this.get(id, userId);
  }

  public async delete(id: number, userId: string): Promise<SuccessResponseDto> {
    const deleteResult = await this.boardsRepository.update(
      { id, userId, deletedAt: IsNull() },
      { deletedAt: new Date() },
    );

    if (!deleteResult.affected) {
      throw new BoardNotFoundException();
    }

    return successfulResponse();
  }

  public async reorderColumn(
    id: number,
    req: ReorderColumnRequestDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    await this.columnsRepository.query(
      `
      do $$ 
      declare
        columnId    		  	    integer := ${id};
        insertAfterColumnId     integer := ${req.insertAfterColumnId};
        userId    		    	    varchar := '${userId}';
		 
        boardId			            integer;
		 
		    insertAfterColumnBoardId   integer;
		    insertAfterColumnSequenceNumber integer;
		    lowestSequenceNumber integer;
		 
        oldPosition		  	      integer;
        newPosition		  	      integer;
      begin 
	  
      SELECT INTO boardId, oldPosition public.column."boardId", public.column."sequenceNumber"
        FROM public.column
        LEFT JOIN public.board ON public.column."boardId" = public.board.id 
        WHERE public.column.id = columnId AND public.board."userId" = userId;
      
        if boardId IS NULL then
          raise exception 'Column not found';
      end if;
	  
	  	if insertAfterColumnId != 0 then
        SELECT INTO insertAfterColumnBoardId, insertAfterColumnSequenceNumber public.column."boardId", public.column."sequenceNumber"
        FROM public.column
        LEFT JOIN public.board ON public.column."boardId" = public.board.id 
        WHERE public.column.id = insertAfterColumnId AND public.board."userId" = userId;
        
        if insertAfterColumnBoardId IS NULL then
          raise exception 'Insert after column not found';
        end if;
			
			  newPosition := insertAfterColumnSequenceNumber + 1;
		  else
        SELECT INTO lowestSequenceNumber COALESCE(MIN("sequenceNumber"), 1)
        FROM public.column
        WHERE public.column."boardId" = boardId;

			  newPosition := lowestSequenceNumber;
		  end if;
		
      UPDATE public.column SET "sequenceNumber" = CASE
        WHEN id = columnId THEN newPosition
        WHEN "sequenceNumber" < newPosition THEN "sequenceNumber" - 1
        WHEN "sequenceNumber" >= newPosition THEN "sequenceNumber" + 1
      END
      WHERE "boardId" = boardId;
    end $$
    `,
      [],
    );

    return successfulResponse();
  }
}

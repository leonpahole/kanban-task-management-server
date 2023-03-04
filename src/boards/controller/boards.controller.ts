import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  Request,
} from '@nestjs/common';
import { SuccessResponseDto } from '../../shared/dto/success-response.dto';
import { IRequest } from '../../shared/types/IRequest';
import { BoardExceprtDto } from '../dto/board-excerpt.dto';
import { BoardDto } from '../dto/board.dto';
import { CreateBoardRequestDto } from '../dto/create-board.request.dto';
import { CreateTaskRequestDto } from '../dto/create-task.request.dto';
import { ReorderColumnRequestDto } from '../dto/reorder-column.request.dto';
import { TaskDto } from '../dto/task.dto';
import { BoardsService } from '../service/boards.service';
import { TasksService } from '../service/tasks.service';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService, private tasksService: TasksService) {}

  @Get()
  public list(@Request() req: IRequest): Promise<BoardExceprtDto[]> {
    return this.boardsService.list(req.user.sub);
  }

  @Get(':id')
  public get(@Req() req: IRequest, @Param('id') id: number): Promise<BoardDto> {
    return this.boardsService.get(id, req.user.sub);
  }

  @Post()
  public create(@Req() req: IRequest, @Body() body: CreateBoardRequestDto): Promise<BoardDto> {
    return this.boardsService.create(body, req.user.sub);
  }

  @Patch(':id')
  public update(
    @Req() req: IRequest,
    @Param('id') id: number,
    @Body() body: CreateBoardRequestDto,
  ): Promise<BoardDto> {
    return this.boardsService.update(id, body, req.user.sub);
  }

  @Delete(':id')
  @HttpCode(204)
  public delete(@Req() req: IRequest, @Param('id') id: number): Promise<SuccessResponseDto> {
    return this.boardsService.delete(id, req.user.sub);
  }

  @Post(':boardId/columns/:columnId/tasks')
  public createTask(
    @Req() req: IRequest,
    @Param('boardId') boardId: number,
    @Param('columnId') columnId: number,
    @Body() body: CreateTaskRequestDto,
  ): Promise<TaskDto> {
    return this.tasksService.create(boardId, columnId, body, req.user.sub);
  }

  @Patch(':boardId/columns/:id/reorder')
  public reorderColumn(
    @Req() req: IRequest,
    @Param('id') id: number,
    @Body() body: ReorderColumnRequestDto,
  ): Promise<SuccessResponseDto> {
    return this.boardsService.reorderColumn(id, body, req.user.sub);
  }
}

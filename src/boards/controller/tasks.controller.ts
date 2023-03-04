import { Body, Controller, Delete, Param, Patch, Req } from '@nestjs/common';
import { SuccessResponseDto } from '../../shared/dto/success-response.dto';
import { IRequest } from '../../shared/types/IRequest';
import { ReorderTaskRequestDto } from '../dto/reorder-task.request.dto';
import { TaskDto } from '../dto/task.dto';
import { UpdateSubtaskRequestDto } from '../dto/update-subtask.request.dto';
import { UpdateTaskRequestDto } from '../dto/update-task.request.dto';
import { TasksService } from '../service/tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Patch(':id')
  public updateTask(
    @Req() req: IRequest,
    @Param('id') id: number,
    @Body() body: UpdateTaskRequestDto,
  ): Promise<TaskDto> {
    return this.tasksService.update(id, body, req.user.sub);
  }

  @Delete(':id')
  public deleteTask(@Req() req: IRequest, @Param('id') id: number): Promise<SuccessResponseDto> {
    return this.tasksService.delete(id, req.user.sub);
  }

  @Patch(':taskId/subtasks/:id')
  public updateSubtaskStatus(
    @Req() req: IRequest,
    @Param('taskId') taskId: number,
    @Param('id') id: number,
    @Body() body: UpdateSubtaskRequestDto,
  ): Promise<TaskDto> {
    return this.tasksService.updateSubtaskStatus(id, taskId, body, req.user.sub);
  }

  @Patch(':id/reorder')
  public reorderTask(
    @Req() req: IRequest,
    @Param('id') id: number,
    @Body() body: ReorderTaskRequestDto,
  ): Promise<SuccessResponseDto> {
    return this.tasksService.reorderTask(id, body, req.user.sub);
  }
}

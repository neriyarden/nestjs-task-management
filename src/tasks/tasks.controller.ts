import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @UsePipes(ValidationPipe)
  getTasks(@Query() getTasksFilterDto: GetTasksFilterDto): Task[] {
    const areAnyFiltersProvided = Object.keys(getTasksFilterDto).length;
    if (areAnyFiltersProvided) {
      return this.tasksService.getTasksWithFilters(getTasksFilterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete(':id')
  deleteTaskById(@Param('id') id: string): Task {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch(':id/status')
  UpdateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatus(id, status);
  }
}

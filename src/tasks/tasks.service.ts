import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    const results = this.tasks;
    if (!results.length) {
      throw new NotFoundException('Tasks not found');
    }
    return results;
  }

  getTasksWithFilters(getTasksFilterDto: GetTasksFilterDto): Task[] {
    const { status, search } = getTasksFilterDto;

    const results = this.tasks.filter((task) => {
      if (status && task.status !== status) {
        return false;
      }

      if (
        search &&
        !(task.description.includes(search) || task.title.includes(search))
      ) {
        return false;
      }
      return true;
    });

    if (!results.length) {
      throw new NotFoundException('Tasks not found');
    }
    return results;
  }

  getTaskById(taskId: string): Task {
    const result = this.tasks.find((task) => task.id === taskId);
    if (!result) {
      throw new NotFoundException(`Task with id "${taskId}" is not found`);
    }
    return result;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const newTask = {
      id: randomBytes(16).toString('hex'),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  deleteTaskById(id: string): Task {
    const task = this.getTaskById(id);
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    this.tasks.splice(taskIndex, 1);
    return task;
  }

  updateTaskStatus(id: string, newStatus: TaskStatus): Task {
    const taskToUpdate = this.getTaskById(id);

    const isNewStatusString = !newStatus || typeof newStatus !== 'string';
    const isNewStatusValid = !Object.values(TaskStatus).includes(newStatus);

    if (isNewStatusString || isNewStatusValid || !taskToUpdate) {
      return null;
    }

    taskToUpdate.status = newStatus;

    return taskToUpdate;
  }
}

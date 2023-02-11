import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { CreateTaskDto } from './dto/create-task.dto';

import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(taskId: string): Task {
    return this.tasks.find((task) => task.id === taskId);
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
    const task = this.tasks.find((task) => task.id === id);
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

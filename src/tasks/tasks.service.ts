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
}

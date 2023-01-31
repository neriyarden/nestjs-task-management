import { Injectable } from '@nestjs/common';
import crypto from 'crypto';

import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  createTask(title: Task['title'], description: Task['description']): Task {
    const id = crypto.randomBytes(16).toString('hex');
    const newTask = {
      id,
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(newTask);
    return newTask;
  }
}

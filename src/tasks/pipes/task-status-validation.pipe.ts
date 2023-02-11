import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: unknown) {
    if (typeof value !== 'string') {
      throw new BadRequestException(`status "${value}" must be of type string`);
    }

    const valueInUpperCase = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`status "${value}" is an invalid status`);
    }

    return valueInUpperCase;
  }

  private isStatusValid(status: string) {
    return this.allowedStatuses.includes(status as TaskStatus);
  }
}

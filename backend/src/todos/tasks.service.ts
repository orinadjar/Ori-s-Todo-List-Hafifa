import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { TodosService } from './todos.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly todosService: TodosService) {}

  @Cron('0 9 * * *')
  async handleOldTasksCronClean() {
    this.logger.debug('Running clean for old tasks..');
    try {
      const result = await this.todosService.cleanOldTasks();
      this.logger.log('clean success', result);
    } catch (error) {
      this.logger.log('error while cleaning old tasks', error);
    }
  }
}

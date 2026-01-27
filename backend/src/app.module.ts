import { Module } from '@nestjs/common';

import { DbModule } from './db/db.module';
import { TodosModule } from './todos/todos.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { TodosService } from './todos/todos.service';
import { TodosController } from './todos/todos.controller';
import { TasksService } from './todos/tasks.service';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ScheduleModule.forRoot(), DbModule, TodosModule],
  providers: [TodosService, TasksService],
  controllers: [TodosController],
})
export class AppModule { }

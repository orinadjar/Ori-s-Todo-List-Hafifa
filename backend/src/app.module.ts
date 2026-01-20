import { Module } from '@nestjs/common';

import { DbModule } from './db/db.module';
import { TodosModule } from './todos/todos.module';
import { ConfigModule } from '@nestjs/config';

import { TodosService } from './todos/todos.service';
import { TodosController } from './todos/todos.controller';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule, TodosModule],
  providers: [TodosService],
  controllers: [TodosController],
})
export class AppModule { }

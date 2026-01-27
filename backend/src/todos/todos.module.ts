import { Module } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { TodosController } from "./todos.controller";
import { TasksService } from './tasks.service';

@Module({
    controllers: [TodosController],
    providers: [TodosService, TasksService],
})
export class TodosModule {}
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';

import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto } from './dto/todos.dto'


@Controller('todos')
export class TodosController {
    constructor(private readonly todosService: TodosService) { };

    @Get()
    findAll() {
        return this.todosService.findAllTodos();
    }

    @Post('/filter')
    findAllFfiltered(@Body('filterGeometry') filterGeometry: string) {
        return this.todosService.findAllTodos(filterGeometry);
    }

    @Post()
    createTodo(@Body() createTodoDto: CreateTodoDto) {
        return this.todosService.addTodo(createTodoDto);
    }

    @Delete(':id')
    removeTodo(@Param('id') todoId: string) {
        return this.todosService.deleteTodo(todoId);
    }

    @Patch(':id')
    patchTodos(@Param('id') todoId: string, @Body() fields: UpdateTodoDto) {
        return this.todosService.updateTodo(todoId, fields);
    }

    @Patch('/:id/toggle')
    patchCompletedTodo(@Param('id') todoId: string) {
        return this.todosService.toggleTodo(todoId);
    }

}

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';

import { TodosService } from './todos.service';
import { ZodValidationPipe } from '../common/pipes/zodVlaidation.pipe';
import { CreateTodoSchema, updateTodoSchema, type CreateTodoDto, type UpdateTodoDto } from '../dto/todosDto.dto';


@Controller('todos')
export class TodosController {
    constructor(private readonly todosService: TodosService) { };

    @Get()
    findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
        return this.todosService.findAllTodos(limit, offset);
    }

    @Post('/filter')
    findAllFiltered(@Body('filterGeometry') filterGeometry: string, @Query('limit') limit: number, @Query('offset') offset: number) {
        return this.todosService.findAllTodos(limit, offset, filterGeometry);
    }

    @Post()
    @UsePipes(new ZodValidationPipe(CreateTodoSchema))
    createTodo(@Body() createTodoDto: CreateTodoDto) {
        return this.todosService.addTodo(createTodoDto);
    }

    @Delete(':id')
    removeTodo(@Param('id') todoId: string) {
        return this.todosService.deleteTodo(todoId);
    }

    @Patch(':id')
    patchTodos(@Param('id') todoId: string, @Body(new ZodValidationPipe(updateTodoSchema)) fields: UpdateTodoDto) {
        return this.todosService.updateTodo(todoId, fields);
    }

    @Patch('/:id/toggle')
    patchCompletedTodo(@Param('id') todoId: string) {
        return this.todosService.toggleTodo(todoId);
    }

}

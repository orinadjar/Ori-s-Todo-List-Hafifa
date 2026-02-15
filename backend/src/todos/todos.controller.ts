import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';

import { TodosService } from './todos.service';
import { ZodValidationPipe } from '../common/pipes/zodVlaidation.pipe';
import {
  CreateTodoSchema,
  FilterGeometrySchema,
  PaginationQuerySchema,
  updateTodoSchema,
  type CreateTodoDto,
  type FilterGeometryDto,
  type UpdateTodoDto,
} from '../dto/todosDto.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll(
    @Query('limit', new ZodValidationPipe(PaginationQuerySchema)) limit: number,
    @Query('offset', new ZodValidationPipe(PaginationQuerySchema))
    offset: number,
  ) {
    return this.todosService.findAllTodos(limit, offset);
  }

  @Post('/filter')
  findAllFiltered(
    @Body('filterGeometry', new ZodValidationPipe(FilterGeometrySchema))
    filterGeometry: FilterGeometryDto,
    @Query('limit', new ZodValidationPipe(PaginationQuerySchema)) limit: number,
    @Query('offset', new ZodValidationPipe(PaginationQuerySchema))
    offset: number,
  ) {
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
  patchTodos(
    @Param('id') todoId: string,
    @Body(new ZodValidationPipe(updateTodoSchema)) fields: UpdateTodoDto,
  ) {
    return this.todosService.updateTodo(todoId, fields);
  }

  @Patch('/:id/toggle')
  patchCompletedTodo(@Param('id') todoId: string) {
    return this.todosService.toggleTodo(todoId);
  }
}

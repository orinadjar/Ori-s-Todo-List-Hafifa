import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';

import { TodosController } from '../todos.controller';
import { TodosService } from '../todos.service';
import { CreateTodoDto, UpdateTodoDto } from 'src/dto/todosDto.dto';

describe('TodosController', () => {
  let todosController: TodosController;
  let todosService: TodosService;

  const mockTodosService = {
    findAllTodos: vi.fn(),
    addTodo: vi.fn(),
    deleteTodo: vi.fn(),
    updateTodo: vi.fn(),
    toggleTodo: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: mockTodosService,
        },
      ],
    }).compile();

    todosController = module.get(TodosController);
    todosService = module.get(TodosService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(todosController).toBeDefined();
    expect(todosService).toBeDefined();
  });

  it('GET /todos, should call findAllTodos with correct parameters and return expected result', async () => {
    const limit = 15;
    const offset = 0;
    const expectedResult = [
      {
        id: '1',
        name: 'Sample Todo',
        subject: 'Work',
        priority: 5,
        date: new Date(),
        isCompleted: false,
        geometryType: 'Point',
        lat: 0,
        lng: 0,
        coordinates: null,
      },
    ];

    mockTodosService.findAllTodos.mockResolvedValue(expectedResult);

    const response = await todosController.findAll(limit, offset);

    expect(mockTodosService.findAllTodos).toHaveBeenCalledWith(limit, offset);
    expect(response).toEqual(expectedResult);
  });

  it('GET /todos/filter, should call findAllTodos with correct parameters and filterGeometry and return expected result', async () => {
    const limit = 15;
    const offset = 0;
    const filterGeometry =
      '{"type":"Polygon","coordinates":[[[3819839.3045508224,3906525.9832158852],[4085504.140501627,3929457.091701438],[3968960.3264575778,3823973.992667895],[3819839.3045508224,3906525.9832158852]]]}';
    const expectedResult = [
      {
        id: '1',
        name: 'Sample Todo',
        subject: 'Work',
        priority: 5,
        date: new Date(),
        isCompleted: false,
        geometryType: 'Point',
        lat: 0,
        lng: 0,
        coordinates: null,
      },
    ];

    mockTodosService.findAllTodos.mockResolvedValue(expectedResult);

    const response = await todosController.findAllFiltered(
      filterGeometry,
      limit,
      offset,
    );

    expect(mockTodosService.findAllTodos).toHaveBeenCalledWith(
      limit,
      offset,
      filterGeometry,
    );
    expect(response).toEqual(expectedResult);
  });

  it('POST /todos, should call addTodo with correct parameters and return expected result', async () => {
    const createTodoDto: CreateTodoDto = {
      name: 'Test Todo',
      subject: 'Work' as const,
      priority: 5,
      date: new Date(),
      geometryType: 'Point' as const,
      lat: 40.7128,
      lng: 74.006,
    };

    const expectedResult = {
      id: 'some-uuid',
      ...createTodoDto,
      isCompleted: false,
      geom: null,
    };

    mockTodosService.addTodo.mockResolvedValue(expectedResult);

    const response = await todosController.createTodo(createTodoDto);

    expect(mockTodosService.addTodo).toHaveBeenCalledWith(createTodoDto);
    expect(response).toEqual(expectedResult);
  });

  it('POST /todos, should call addTodo with invalid todo and throw an error', async () => {
    const invalidTodo: CreateTodoDto = {
      name: '',
      subject: 'Work' as const,
      priority: 5,
      date: new Date(),
      geometryType: 'Point' as const,
      lat: 38.888,
      lng: 39.999,
      coordinates: null,
    };

    mockTodosService.addTodo.mockRejectedValue(new Error('validation error'));

    const result = todosController.createTodo(invalidTodo);

    await expect(result).rejects.toThrow('validation error');
    expect(mockTodosService.addTodo).toHaveBeenCalledWith(invalidTodo);
  });

  it('DELETE /todos:id, should call deleteTodo with correct parameters and return expected result', async () => {
    const todoId = 'todoId';
    const expectedResult = { affected: 1 };

    mockTodosService.deleteTodo.mockResolvedValue(expectedResult);

    const response = await todosController.removeTodo(todoId);

    expect(mockTodosService.deleteTodo).toHaveBeenCalledWith(todoId);
    expect(response).toEqual(expectedResult);
  });

  it('PATCH /todos:id, should call updateTodo with correct parameters and return expected result', async () => {
    const todoId = 'todoId';
    const fields: UpdateTodoDto = {
      name: 'todo 1',
      priority: 7,
    };

    mockTodosService.updateTodo.mockResolvedValue(fields);

    const response = await todosController.patchTodos(todoId, fields);

    expect(mockTodosService.updateTodo).toHaveBeenCalledWith(todoId, fields);
    expect(response).toEqual(fields);
  });

  it('PATCH /todos/:id/toggle, should call toggleTodo with correct parameters and return expected results', async () => {
    const todoId = 'todoId';
    const expectedResult = {
      id: todoId,
      name: 'Toggled',
      subject: 'Personal' as const,
      priority: 3,
      date: new Date(),
      isCompleted: true,
      geometryType: 'Point' as const,
      lat: 70,
      lng: 30,
      coordinates: null,
    };

    mockTodosService.toggleTodo.mockResolvedValue(expectedResult);

    const response = await todosController.patchCompletedTodo(todoId);

    expect(mockTodosService.toggleTodo).toHaveBeenCalledWith(todoId);
    expect(response).toEqual(expectedResult);
  });
});

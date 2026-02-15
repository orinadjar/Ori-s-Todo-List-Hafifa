import { vi, beforeAll, beforeEach, afterAll, afterEach } from 'vitest';
import { Test } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { RedisKeys } from '../../utils/redisKeys.util';
import { setupTestDb, TestDbHelper } from './utils/dbSetup';

import { TodosService } from '../todos.service';
import { DATABASE_CONNECTION } from '../../db/db.module';
import { todos } from '../../db/schema';
import { CreateTodoDto, UpdateTodoDto } from '../../dto/todosDto.dto';

describe('TodoService', () => {
  let todosService: TodosService;
  let dbHelper: TestDbHelper;

  const cacheMock = {
    get: vi.fn(),
    set: vi.fn(),
    clear: vi.fn(),
  };

  beforeAll(async () => {
    dbHelper = await setupTestDb();
  });

  afterAll(async () => {
    if (dbHelper) {
      await dbHelper.cleanup();
    }
  });

  afterEach(async () => {
    if (dbHelper) {
      await dbHelper.db.delete(todos);
    }
  });

  beforeEach(async () => {
    vi.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        TodosService,
        { provide: DATABASE_CONNECTION, useValue: dbHelper.db },
        { provide: CACHE_MANAGER, useValue: cacheMock },
      ],
    }).compile();

    todosService = moduleRef.get(TodosService);
  });

  it('findAllTodos: should return cached todos and not hit db', async () => {
    const limit = 15;
    const offset = 0;

    const cachedTodos = [
      {
        id: 'id',
        name: 'ori',
        subject: 'work',
        priority: 5,
        date: new Date(),
        geometryType: 'Point',
        lan: 38.88,
        lng: 88.88,
        coordinates: null,
      },
    ];

    cacheMock.get.mockResolvedValue(cachedTodos);

    const result = await todosService.findAllTodos(limit, offset);

    expect(result).toEqual(cachedTodos);

    expect(cacheMock.get).toHaveBeenCalledWith(
      RedisKeys.getTodosKey(limit, offset),
    );

    expect(cacheMock.set).not.toHaveBeenCalled();
  });

  it('findAllTodos: should hit db and set the cache todos', async () => {
    const limit = 15;
    const offset = 0;

    const todoData = {
      name: 'Test Todo',
      subject: 'Work' as const,
      priority: 5,
      date: new Date(),
      geometryType: 'Point' as const,
      lat: 38.88,
      lng: 88.88,
      isCompleted: false,
    };

    cacheMock.get.mockResolvedValue(null);

    const [insertedTodo] = await dbHelper.db
      .insert(todos)
      .values(todoData)
      .returning();

    const result = await todosService.findAllTodos(limit, offset);

    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(insertedTodo.id);
    expect(result[0].name).toEqual(insertedTodo.name);

    expect(cacheMock.set).toHaveBeenCalledWith(
      RedisKeys.getTodosKey(limit, offset),
      result,
    );
  });

  it('findAllTodos: should hit db and preforme where with filterGeometry', async () => {
    const limit = 15;
    const offset = 0;
    const filterGeometry = {
      type: 'Polygon' as const,
      coordinates: [
        [
          [77.7, 77.7],
          [77.7, 77.7],
          [77.7, 77.7],
          [77.7, 77.7],
          [77.7, 77.7],
        ],
      ],
    };

    const todoData: CreateTodoDto = {
      name: 'Test Todo',
      subject: 'Work',
      priority: 5,
      date: new Date(),
      geometryType: 'Polygon',
      lat: 0,
      lng: 0,
      coordinates: [
        [
          [77.7, 77.7],
          [77.7, 77.7],
          [77.7, 77.7],
          [77.7, 77.7],
          [77.7, 77.7],
        ],
      ],
    };

    cacheMock.get.mockResolvedValue(null);

    const insertedTodo = await todosService.addTodo(todoData);

    const result = await todosService.findAllTodos(
      limit,
      offset,
      filterGeometry,
    );

    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(insertedTodo.id);
    expect(result[0].name).toEqual(insertedTodo.name);
    expect(result[0].lat).not.toEqual('0');
    expect(result[0].lng).not.toEqual('0');

    expect(cacheMock.set).not.toHaveBeenCalled();
  });

  it('addTodo: should return the new todo and clear cache', async () => {
    const fakeTodo: CreateTodoDto = {
      name: 'mockTodo',
      subject: 'Work',
      priority: 5,
      date: new Date(),
      geometryType: 'Polygon',
      lat: 0,
      lng: 0,
      coordinates: [
        [
          [8, 9],
          [9, 9],
          [33, 8],
          [89, 32],
          [98, 11],
        ],
      ],
    };

    const fakecache = {
      id: '1',
      name: 'mockTodo2',
      subject: 'Work',
      priority: 5,
      date: new Date(),
      geometryType: 'Polygon',
      lat: 0,
      lng: 0,
      coordinates: [
        [
          [8, 9],
          [9, 9],
          [33, 8],
          [89, 32],
          [98, 11],
        ],
      ],
    };

    cacheMock.get.mockResolvedValue(fakecache);

    const result = await todosService.addTodo(fakeTodo);

    expect(result.name).toEqual(fakeTodo.name);
    expect(result.id).not.toEqual(null);
    expect(cacheMock.clear).toHaveBeenCalled();
  });

  it('deleteTodo: should delete the Todo and clear the cache', async () => {
    const limit = 15;
    const offset = 0;

    const todoData: CreateTodoDto = {
      name: 'Test Todo',
      subject: 'Work',
      priority: 5,
      date: new Date(),
      geometryType: 'Polygon',
      lat: 0,
      lng: 0,
      coordinates: [
        [
          [34.75, 32.05],
          [34.85, 32.05],
          [34.85, 32.15],
          [34.75, 32.15],
          [34.75, 32.05],
        ],
      ],
    };

    const insertedTodo = await todosService.addTodo(todoData);

    await todosService.deleteTodo(insertedTodo.id);

    const result = await todosService.findAllTodos(limit, offset);

    expect(result).toHaveLength(0);
    expect(cacheMock.clear).toHaveBeenCalled();
  });

  it('updateTodo: should update the Todo and clear cache', async () => {
    const todoData: CreateTodoDto = {
      name: 'Test Todo',
      subject: 'Work',
      priority: 5,
      date: new Date(),
      geometryType: 'Polygon',
      lat: 0,
      lng: 0,
      coordinates: [
        [
          [34.75, 32.05],
          [34.85, 32.05],
          [34.85, 32.15],
          [34.75, 32.15],
          [34.75, 32.05],
        ],
      ],
    };

    const updateTodoData: UpdateTodoDto = {
      name: 'Updated Todo',
      subject: 'Work',
      priority: 5,
      date: new Date(),
      geometryType: 'Polygon',
      lat: 0,
      lng: 0,
      coordinates: [
        [
          [34.75, 32.05],
          [34.85, 32.05],
          [34.85, 32.15],
          [34.75, 32.15],
          [34.75, 32.05],
        ],
      ],
    };

    const insertedTodo = await todosService.addTodo(todoData);

    const updateTodo = await todosService.updateTodo(
      insertedTodo.id,
      updateTodoData,
    );

    expect(updateTodo.name).toEqual('Updated Todo');
    expect(updateTodo.id).toEqual(insertedTodo.id);
    expect(cacheMock.clear).toHaveBeenCalled();
  });

  it('toggleTodo: should toggle the todo and clear the cache', async () => {
    const todoData: CreateTodoDto = {
      name: 'Test Todo',
      subject: 'Work',
      priority: 5,
      date: new Date(),
      geometryType: 'Polygon',
      lat: 0,
      lng: 0,
      coordinates: [
        [
          [34.75, 32.05],
          [34.85, 32.05],
          [34.85, 32.15],
          [34.75, 32.15],
          [34.75, 32.05],
        ],
      ],
    };

    const insertedTodo = await todosService.addTodo(todoData);

    const toggleTodo = await todosService.toggleTodo(insertedTodo.id);

    expect(toggleTodo.isCompleted).toEqual(true);
    expect(toggleTodo.id).toEqual(insertedTodo.id);
    expect(cacheMock.clear).toHaveBeenCalled();
  });
});

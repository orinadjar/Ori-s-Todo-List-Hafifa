import { Inject, Injectable, Logger } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq, getTableColumns, lt, not, sql } from 'drizzle-orm';

import {
  type CreateTodoDto,
  type FilterGeometryDto,
  type UpdateTodoDto,
  type Todo,
  geometryTypes,
} from '..//dto/todosDto.dto';

import * as schema from '../db/schema';
import { todos } from '../db/schema';

import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { RedisKeys } from '../utils/redisKeys.util';

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);

  constructor(
    @Inject(DATABASE_CONNECTION) private db: NodePgDatabase<typeof schema>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // GET GetAllTodos
  async findAllTodos(
    limit: number,
    offset: number,
    filterGeometry?: FilterGeometryDto,
  ): Promise<Todo[]> {
    if (!filterGeometry) {
      const cachedTodos = await this.cacheManager.get<Todo[]>(
        RedisKeys.getTodosKey(limit, offset),
      );
      if (cachedTodos) {
        this.logger.log('Returning todos from cache');
        return cachedTodos;
      }
    }

    let query = this.db
      .select(getTableColumns(todos))
      .from(todos)
      .$dynamic()
      .limit(limit)
      .offset(offset);

    if (filterGeometry) {
      query = query.where(
        sql`ST_Intersects(${todos.geom}, ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(filterGeometry)}), 4326))`,
      );
    }

    const rows = await query;

    if (!filterGeometry)
      await this.cacheManager.set(RedisKeys.getTodosKey(limit, offset), rows);

    return rows as Todo[];
  }

  // CREATE: AddTodo
  async addTodo(createTodoDto: CreateTodoDto) {
    const geom =
      createTodoDto.geom.type === geometryTypes.point
        ? {
            type: createTodoDto.geom.type,
            coordinates: createTodoDto.geom.coordinates,
          }
        : {
            type: createTodoDto.geom.type,
            coordinates: createTodoDto.geom.coordinates ?? [],
          };

    const newTodo = await this.db
      .insert(todos)
      .values({
        ...createTodoDto,
        geom,
        isCompleted: false,
      })
      .returning();

    await this.clearTodosCache();

    return newTodo[0];
  }

  // DELETE deleteTodo
  async deleteTodo(id: string) {
    const deletedTodo = await this.db
      .delete(todos)
      .where(eq(todos.id, id))
      .returning();

    await this.clearTodosCache();

    return deletedTodo[0];
  }

  // PATCH updateTodo
  async updateTodo(id: string, updateTodoDto: UpdateTodoDto) {
    const { geom, ...rest } = updateTodoDto;

    const updateData = geom
      ? {
          ...rest,
          geom:
            geom.type === geometryTypes.point
              ? { type: geom.type, coordinates: geom.coordinates }
              : {
                  type: geom.type,
                  coordinates: geom.coordinates!,
                },
        }
      : rest;

    const updatedTodo = await this.db
      .update(todos)
      .set(updateData)
      .where(eq(todos.id, id))
      .returning();

    await this.clearTodosCache();

    return updatedTodo[0];
  }

  // PATCH toggleTodo
  async toggleTodo(id: string) {
    const toggledTodo = await this.db
      .update(todos)
      .set({
        isCompleted: not(todos.isCompleted),
      })
      .where(eq(todos.id, id))
      .returning();

    console.log(toggledTodo);

    await this.clearTodosCache();

    return toggledTodo[0];
  }

  // CRONJOB cleanOldTasks
  async cleanOldTasks() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const deletedOldTodos = await this.db
      .delete(todos)
      .where(and(eq(todos.isCompleted, true), lt(todos.date, oneWeekAgo)))
      .returning();

    return deletedOldTodos;
  }

  // CLEARCACHE clearTodosCache
  async clearTodosCache() {
    try {
      await this.cacheManager.clear();
      this.logger.log('cleared all todos from cache');
    } catch (error) {
      this.logger.log('Failed to clear all todos from cache', error);
    }
  }
}

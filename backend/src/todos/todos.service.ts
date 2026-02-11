import { Inject, Injectable, Logger } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq, lt, sql } from 'drizzle-orm';

import {
  TodoGeometryTypeSchema,
  type CreateTodoDto,
  type UpdateTodoDto,
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
  async findAllTodos(limit: number, offset: number, filterGeometry?: string) {
    if (!filterGeometry) {
      const cachedTodos = await this.cacheManager.get(
        RedisKeys.getTodosKey(limit, offset),
      );
      if (cachedTodos) {
        this.logger.log('Returning todos from cache');
        return cachedTodos;
      }
    }

    let query = this.db
      .select({
        id: todos.id,
        name: todos.name,
        subject: todos.subject,
        priority: todos.priority,
        date: todos.date,
        isCompleted: todos.isCompleted,
        geometryType: todos.geometryType,
        lat: todos.lat,
        lng: todos.lng,
        coordinates: sql`ST_AsGeoJSON(${todos.geom})::json->'coordinates'`,
      })
      .from(todos)
      .$dynamic()
      .limit(limit)
      .offset(offset);

    if (filterGeometry) {
      console.log(filterGeometry);
      query = query.where(
        sql`ST_Intersects(${todos.geom}, ST_SetSRID(ST_GeomFromGeoJSON(${filterGeometry}), 4326))`,
      );
    }

    const todosAwait = await query;

    if (!filterGeometry)
      await this.cacheManager.set(
        RedisKeys.getTodosKey(limit, offset),
        todosAwait,
      );

    // console.log("--" + query.toSQL().sql);

    return todosAwait;
  }

  // CREATE: AddTodo
  async addTodo(createTodoDto: CreateTodoDto) {
    const { geometryType, coordinates, ...rest } = createTodoDto;

    const geomValue =
      geometryType === TodoGeometryTypeSchema.enum.Polygon && coordinates
        ? sql`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify({
            type: 'Polygon',
            coordinates: coordinates,
          })}), 4326)`
        : sql`ST_SetSRID(ST_MakePoint(${rest.lng}, ${rest.lat}), 4326)`;

    const newTodo = await this.db
      .insert(todos)
      .values({
        ...rest,
        geometryType: geometryType,
        geom: geomValue,
        isCompleted: false,
      })
      .returning();

    console.log(newTodo);

    await this.clearTodosCache();

    return newTodo[0];
  }

  // DELETE deleteTodo
  async deleteTodo(id: string) {
    const deletedTodo = await this.db
      .delete(todos)
      .where(eq(todos.id, id))
      .returning();

    console.log(deletedTodo);

    await this.clearTodosCache();

    return deletedTodo[0];
  }

  // PATCH updateTodo
  async updateTodo(id: string, updateTodoDto: UpdateTodoDto) {
    const geometryType = updateTodoDto.geometryType;

    const updatedTodo = await this.db
      .update(todos)
      .set({
        ...updateTodoDto,
        ...(geometryType !== 'Polygon'
          ? {
              geom: sql`ST_SetSRID(ST_MakePoint(${updateTodoDto.lng}, ${updateTodoDto.lat}), 4326)`,
            }
          : {
              geom: sql`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify({
                type: 'Polygon',
                coordinates: updateTodoDto.coordinates,
              })}), 4326)`,
            }),
      })
      .where(eq(todos.id, id))
      .returning();

    console.log(updatedTodo);

    await this.clearTodosCache();

    return updatedTodo[0];
  }

  // PATCH toggleTodo
  async toggleTodo(id: string) {
    const toggledTodo = await this.db
      .update(todos)
      .set({
        isCompleted: sql`NOT ${todos.isCompleted}`,
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

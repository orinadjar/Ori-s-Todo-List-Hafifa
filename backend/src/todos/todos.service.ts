import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm';

import { CreateTodoDto, TodoGeometryType, UpdateTodoDto } from './dto/todos.dto';

import * as schema from '../db/schema';
import { todos } from '../db/schema';

@Injectable()
export class TodosService {
    constructor(
        @Inject(DATABASE_CONNECTION) private db: NodePgDatabase<typeof schema>,
    ) { }

    // GET GetAllTodos
    async findAllTodos(filterGeometry?: string) {
        let query = this.db.select({
            id: todos.id,
            name: todos.name,
            subject: todos.subject,
            priority: todos.priority,
            date: todos.date,
            isCompleted: todos.isCompleted,
            geometryType: todos.geometryType,
            lat: todos.lat,
            lng: todos.lng,
            coordinates: sql`ST_AsGeoJSON(${todos.geom})::json->'coordinates'`
        }).from(todos).$dynamic();

        if(filterGeometry){
            query = query.where(sql`ST_Intersects(${todos.geom}, ST_SetSRID(ST_GeomFromGeoJSON(${filterGeometry}), 4326))`)
        }

        return await query;
    }

    //GET GetOneTodo
    async findOneTodo(id: string) {
        return await this.db.select().from(todos).where(eq(todos.id, id));
    }

    // CREATE: AddTodo
    async addTodo(createTodoDto: CreateTodoDto) {
        const { geometryType, coordinates, ...rest } = createTodoDto;

        const geomValue = geometryType === TodoGeometryType.Polygon && coordinates
                          ? sql`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify({
                            type: 'Polygon',
                            coordinates: coordinates,
                          })}), 4326)`
                          : sql`ST_SetSRID(ST_MakePoint(${rest.lng}, ${rest.lat}), 4326)`

        const newTodo = await this.db.insert(todos).values({
            ...rest,
            geometryType: geometryType,
            geom: geomValue,
            isCompleted: false,
        }).returning();

        console.log(newTodo);

        return newTodo[0];
    }

    async deleteTodo(id: string) {
        const deletedTodo = await this.db.delete(todos).where(eq(todos.id, id)).returning();

        console.log(deletedTodo);

        return deletedTodo[0];
    }

    async updateTodo(id: string, updateTodoDto: UpdateTodoDto) {
        const geometryType = updateTodoDto.geometryType;

        const updatedTodo = await this.db.update(todos).set({
            ...updateTodoDto,
            ...(geometryType !== 'Polygon'
                ? { geom: sql`ST_SetSRID(ST_MakePoint(${updateTodoDto.lng}, ${updateTodoDto.lat}), 4326)` }
                : { geom: sql`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify({
                    type: 'Polygon',
                    coordinates: updateTodoDto.coordinates
                  })}), 4326)` 
                  }
                ),
        }).where(eq(todos.id, id)).returning();

        console.log(updatedTodo);

        return updatedTodo[0];
    }

    async toggleTodo(id: string) {
        const toggledTodo = await this.db.update(todos).set({
            isCompleted: sql`NOT ${todos.isCompleted}`,
        }).where(eq(todos.id, id)).returning();

        console.log(toggledTodo);

        return toggledTodo[0];
    }


}

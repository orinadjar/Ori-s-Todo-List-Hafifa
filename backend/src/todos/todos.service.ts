import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm';

import { CreateTodoDto, UpdateTodoDto } from './dto/todos.dto';

import * as schema from '../db/schema';
import { todos } from '../db/schema';

@Injectable()
export class TodosService {
    constructor(
        @Inject(DATABASE_CONNECTION) private db: NodePgDatabase<typeof schema>,
    ) { }

    // GET GetAllTodos
    async findAllTodos() {
        return await this.db.select().from(todos);
    }

    //GET GetOneTodo
    async findOneTodo(id: string) {
        return await this.db.select().from(todos).where(eq(todos.id, id));
    }

    // CREATE: AddTodo
    async addTodo(createTodoDto: CreateTodoDto) {
        const newTodo = await this.db.insert(todos).values({
            ...createTodoDto,
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
        const updatedTodo = await this.db.update(todos).set(updateTodoDto)
        .where(eq(todos.id, id)).returning();

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

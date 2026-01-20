import { pgTable, pgEnum } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core'

export const todoSubjectEnum = pgEnum('todo_subject', ['Work', 'Personal', 'Military', 'Urgent', 'General']);

export const todos = pgTable(
    'todos',
    {
        id: t.uuid('id').primaryKey().defaultRandom(),
        name: t.text('name').notNull(),
        subject: todoSubjectEnum('subject').notNull(),
        priority: t.integer('priority').notNull(),
        date: t.timestamp('date').notNull(),
        isCompleted: t.boolean('is_completed').default(false).notNull(),
        lat: t.doublePrecision('lat').notNull(),
        lng: t.doublePrecision('lng').notNull(),
    }
);


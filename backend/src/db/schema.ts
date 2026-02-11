import { pgTable, pgEnum, customType } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm';

export const todoSubjectEnum = pgEnum('todo_subject', ['Work', 'Personal', 'Military', 'Urgent', 'General']);
export const todoGeometryTypeEnum = pgEnum('todo_geometry_type', ['Point', 'Polygon']);

const geometry = customType<{ data: unknown }>({
    dataType() {
      return 'geometry(Geometry, 4326)';
    },
  });

export const todos = pgTable(
    'todos',
    {
        id: t.uuid('id').primaryKey().defaultRandom(),
        name: t.text('name').notNull(),
        subject: todoSubjectEnum('subject').notNull(),
        priority: t.integer('priority').notNull(),
        date: t.timestamp('date').notNull(),
        isCompleted: t.boolean('is_completed').default(false).notNull(),
        geometryType: todoGeometryTypeEnum('geometry_type').default('Point').notNull(),
        lat: t.doublePrecision('lat').notNull(),
        lng: t.doublePrecision('lng').notNull(),
        geom: geometry('geom'),
    }
);


import { pgTable, pgEnum, customType } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import wkx from 'wkx';

import { geometryTypes } from '../../src/dto/todosDto.dto';

export const todoSubjectEnum = pgEnum('todo_subject', [
  'Work',
  'Personal',
  'Military',
  'Urgent',
  'General',
]);

export const todoGeometryTypeEnum = pgEnum('todo_geometry_type', [
  geometryTypes.point,
  geometryTypes.Polygon,
]);

export type GeometryInput =
  | { type: 'Point'; coordinates: number[] }
  | { type: 'Polygon'; coordinates: number[][][] };

interface WkxResult {
  type: string;
  coordinates: number[] | number[][][];
}

const geometry = customType<{ data: GeometryInput }>({
  dataType() {
    return 'geometry(Geometry, 4326)';
  },
  toDriver(value: GeometryInput): string {
    if (value.type === 'Point') {
      return `SRID=4326; POINT(${value.coordinates[0]} ${value.coordinates[1]})`;
    }
    const rings = value.coordinates
      .map((ring) => '(' + ring.map(([x, y]) => `${x} ${y}`).join(', ') + ')')
      .join(', ');
    return `SRID=4326; POLYGON(${rings})`;
  },
  fromDriver(value: string) {
    const buffer = Buffer.from(value, 'hex');
    const geoJsonGeom = wkx.Geometry.parse(buffer).toGeoJSON() as WkxResult;

    return {
      type: geoJsonGeom.type,
      coordinates: geoJsonGeom.coordinates,
    } as GeometryInput;
  },
});

export const todos = pgTable('todos', {
  id: t.uuid('id').primaryKey().defaultRandom(),
  name: t.text('name').notNull(),
  subject: todoSubjectEnum('subject').notNull(),
  priority: t.integer('priority').notNull(),
  date: t.timestamp('date').notNull(),
  isCompleted: t.boolean('is_completed').default(false).notNull(),
  geom: geometry('geom'),
});

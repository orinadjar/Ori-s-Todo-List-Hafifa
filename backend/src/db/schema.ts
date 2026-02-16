import { pgTable, pgEnum, customType } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import wkx from 'wkx';

export const todoSubjectEnum = pgEnum('todo_subject', [
  'Work',
  'Personal',
  'Military',
  'Urgent',
  'General',
]);

export const todoGeometryTypeEnum = pgEnum('todo_geometry_type', [
  'Point',
  'Polygon',
]);

export type GeometryInput =
  | { type: 'Point'; lat: number; lng: number }
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
      return `SRID=4326; POINT(${value.lng} ${value.lat})`;
    }
    const rings = value.coordinates
      .map((ring) => '(' + ring.map(([x, y]) => `${x} ${y}`).join(', ') + ')')
      .join(', ');
    return `SRID=4326; POLYGON(${rings})`;
  },
  fromDriver(value: string) {
    const buffer = Buffer.from(value, 'hex');
    const geoJsonGeom = wkx.Geometry.parse(buffer).toGeoJSON() as WkxResult;

    if (geoJsonGeom.type === 'Point') {
      return {
        type: 'Point',
        lng: geoJsonGeom.coordinates[0],
        lat: geoJsonGeom.coordinates[1],
      } as GeometryInput;
    }

    if (geoJsonGeom.type === 'Polygon') {
      return {
        type: 'Polygon',
        coordinates: geoJsonGeom.coordinates,
      } as GeometryInput;
    }

    throw new Error(`Unsupported geometry type: ${geoJsonGeom.type}`);
  },
});

export const todos = pgTable('todos', {
  id: t.uuid('id').primaryKey().defaultRandom(),
  name: t.text('name').notNull(),
  subject: todoSubjectEnum('subject').notNull(),
  priority: t.integer('priority').notNull(),
  date: t.timestamp('date').notNull(),
  isCompleted: t.boolean('is_completed').default(false).notNull(),
  geometryType: todoGeometryTypeEnum('geometry_type')
    .default('Point')
    .notNull(),
  lat: t.doublePrecision('lat').notNull(),
  lng: t.doublePrecision('lng').notNull(),
  geom: geometry('geom'),
});

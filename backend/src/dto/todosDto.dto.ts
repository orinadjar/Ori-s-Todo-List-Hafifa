import { z } from 'zod';

export const TodoSubjectSchema = z.enum([
  'Work',
  'Personal',
  'Military',
  'Urgent',
  'General',
]);

export const geometryTypes = {
  point: 'Point',
  Polygon: 'Polygon',
} as const;

export const TodoCoordinatesTyps = {
  PolygonCoords: z.array(z.array(z.array(z.number()))),
  PointCoords: z.tuple([z.number(), z.number()]),
} as const;

export const TodoGeometrySchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(geometryTypes.point),
    coordinates: TodoCoordinatesTyps.PointCoords,
  }),

  z.object({
    type: z.literal(geometryTypes.Polygon),
    coordinates: TodoCoordinatesTyps.PolygonCoords,
  }),
]);

export const FilterGeometrySchema = z.preprocess(
  (val) => (typeof val === 'string' ? (JSON.parse(val) as object) : val),
  TodoGeometrySchema,
);

const TodoFieldsSchema = z
  .object({
    name: z.string().min(1, 'Name cannot be empty'),
    subject: TodoSubjectSchema,
    priority: z.number().int().min(1).max(10),
    date: z.coerce.date(),
    geom: TodoGeometrySchema,
  })
  .strict();

export const CreateTodoSchema = TodoFieldsSchema;

export const TodoSchema = CreateTodoSchema.and(
  z.object({
    id: z.uuid(),
    isCompleted: z.boolean().default(false),
  }),
);

export const updateTodoSchema = TodoFieldsSchema.partial();

export const PaginationQuerySchema = z.coerce.number().int().nonnegative();

export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoDto = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoDto = z.infer<typeof updateTodoSchema>;
export type TodoSubject = z.infer<typeof TodoSubjectSchema>;
export type FilterGeometryDto = z.infer<typeof FilterGeometrySchema>;
export type TodoGeometryDto = z.infer<typeof TodoGeometrySchema>;
export type GeometryInput = z.infer<typeof TodoGeometrySchema>;

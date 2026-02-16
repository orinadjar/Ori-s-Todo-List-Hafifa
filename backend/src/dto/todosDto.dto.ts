import { z } from 'zod';

export const TodoSubjectSchema = z.enum([
  'Work',
  'Personal',
  'Military',
  'Urgent',
  'General',
]);

export const TodoGeometryTypeSchema = z.enum(['Point', 'Polygon']);

export const coordinatesSchema = z.array(z.array(z.array(z.number())));

export const FilterGeometrySchema = z.preprocess(
  (val) => (typeof val === 'string' ? (JSON.parse(val) as object) : val),
  z.object({
    type: z.enum(['Point', 'Polygon']),
    coordinates: coordinatesSchema,
  }),
);

const TodoGeometrySchema = z.discriminatedUnion('geometryType', [
  z.object({
    geometryType: z.literal('Point'),
    lat: z.number(),
    lng: z.number(),
  }),

  z.object({
    geometryType: z.literal('Polygon'),
    coordinates: coordinatesSchema.nullable().optional(),
  }),
]);

const TodoFieldsSchema = z
  .object({
    name: z.string().min(1, 'Name cannot be empty'),
    subject: TodoSubjectSchema,
    priority: z.number().int().min(1).max(10),
    date: z.coerce.date(),
  })
  .strict();

export const CreateTodoSchema = TodoFieldsSchema.and(TodoGeometrySchema);

export const TodoSchema = CreateTodoSchema.and(
  z.object({
    id: z.uuid(),
    isCompleted: z.boolean().default(false),
  }),
);

export const updateTodoSchema = TodoFieldsSchema.partial().and(
  TodoGeometrySchema.optional(),
);

export const PaginationQuerySchema = z.coerce.number().int().nonnegative();

export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoDto = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoDto = z.infer<typeof updateTodoSchema>;
export type TodoSubject = z.infer<typeof TodoSubjectSchema>;
export type TodoGeometryType = z.infer<typeof TodoGeometryTypeSchema>;
export type FilterGeometryDto = z.infer<typeof FilterGeometrySchema>;
export type coordinatesSchemaDto = z.infer<typeof coordinatesSchema>;

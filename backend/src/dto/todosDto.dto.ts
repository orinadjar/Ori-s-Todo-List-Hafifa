import { z } from 'zod';

export const TodoSubjectSchema = z.enum([
  'Work',
  'Personal',
  'Military',
  'Urgent',
  'General'
]);

export const TodoGeometryTypeSchema = z.enum(['Point', 'Polygon']);

export const TodoSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name cannot be empty'),
  subject: TodoSubjectSchema,
  priority: z.number().int().min(1).max(10),
  date: z.coerce.date(),
  isCompleted: z.boolean().default(false),
  geometryType: TodoGeometryTypeSchema,
  lat: z.number(),
  lng: z.number(),
  coordinates: z.array(z.array(z.array(z.number()))).nullable().optional(),
});

export const CreateTodoSchema = TodoSchema.omit({
  id: true,
  isCompleted: true
}).strict();

export const updateTodoSchema = CreateTodoSchema.partial();

export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoDto = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoDto = z.infer<typeof updateTodoSchema>;
export type TodoSubject = z.infer<typeof TodoSubjectSchema>;
export type TodoGeometryType = z.infer<typeof TodoGeometryTypeSchema>;
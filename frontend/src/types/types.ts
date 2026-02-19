import { z } from "zod";

export const TodoSubjectSchema = z.enum([
  "Work",
  "Personal",
  "Military",
  "Urgent",
  "General",
]);

export const polygonCoordinates = z.array(z.array(z.array(z.number())));
export const pointCoordinates = z.tuple([z.number(), z.number()]);

export const pointType = z.literal("Point");
export const polygonType = z.literal("Polygon");

export const todoGeomTypes = z.union([pointType, polygonType]);

export const TodoGeometrySchema = z.discriminatedUnion("type", [
  z.object({
    type: pointType,
    coordinates: pointCoordinates,
  }),

  z.object({
    type: polygonType,
    coordinates: polygonCoordinates,
  }),
]);

export const baseSchema = z.object({
  name: z.string().nonempty(),
  subject: TodoSubjectSchema,
  priority: z.number().min(1).max(10),
  date: z.date(),
});

export const partialTodoSchema = z
  .object({
    geom: TodoGeometrySchema,
  })
  .and(baseSchema);

export const todoSchema = z
  .object({
    id: z.string(),
    isCompleted: z.boolean(),
  })
  .and(baseSchema)
  .and(partialTodoSchema);

export const formFieldsSchema = z
  .object({
    geometryType: todoGeomTypes,
    pointCoordinates: pointCoordinates.nullable(),
    polygonCoordinates: polygonCoordinates.nullable(),
  })
  .and(baseSchema).refine(
    (data) =>
      (data.geometryType === "Point" && data.pointCoordinates !== null) ||
      (data.geometryType === "Polygon" && data.polygonCoordinates !== null),
    { message: "Please select a location or draw a polygon" }
  );

export type Geometry = z.infer<typeof TodoGeometrySchema>;
export type TodoSubject = z.infer<typeof TodoSubjectSchema>;
export type partialTodo = z.infer<typeof partialTodoSchema>;
export type Todo = z.infer<typeof todoSchema>;
export type FormFields = z.infer<typeof formFieldsSchema>;
export type PolygonType = z.infer<typeof polygonType>;
export type geomTypes = z.infer<typeof todoGeomTypes>
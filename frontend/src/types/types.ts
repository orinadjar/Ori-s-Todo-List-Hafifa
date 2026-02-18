export type TodoSubject = 'Work' | 'Personal' | 'Military' | 'Urgent' | 'General' ;
export type TodoGeometryType = 'Point' | 'Polygon';

export type PolygonCoordinates = number[][][];
export type PointCoordinates = number[];

export type Geometry =
  | { type: 'Point'; coordinates: PointCoordinates }
  | { type: 'Polygon'; coordinates: PolygonCoordinates };

export interface Todo {
  id: string;
  name: string;
  subject: TodoSubject;
  priority: number;
  date: Date;
  isCompleted: boolean;
  geom: Geometry;
}
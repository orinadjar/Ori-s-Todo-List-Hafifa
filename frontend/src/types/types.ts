export type TodoSubject = 'Work' | 'Personal' | 'Military' | 'Urgent' | 'General' ;
export type TodoGeometryType = 'Point' | 'Polygon';

export type PolygonCoordinates =  number[][][] | null;

export interface Todo {
  id: string;          
  name: string;        
  subject: TodoSubject; 
  priority: number;    
  date: Date;       
  isCompleted: boolean; 
  geometryType: TodoGeometryType;
  lat: number,
  lng: number,
  coordinates: PolygonCoordinates,
}
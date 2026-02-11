import { IsString, IsNotEmpty, IsNumber, Min, Max, IsDate, IsEnum, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

import { PartialType } from '@nestjs/mapped-types';

export enum TodoSubject {
  Work = 'Work',
  Personal = 'Personal',
  Military = 'Military',
  Urgent = 'Urgent',
  General = 'General',
}

export enum TodoGeometryType {
  Point = 'Point',
  Polygon = 'Polygon',
}

export type PolygonCoordinates =  number[][][];

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  subject: TodoSubject;

  @IsNumber()
  @Min(1)
  @Max(10)
  priority: number;

  @IsDate() 
  @Type(() => Date) 
  date: Date;

  @IsEnum(TodoGeometryType)
  geometryType: TodoGeometryType;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsOptional()
  @IsArray()
  coordinates?: PolygonCoordinates;
}

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
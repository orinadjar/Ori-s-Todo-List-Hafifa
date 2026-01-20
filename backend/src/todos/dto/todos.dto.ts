import { IsString, IsNotEmpty, IsNumber, Min, Max, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

import { PartialType } from '@nestjs/mapped-types';

export enum TodoSubject {
  Work = 'Work',
  Personal = 'Personal',
  Military = 'Military',
  Urgent = 'Urgent',
  General = 'General',
}

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

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
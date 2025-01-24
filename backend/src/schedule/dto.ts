import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  teacherName: string;

  @IsString()
  @IsNotEmpty()
  subjectName: string;

  @IsString()
  @IsNotEmpty()
  className: string;

  @IsString()
  @Matches(/^(\d+)(h)$/)  
  duration: string;
}

import { IsString, IsNotEmpty, IsArray, IsInt } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Teacher's name

  @IsArray()
  @IsInt({ each: true }) // Ensure each item in the array is an integer
  subjectIds: number[]; // Array of subject IDs
}
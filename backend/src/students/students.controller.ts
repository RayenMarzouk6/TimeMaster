import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { StudentService } from './students.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.studentService.findOne(id);
  }

  @Post()
  create(@Body('name') name: string, @Body('classId') classId: number) {
    return this.studentService.create(name, classId);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.studentService.delete(id);
  }
}

import { Teacher } from 'src/teachers/teachers.entity';
import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { TeacherService } from './teachers.service';

// import { Teacher } from './teacher.entity'; // Import the Teacher entity
import { CreateTeacherDto } from './create-teacher.dto';

@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  findAll() {
    return this.teacherService.findAll();
  }
  @Post()
  async create(@Body() createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    return this.teacherService.create(createTeacherDto);
  }


  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.teacherService.findOne(id);
  }


  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.teacherService.delete(id);
  }
}

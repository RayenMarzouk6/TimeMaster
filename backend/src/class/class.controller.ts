import { Controller, Get, Post, Body, Param, Delete, NotFoundException } from '@nestjs/common';
import { ClassService } from './class.service';
import { Class } from './class.entity';

@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get(':id/timetable') // Endpoint: GET /classes/:id/timetable
  async getTimetableForClass(@Param('id') id: number) {
    const timetable = await this.classService.getTimetableByClassId(id);
    if (!timetable || timetable.length === 0) {
      throw new NotFoundException('No timetable found for this class.');
    }
    return timetable;
  }

  @Post()
  create(@Body() classData: Class) {
    return this.classService.create(classData);
  }

  @Get()
  findAll() {
    return this.classService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.classService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.classService.remove(id);
  }
  @Get(':id/students')
  async getStudentNames(@Param('id') id: number) {
    return this.classService.getStudentNamesByClass(id);
  }
}

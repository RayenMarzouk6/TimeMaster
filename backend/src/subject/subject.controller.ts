import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { Subject } from './subject.entity';

@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  // Route pour créer un nouveau sujet
  @Post()
  create(@Body('name') name: string) {
    return this.subjectService.create(name);
  }

  // Route pour récupérer tous les sujets
  @Get()
  findAll() {
    return this.subjectService.findAll();
  }

  // Route pour récupérer un seul sujet par ID
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.subjectService.findOne(id);
  }

  // Route pour supprimer un sujet par ID
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.subjectService.remove(id);
  }
}

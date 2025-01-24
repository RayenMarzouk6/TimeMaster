import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { Classroom } from './classroom.entity';
import { SubjectService } from '../subject/subject.service'; // Import SubjectService$ SubjectService

@Controller('classrooms')
export class ClassroomController {
  constructor(
    private readonly classroomService: ClassroomService,
    private readonly subjectService: SubjectService, // Inject SubjectService
   ) {}

  // Créer un nouveau classroom 
  @Post()
  async create(@Body() classroomData: Classroom): Promise<Classroom> {
    return this.classroomService.create(classroomData);
  }

  // Récupérer tous les classrooms
  @Get()
  async findAll(): Promise<Classroom[]> {
    return this.classroomService.findAll();
  }

  // Récupérer un classroom par ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Classroom> {
    return this.classroomService.findOne(id);
  }

  // Mettre à jour un classroom
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() classroomData: Classroom,
  ): Promise<Classroom> {
    return this.classroomService.update(id, classroomData);
  }

  // Supprimer un classroom
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.classroomService.remove(id);
  }

  //-----------------

  // Associate a subject with a classroom
  @Post(':classroomId/subjects/:subjectId')
  async addSubjectToClassroom(
    @Param('classroomId') classroomId: number,
    @Param('subjectId') subjectId: number,
  ) {
    // Find the classroom
    const classroom = await this.classroomService.findOne(classroomId);
    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    // Find the subject
    const subject = await this.subjectService.findOne(subjectId);
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    // Add the subject to the classroom's subjects array
    classroom.subjects = [...(classroom.subjects || []), subject];

    // Save the updated classroom
    await this.classroomService.save(classroom);

    return { message: 'Subject added to classroom successfully' };
  }
}

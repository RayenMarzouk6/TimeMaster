import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teachers.entity';
import { Subject } from '../subject/subject.entity'; // Import the Subject entity
import { CreateTeacherDto } from './create-teacher.dto';
// import { CreateTeacherDto } from './dto/create-teacher.dto'; // Import the DTO

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,

    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>, // Inject the Subject repository
  ) {}


  async findAll(): Promise<Teacher[]> {
    return this.teacherRepository.find({ relations: ['subjects'] }); 
  }


  async findOne(id: number): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
      relations: ['subjects'],
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return teacher;
  }

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const { name, subjectIds } = createTeacherDto;

    // Create the teacher
    const teacher = this.teacherRepository.create({ name });

    // Find the selected subjects
    const subjects = await this.subjectRepository.findByIds(subjectIds);
    if (subjects.length !== subjectIds.length) {
      throw new NotFoundException('One or more subjects not found');
    }

    // Associate the subjects with the teacher
    teacher.subjects = subjects;

    // Save the teacher and the relationships
    return this.teacherRepository.save(teacher);
  }

  async delete(id: number): Promise<void> {
    const result = await this.teacherRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
  }
}

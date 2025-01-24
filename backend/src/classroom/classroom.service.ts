import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classroom } from './classroom.entity';
import { Subject } from '../subject/subject.entity';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async create(classroomData: Partial<Classroom>): Promise<Classroom> {
    const classroom = this.classroomRepository.create(classroomData);
    return this.classroomRepository.save(classroom);
  }

  async findAll(): Promise<Classroom[]> {
    return this.classroomRepository.find({ relations: ['subjects'] });
  }

  async findOne(id: number): Promise<Classroom> {
    const classroom = await this.classroomRepository.findOne({
      where: { id },
      relations: ['subjects'],
    });
    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }
    return classroom;
  }

  async update(id: number, classroomData: Partial<Classroom>): Promise<Classroom> {
    await this.classroomRepository.update(id, classroomData);
    return this.classroomRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.classroomRepository.delete(id);
  }

  async save(classroom: Classroom): Promise<Classroom> {
    return this.classroomRepository.save(classroom);
  }

  async addSubjectToClassroom(classroomId: number, subjectId: number): Promise<void> {
    console.log(`Adding subject ${subjectId} to classroom ${classroomId}`);
  
    // Step 1: Find the classroom
    const classroom = await this.classroomRepository.findOne({
      where: { id: classroomId },
      relations: ['subjects'], // Ensure subjects are loaded
    });
    if (!classroom) {
      console.error('Classroom not found');
      throw new NotFoundException('Classroom not found');
    }
  
    // Step 2: Find the subject
    const subject = await this.subjectRepository.findOne({ where: { id: subjectId } });
    if (!subject) {
      console.error('Subject not found');
      throw new NotFoundException('Subject not found');
    }
  
    console.log('Classroom:', classroom);
    console.log('Subject:', subject);
  
    // Step 3: Add the subject to the classroom's subjects array
    if (!classroom.subjects) {
      classroom.subjects = []; // Initialize the subjects array if it doesn't exist
    }
    classroom.subjects.push(subject); // Add the subject to the array
  
    // Step 4: Save the updated classroom
    await this.classroomRepository.save(classroom);
    console.log('Subject added to classroom successfully');
  }
}
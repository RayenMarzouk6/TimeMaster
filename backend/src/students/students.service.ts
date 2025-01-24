import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './students.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find({ relations: ['class'] });
  }

  async findOne(id: number): Promise<Student> {
    return this.studentRepository.findOne({
      where: { id },
      relations: ['class'],
    });
  }

  async create(name: string, classId: number): Promise<Student> {
    const student = this.studentRepository.create({ name, class: { id: classId } });
    return this.studentRepository.save(student);
  }

  async delete(id: number): Promise<void> {
    await this.studentRepository.delete(id);
  }
}

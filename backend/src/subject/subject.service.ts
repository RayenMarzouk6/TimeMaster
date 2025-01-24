import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { Subject } from './subject.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  // async create(name: string): Promise<Subject> {
  //   const existingSubject = await this.subjectRepository.findOne({
  //     where: {
  //       name: Raw((alias) => `LOWER(${alias}) = :name`, { name: name.toLowerCase() }),
  //     },
  //   });

  async create(name: string): Promise<Subject> {
    // Validate name input
    if (!name || name.trim().length === 0) {
      throw new Error('Le nom du sujet est requis');
    }
     // Check if the subject already exists (case-insensitive)
     const existingSubject = await this.subjectRepository.findOne({
      where: {
        name: Raw((alias) => `LOWER(${alias}) = :name`, { name: name.toLowerCase() }),
      },
    });

    if (existingSubject) {
      throw new Error('Le sujet existe déjà');
    }

    // if (existingSubject) {
    //   throw new Error('Le sujet existe déjà');
    // }

    const subject = this.subjectRepository.create({ name });
    return this.subjectRepository.save(subject);
  }

  async findAll(): Promise<Subject[]> {
    return this.subjectRepository.find();
  }

  async findOne(id: number): Promise<Subject> {
    const subject = await this.subjectRepository.findOne({ where: { id } });
    if (!subject) {
      throw new Error('Sujet non trouvé');
    }
    return subject;
  }

  async remove(id: number): Promise<void> {
    const subject = await this.subjectRepository.findOne({ where: { id } });
    if (!subject) {
      throw new Error('Sujet non trouvé');
    }
    await this.subjectRepository.remove(subject);
  }
}

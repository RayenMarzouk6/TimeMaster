import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './class.entity';
import { Schedule } from 'src/schedule/schedule.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,  
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async getTimetableByClassId(classId: number): Promise<any[]> {
    return this.scheduleRepository.find({
      where: { class: { id: classId } },
      relations: ['teacher', 'subject', 'classroom', 'class'],
    });
  }

  async getStudentNamesByClass(id: number): Promise<string[]> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['students'], 
    });

    if (!classEntity) {
      throw new Error('Classe non trouvée');
    }


    return classEntity.students.map((student) => student.name);
  }


  create(classData: Class): Promise<Class> {
    return this.classRepository.save(classData);
  }


  findAll(): Promise<Class[]> {
    return this.classRepository.find();
  }

  findOne(id: number): Promise<Class> {
    return this.classRepository.findOne({
      where: { id },
      relations: ['students'],  
    });
  }


  update(id: number, classData: Partial<Class>): Promise<Class> {
    return this.classRepository.save({ ...classData, id });
  }


  remove(id: number): Promise<void> {
    return this.classRepository.delete(id).then(() => {});
  }
}

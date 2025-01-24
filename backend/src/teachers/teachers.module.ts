import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './teachers.entity';
import { TeacherService } from './teachers.service';
import { TeacherController } from './teachers.controller';
import { Subject } from '../subject/subject.entity'; // Correct import for Subject entity
import { SubjectModule } from '../subject/subject.module'; // Correct import for SubjectModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Teacher, Subject]), // Include Teacher and Subject entities
    SubjectModule, // Import SubjectModule if it provides additional providers
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
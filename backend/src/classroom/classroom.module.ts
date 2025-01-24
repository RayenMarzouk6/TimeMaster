import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classroom } from './classroom.entity';
import { Subject } from '../subject/subject.entity'; // Import the Subject entity
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { SubjectModule } from '../subject/subject.module'; // Import the SubjectModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Classroom, Subject]), // Include Classroom and Subject entities
    SubjectModule, // Import the SubjectModule
  ],
  controllers: [ClassroomController],
  providers: [ClassroomService],
})
export class ClassroomModule {}
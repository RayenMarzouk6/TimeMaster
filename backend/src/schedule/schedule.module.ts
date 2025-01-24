import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { Classroom } from 'src/classroom/classroom.entity';
import { Subject } from 'src/subject/subject.entity';
import { Class } from 'src/class/class.entity';
import { Teacher } from 'src/teachers/teachers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, Teacher, Classroom, Subject, Class]),
  ],
  providers: [ScheduleService], 
  controllers: [ScheduleController], 
})
export class ScheduleModule {}

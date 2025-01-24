import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { Class } from './class.entity';
import { Student } from 'src/students/students.entity'; 
import { Schedule } from 'src/schedule/schedule.entity';
import { Subject } from 'rxjs';
import { Classroom } from 'src/classroom/classroom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class, Student , Schedule, Subject , Classroom])],  
  providers: [ClassService],
  controllers: [ClassController],
  
})
export class ClassModule {}

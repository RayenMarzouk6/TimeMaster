import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/user.entity';
import { Class } from './class/class.entity';
import { Subject } from './subject/subject.entity';
import { Schedule } from './schedule/schedule.entity';
import { Classroom } from './classroom/classroom.entity';
import { UserModule } from './user/user.module';
import { ClassModule } from './class/class.module';
import { SubjectModule } from './subject/subject.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ClassroomModule } from './classroom/classroom.module';
import { TeacherModule } from './teachers/teachers.module';
import { StudentModule } from './students/students.module';
import { Student } from './students/students.entity';
import { Teacher } from './teachers/teachers.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'schedule',
      entities: [User, Class, Subject, Schedule, Classroom,Student,Teacher],
      synchronize: true,
      logging: true, // Enable SQL query logging
    }),
    UserModule,
    ClassModule,
    SubjectModule,
    ScheduleModule,
    ClassroomModule,
    StudentModule,
    TeacherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

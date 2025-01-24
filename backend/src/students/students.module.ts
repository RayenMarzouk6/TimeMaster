import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './students.entity';
import { StudentService } from './students.service';
import { StudentController } from './students.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}

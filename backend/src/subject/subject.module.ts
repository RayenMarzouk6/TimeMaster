import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Subject])],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService], // Export SubjectService
})
export class SubjectModule {}
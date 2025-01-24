import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Class } from 'src/class/class.entity';
import { Classroom } from 'src/classroom/classroom.entity';
import { Subject } from 'src/subject/subject.entity';
import { Teacher } from 'src/teachers/teachers.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  day: string;

  @Column()
  duree: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  // Many-to-One relationship with Teacher
  @ManyToOne(() => Teacher, (teacher) => teacher.schedules, { nullable: false })
  @JoinColumn({ name: 'teacherId' }) // Foreign key column in the schedules table
  teacher: Teacher;

  // Many-to-One relationship with Subject
  @ManyToOne(() => Subject, (subject) => subject.schedules)
  @JoinColumn({ name: 'subjectId' }) // Foreign key column in the schedules table
  subject: Subject;

  // Many-to-One relationship with Classroom
  @ManyToOne(() => Classroom, (classroom) => classroom.schedules)
  @JoinColumn({ name: 'classroomId' }) // Foreign key column in the schedules table
  classroom: Classroom;

  // Many-to-One relationship with Class
  @ManyToOne(() => Class, (classEntity) => classEntity.schedules)
  @JoinColumn({ name: 'classId' }) // Foreign key column in the schedules table
  class: Class;
}
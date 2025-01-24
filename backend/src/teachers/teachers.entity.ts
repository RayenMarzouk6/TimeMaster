import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
// import { Class } from '../class/class.entity';
import { Schedule } from 'src/schedule/schedule.entity';
import { Subject } from 'src/subject/subject.entity';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  // One-to-Many relationship with Schedule
  @OneToMany(() => Schedule, (schedule) => schedule.teacher)
  schedules: Schedule[];

  // Many-to-Many relationship with Subject
  @ManyToMany(() => Subject, (subject) => subject.teachers)
  @JoinTable({
    name: 'teachers_subject_subjects', // Name of the join table
    joinColumn: {
      name: 'teacherId', // Column name for the teacher ID in the join table
      referencedColumnName: 'id', // Referenced column in the Teacher entity
    },
    inverseJoinColumn: {
      name: 'subjectId', // Column name for the subject ID in the join table
      referencedColumnName: 'id', // Referenced column in the Subject entity
    },
  })
  subjects: Subject[];
}
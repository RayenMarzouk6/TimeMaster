import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Schedule } from '../schedule/schedule.entity';
import { Subject } from '../subject/subject.entity';

@Entity('classrooms')
export class Classroom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string; // Name of the classroom (e.g., Room 101, A, etc.)

  @OneToMany(() => Schedule, (schedule) => schedule.classroom)
  schedules: Schedule[];

  @ManyToMany(() => Subject, (subject) => subject.classrooms)
  @JoinTable({
    name: 'classroom_subjects_subject', // Name of the join table
    joinColumn: { name: 'classroomId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'subjectId', referencedColumnName: 'id' },
  })
  subjects: Subject[];
}
import { Classroom } from 'src/classroom/classroom.entity';
import { Schedule } from 'src/schedule/schedule.entity';
import { Teacher } from 'src/teachers/teachers.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string; 

  @OneToMany(() => Schedule, (schedule) => schedule.subject)
  schedules: Schedule[];
  @ManyToMany(() => Teacher, (teacher) => teacher.subjects)
  teachers: Teacher[];
  @ManyToMany(() => Classroom, (classroom) => classroom.subjects)
  classrooms: Classroom[];
}
